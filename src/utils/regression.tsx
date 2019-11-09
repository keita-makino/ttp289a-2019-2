import * as tf from '@tensorflow/tfjs';

const regression = async (input: any[], targetVariable: string) => {
  const x = input.map(item => {
    const { OVERTIME, CSO9FT9, EFACT6, MANCONST, JOBCONST } = item;
    return [[OVERTIME, CSO9FT9, EFACT6, MANCONST, JOBCONST], [0, 0, 0, 0, 0]];
  });
  const y = input.map(item =>
    Array.from(tf.oneHot(item[targetVariable], 2).dataSync())
  );

  const weights = tf
    .variable(tf.randomNormal([5, 1]), true)
    .expandDims(0)
    .tile([337, 1, 1]);
  const bias = tf.variable(tf.ones([1]), true);
  bias.print();

  const u = (x: any) => {
    const matrix = tf
      .tensor(x)
      .matMul(weights)
      .add(bias)
      .as2D(x.length, 2);
    tf.tensor(x)
      .matMul(weights)
      .print();
    return matrix.div(
      matrix
        .sum(1)
        .reshape([x.length, 1])
        .tile([1, 2])
    );
  };
  u(x);
  console.log(tf.tensor(y).dataSync());

  const container = { m: u, w: weights, b: bias };

  const loss = (pred: any, truth: any) => {
    pred.print();
    console.log('hoge');
    tf.metrics
      .categoricalCrossentropy(truth, pred)
      .sum()
      .print();
    return tf.metrics.categoricalCrossentropy(pred, truth).sum() as tf.Tensor<
      tf.Rank.R0
    >;
  };

  const optimizer = tf.train.sgd(0.01);

  const vars = [];
  if (container.w !== null) {
    vars.push(container.w);
  }
  if (container.b !== null) {
    vars.push(container.b);
  }

  if (vars.length > 0) {
    for (let index = 0; index < 100; index++) {
      // optimizer.minimize(() => loss(container.m(x), tf.tensor(y)));
      // console.log(weights.dataSync());
      // console.log(bias.dataSync());
      // console.log(loss(container.m(x), tf.tensor(y)).dataSync());
    }
  }
};

export default regression;
