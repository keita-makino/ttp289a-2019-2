import * as tf from '@tensorflow/tfjs';
import { Data, Input } from '../data/Data';
import { useEffect, useState } from 'react';

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
      const optimizer = tf.train.adam(0.2);

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

      // xs is [featureLength + dim -1] x [sampleSize x dim] 2d array
      // [[1   , 0   , 0   , 1   , 0   , 0   , ..., 1   , 0   , 0   ],
      //  [0   , 1   , 0   , 0   , 1   , 0   , ..., 0   , 1   , 0   ],
      //  [x111, x112, x113, x211, x211, x211, ..., xn11, xn12, xn13],
      //  [x121, x122, x123, x221, x221, x221, ..., xn21, xn22, xn23],
      //  ...,
      //  [x1k1, x1k2, x1k3, x2k1, x2k1, x2k1, ..., xnk1, xnk2, xnk3]]
      //
      // index is x(individual)(feature)(alternative)

      xs.print();

      Array(dim - 1)
        .fill(0)
        .concat([...inputs]) // secure an array for loop
        .map((input, index) => {
          stats.coefSds.push(
            // push s.e. to return array
            xs
              .slice([index, 0], [1, dataLength]) // get a vector for kth feature (or ASC)
              .as2D(sampleLength, dim) // convert to 2d
              .mul(tf.tensor(returnValue.lastState.estimate)) // multiply by probability Pn(j)
              .sum(1) // get the row-wise sum (first summation)
              .as2D(sampleLength, 1) // convert
              .tile([1, dim]) // duplicate for further calculation
              .mul(-1)
              .add(
                xs.slice([index, 0], [1, dataLength]).as2D(sampleLength, dim)
              ) // at this point we evaluate xink - \sum_j{xjnk Pn(j)}
              .pow(2) // square
              .as1D() // convert
              .mul(tf.tensor(returnValue.lastState.estimate).as1D()) // multiply by the probability Pn(i)
              .sum() // sum
              .rsqrt() //root
              .dataSync()[0] // return
          );
        });

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
