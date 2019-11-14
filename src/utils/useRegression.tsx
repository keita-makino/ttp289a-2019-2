import * as tf from '@tensorflow/tfjs';

type History = {
  weights: string[];
  bias: string;
  loss: string;
  estimate: string[];
};

const useRegression = (
  type: 'probit' | 'logit',
  data: any[],
  input: any[],
  targetVariable: string,
  dim: number
) => {
  const returnValue = {
    history: [] as History[],
    lastState: {} as History,
    means: [] as any[],
    sds: [] as any[],
    coefSds: [] as any[],
    tValue: [] as any[],
    rho: '',
    rho2: ''
  };

  const xData = Array(Math.max(1, input.length))
    .fill(0)
    .map(() => Array(data.length).fill(0));

  if (input.length > 0) {
    input.map((item, index) => {
      data.map((item2, index2) => {
        xData[index][index2] = item2[item.name];
      });
    });
  }

  xData.map((item, index) => {
    returnValue.means[index] = tf.moments(tf.tensor(item)).mean.dataSync()[0];
    returnValue.sds[index] = tf
      .moments(tf.tensor(item))
      .variance.sqrt()
      .dataSync()[0];
  });

  const yData = data.map(item => item[targetVariable]);

  let x: any;
  if (input.length > 0) {
    x = tf.tidy(() =>
      tf
        .tensor2d(xData, [input.length, data.length])
        .sub(
          tf
            .tensor(returnValue.means)
            .as2D(input.length, 1)
            .tile([1, data.length])
        )
        .div(
          tf
            .tensor(returnValue.sds)
            .as2D(input.length, 1)
            .tile([1, data.length])
        )
    );
  } else {
    x = tf.tidy(() => tf.tensor2d(xData, [1, data.length]));
  }
  const y = tf.tidy(() => tf.tensor(yData));

  const weights = tf.tidy(() =>
    tf.variable(tf.zeros([1, Math.max(1, input.length)]), true)
  );
  const bias = tf.tidy(() => tf.variable(tf.tensor([0]), true));

  const u = (x: any) => {
    if (type === 'probit') {
      return weights
        .matMul(x)
        .as1D()
        .add(bias)
        .div(Math.sqrt(2))
        .erf()
        .add(1)
        .div(2);
    } else {
      return weights
        .matMul(x)
        .as1D()
        .add(bias)
        .sigmoid();
    }
  };

  const loss = (pred: any, truth: any) => {
    return tf.tidy(() =>
      tf.metrics.binaryCrossentropy(truth, pred).mul(data.length)
    ) as tf.Tensor<tf.Rank.R0>;
  };

  const optimizer = tf.train.sgd(
    (0.01 + input.length * 0.001) /
      (type === 'probit' ? Math.PI / Math.sqrt(3) : 1)
  );

  for (let index = 0; index < 1000; index++) {
    optimizer.minimize(
      () => {
        const currentLoss = loss(u(x), y);
        returnValue.history.push({
          weights: Array.from(
            weights
              .div(tf.tidy(() => tf.tensor(returnValue.sds)))
              .mul(type === 'probit' ? Math.PI / Math.sqrt(3) : 1)
              .dataSync()
          ).map(item => item.toFixed(3)),
          bias: bias
            .sub(
              tf
                .tensor(returnValue.means)
                .mul(weights.div(tf.tidy(() => tf.tensor(returnValue.sds))))
                .sum()
            )
            .mul(type === 'probit' ? Math.PI / Math.sqrt(3) : 1)
            .dataSync()[0]
            .toFixed(3),
          loss: currentLoss.dataSync()[0].toFixed(6),
          estimate: (u(x).arraySync() as number[]).map(item =>
            item >= 0.5 ? 'true' : 'false'
          )
        } as History);
        if (index > 10) {
          if (
            Math.abs(
              parseFloat(
                returnValue.history[returnValue.history.length - 1].loss
              ) -
                parseFloat(
                  returnValue.history[returnValue.history.length - 11].loss
                )
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

  returnValue.means = returnValue.means.map(item => item.toFixed(3));
  returnValue.sds = returnValue.sds.map(item => item.toFixed(3));
  returnValue.lastState = returnValue.history[returnValue.history.length - 1];

  const logLikelihood = -returnValue.lastState.loss;
  const logLikelihoodEL = -data.length * Math.log(dim);

  returnValue.rho = (1 - logLikelihood / logLikelihoodEL).toFixed(3);
  returnValue.rho2 = (
    1 -
    (logLikelihood - input.length - dim + 1) / logLikelihoodEL
  ).toFixed(3);

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
  returnValue.coefSds = (xs
    .matMul(v)
    .matMul(xs.transpose())
    .arraySync() as number[][]).map((item, index) =>
    (1 / Math.sqrt(item[index])).toFixed(3)
  );

  returnValue.tValue = [
    returnValue.lastState.bias,
    ...returnValue.lastState.weights
  ].map((item, index) =>
    (parseFloat(item) / returnValue.coefSds[index]).toFixed(3)
  );

  console.log([
    bias.dataSync()[0],
    ...(weights.as1D().arraySync() as number[])
  ]);
  console.log(returnValue.coefSds);
  console.log(returnValue.tValue);

  x.dispose();
  y.dispose();
  weights.dispose();
  bias.dispose();
  xs.dispose();
  v.dispose();

  return returnValue;
};

export default useRegression;
