import * as tf from '@tensorflow/tfjs';
import { Data, Input } from '../data/Data';
import { useEffect, useState } from 'react';

export type History = {
  weights: number[];
  bias: number[];
  loss: number;
  estimate: number[];
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

      const getBias = (bias: any) => {
        return base === bias.arraySync().length
          ? bias.slice([0], base).concat(tf.tensor([0]))
          : bias
              .slice([0], base)
              .concat(tf.tensor([0]))
              .concat(bias.slice(base + 1));
      };

      const u = (x: any) => {
        const mat = weights
          .matMul(x)
          .as1D()
          .reshape([sampleLength, dim])
          .add(getBias(bias))
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
      const optimizer = tf.train.adam(0.1);

      for (let index = 0; index < 1000; index++) {
        optimizer.minimize(
          () => {
            const currentLoss = loss(u(x), y);
            returnValue.history.push({
              weights: Array.from(weights.dataSync()),
              bias: Array.from(bias.dataSync()),
              loss: currentLoss.dataSync()[0],
              estimate: u(x)
                .argMax(1)
                .arraySync() as number[]
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

      const logLikelihood = -returnValue.lastState.loss;
      const logLikelihoodEL = -sampleLength * Math.log(dim);

      stats.rho = 1 - logLikelihood / logLikelihoodEL;
      stats.rho2 =
        1 - (logLikelihood - inputs.length - dim + 1) / logLikelihoodEL;

      // stats.coefSds = (inputs);

      stats.tValue = [
        ...returnValue.lastState.bias,
        ...returnValue.lastState.weights
      ].map((item, index) => item / stats.coefSds[index]);
      console.log([
        bias.dataSync(),
        ...(weights.as1D().arraySync() as number[])
      ]);
      console.log(stats.coefSds);
      console.log(stats.tValue);
      x.dispose();
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
