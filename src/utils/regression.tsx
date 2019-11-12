import * as tf from '@tensorflow/tfjs';

const regression = async (input: any[], targetVariable: string) => {
  const x = input.map(item => {
    const { OVERTIME, CSO9FT9, EFACT6, MANCONST, JOBCONST } = item;
    return [OVERTIME, CSO9FT9, EFACT6, MANCONST, JOBCONST];
  });
  const y = input.map(item => item[targetVariable]);

  const weights = tf.variable(tf.ones([x[0].length, 1]), true);
  const bias = tf.variable(tf.ones([1]), true);

  console.log(x);
  console.log(tf.data.array(x));

  const u = (x: any) =>
    tf
      .tensor(x)
      .matMul(weights)
      .add(bias)
      .sigmoid()
      .as1D();

  const container = { m: u, w: weights, b: bias };

  const loss = (pred: any, truth: any) => {
    return tf.metrics.binaryCrossentropy(pred, truth) as tf.Tensor<tf.Rank.R0>;
  };

  const optimizer = tf.train.sgd(0.01);

  const vars = [];
  if (container.w !== null) {
    vars.push(container.w);
  }
  if (container.b !== null) {
    vars.push(container.b);
  }
  console.log(vars);

  if (vars.length > 0) {
    for (let index = 0; index < 100; index++) {
      optimizer.minimize(() => loss(container.m(x), tf.tensor(y)));
      console.log(weights.dataSync());
      console.log(bias.dataSync());
      console.log(loss(container.m(x), tf.tensor(y)).dataSync());
    }
  }
};

export default regression;
