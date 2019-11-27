import * as tf from '@tensorflow/tfjs';
import { Data, Input } from '../data/Data';
import { useEffect, useState } from 'react';
import { sqrt, multiply, inv, diag } from 'mathjs';

export type History = {
  weights: number[];
  bias: number[];
  loss: number;
  estimate: number[][];
};
export type ResultStats = {
  coefSds: number[];
  tValue: number[];
  rho: number;
  rho2: number;
};

const useRegression = (
  data: Data[],
  inputs: Input[],
  yData: number[],
  dim: number,
  base: number
) => {
  const [result, setResult] = useState({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const func = async () => {
      const stats: ResultStats = {
        coefSds: [] as number[],
        tValue: [] as number[],
        rho: 0,
        rho2: 0
      };
      const returnValue = {
        history: [] as History[],
        lastState: {} as History,
        stats: stats
      };
      const dataLength = yData.length;
      const sampleLength = yData.length / dim;

      const xData = Array(Math.max(1, inputs.length))
        .fill(0)
        .map(() => Array(dataLength).fill(0));

      if (inputs.length > 0) {
        inputs.map((input, inputIndex) => {
          data.map((record, recordIndex) => {
            xData[inputIndex][recordIndex] = data[recordIndex][input];
          });
        });
      }

      let x: any;

      if (inputs.length > 0) {
        x = tf.tidy(() => tf.tensor2d(xData, [inputs.length, dataLength]));
      } else {
        x = tf.tidy(() => tf.tensor2d(xData, [1, dataLength]));
      }
      const y = tf.tidy(() => tf.tensor(yData));

      const weights = tf.tidy(() =>
        tf.variable(tf.zeros([1, Math.max(1, inputs.length)]), true)
      );
      const bias = tf.tidy(() =>
        tf.variable(tf.tensor(Array(dim - 1).fill(0)), true)
      );

      const u = (x: any) => {
        const mat = weights
          .matMul(x)
          .as1D()
          .reshape([sampleLength, dim])
          .add(bias.concat(tf.tensor([0])))
          .exp();
        const s = mat
          .sum(1)
          .as2D(sampleLength, 1)
          .tile([1, dim]);
        return mat.div(s);
      };

      const loss = (pred: any, truth: any) => {
        return tf.tidy(() => {
          return tf.metrics
            .categoricalCrossentropy(truth.as2D(sampleLength, dim), pred)
            .sum();
        }) as tf.Tensor<tf.Rank.R0>;
      };
      const optimizer = tf.train.adam(0.03);

      for (let index = 0; index < 1000; index++) {
        optimizer.minimize(
          () => {
            const currentLoss = loss(u(x), y);
            returnValue.history.push({
              weights: Array.from(weights.dataSync()),
              bias: Array.from(bias.dataSync()),
              loss: currentLoss.dataSync()[0],
              estimate: u(x).arraySync() as number[][]
            } as History);
            if (index > 10) {
              if (
                Math.abs(
                  returnValue.history[returnValue.history.length - 1].loss -
                    returnValue.history[returnValue.history.length - 11].loss
                ) < 0.0005
              ) {
                index = 1000;
              }
            }
            if (index % 25 === 0) {
              console.log(currentLoss.dataSync()[0].toFixed(6));
            }
            return currentLoss;
          },
          true,
          [weights, bias]
        );
      }
      returnValue.lastState =
        returnValue.history[returnValue.history.length - 1];

      const xs = tf.tidy(() => {
        const eyes = tf.eye(dim - 1, dim).tile([1, sampleLength]);
        return inputs.length === 0 ? eyes : eyes.concat(x);
      });

      //

      xs.print();

      const hessian = Array(dim - 1 + inputs.length)
        .fill(0)
        .map(item => Array(dim - 1 + inputs.length).fill(0));

      console.log(hessian);
      console.log(
        Array(dim - 1 + inputs.length)
          .fill(0)
          .map(item => Array(dim - 1 + inputs.length).fill(0))
      );
      hessian.map((input, index, array) => {
        for (let index2 = 0; index2 < array.length; index2++) {
          const mat = tf.tidy(() =>
            xs
              .slice([index, 0], [1, dataLength])
              .as2D(sampleLength, dim)
              .mul(tf.tensor(returnValue.lastState.estimate))
              .sum(1)
              .as2D(sampleLength, 1)
              .tile([1, dim])
              .mul(-1)
              .add(
                xs.slice([index, 0], [1, dataLength]).as2D(sampleLength, dim)
              )
              .mul(
                xs
                  .slice([index2, 0], [1, dataLength])
                  .as2D(sampleLength, dim)
                  .mul(tf.tensor(returnValue.lastState.estimate))
                  .sum(1)
                  .as2D(sampleLength, 1)
                  .tile([1, dim])
                  .mul(-1)
                  .add(
                    xs
                      .slice([index2, 0], [1, dataLength])
                      .as2D(sampleLength, dim)
                  )
              )
              .as1D()
              .mul(tf.tensor(returnValue.lastState.estimate).as1D())
              .sum()
              .mul(-1)
          );
          hessian[index][index2] = mat.dataSync()[0];
          mat.dispose();
        }
      });

      returnValue.stats.coefSds = diag(sqrt(multiply(inv(hessian), -1)));

      const logLikelihood = -returnValue.lastState.loss;
      const logLikelihoodEL = -sampleLength * Math.log(dim);

      stats.rho = 1 - logLikelihood / logLikelihoodEL;
      stats.rho2 =
        1 - (logLikelihood - inputs.length - dim + 1) / logLikelihoodEL;

      stats.tValue = [
        ...returnValue.lastState.bias,
        ...(returnValue.lastState.weights ? returnValue.lastState.weights : [])
      ].map((item, index) => item / stats.coefSds[index]);
      console.log(stats.coefSds);
      console.log(stats.tValue);
      x.dispose();
      xs.dispose();
      y.dispose();
      weights.dispose();
      bias.dispose();
      setLoading(false);
      setResult(returnValue);
    };

    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [result, loading];
};

export default useRegression;
