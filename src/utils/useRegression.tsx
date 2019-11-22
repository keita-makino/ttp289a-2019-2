import * as tf from '@tensorflow/tfjs';
import { Data, Input } from '../data/Data';

type History = {
  weights: number[];
  bias: number;
  loss: number;
  estimate: number[];
};

const useRegression = (
  data: Data[],
  inputs: Input[],
  yData: number[],
  dim: number
) => {
  const stats = {
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

  const xData = Array(Math.max(1, inputs.length))
    .fill(0)
    .map(() => Array(data.length).fill(0));

  if (inputs.length > 0) {
    inputs.map((input, inputIndex) => {
      data.map((record, recordIndex) => {
        xData[inputIndex + dim - 1][recordIndex] = data[recordIndex][input];
      });
    });
  }

  let x: any;

  if (inputs.length > 0) {
    x = tf.tidy(() => tf.tensor2d(xData, [inputs.length, data.length]));
  } else {
    x = tf.tidy(() => tf.tensor2d(xData, [1, data.length]));
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
      .reshape([data.length / dim, dim])
      .add(bias.concat(tf.tensor([0])))
      .exp();
    const s = mat
      .sum(1)
      .as2D(data.length / dim, 1)
      .tile([1, dim]);
    return mat.div(s);
  };

  const loss = (pred: any, truth: any) => {
    return tf.tidy(() =>
      tf.metrics.categoricalCrossentropy(truth, pred).sum()
    ) as tf.Tensor<tf.Rank.R0>;
  };
  const optimizer = tf.train.adam();

  for (let index = 0; index < 1000; index++) {
    optimizer.minimize(
      () => {
        const currentLoss = loss(u(x), y);
        returnValue.history.push({
          weights: Array.from(weights.dataSync()),
          bias: bias.dataSync()[0],
          loss: currentLoss.dataSync()[0],
          estimate: u(x)
            .argmax(1)
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

  returnValue.lastState = returnValue.history[returnValue.history.length - 1];

  const logLikelihood = -returnValue.lastState.loss;
  const logLikelihoodEL = -data.length * Math.log(dim);

  stats.rho = 1 - logLikelihood / logLikelihoodEL;
  stats.rho2 = 1 - (logLikelihood - inputs.length - dim + 1) / logLikelihoodEL;

  const xs = tf.tidy(() => tf.tensor([Array(data.length).fill(1), ...xData]));
  const v = tf.tidy(() =>
    tf.tensor(
      Array(data.length)
        .fill(0)
        .map((item, index) => {
          const array = new Array(data.length).fill(0);
          const p = u(x).dataSync()[index];
          array[index] = p * (1 - p);
          return array;
        })
    )
  );

  stats.coefSds = (xs
    .matMul(v)
    .matMul(xs.transpose())
    .arraySync() as number[][]).map(
    (item, index) => 1 / Math.sqrt(item[index])
  );
  stats.tValue = [
    returnValue.lastState.bias,
    ...returnValue.lastState.weights
  ].map((item, index) => item / stats.coefSds[index]);
  console.log([
    bias.dataSync()[0],
    ...(weights.as1D().arraySync() as number[])
  ]);
  console.log(stats.coefSds);
  console.log(stats.tValue);
  x.dispose();
  y.dispose();
  weights.dispose();
  bias.dispose();
  xs.dispose();
  v.dispose();
  return returnValue;
};

export default useRegression;
