import data from '../data/data.json';
import { Input, Data } from '../data/Data';

const createData = (inputs: Input[]) => {
  const stats = inputs.reduce((acc: any, current: Input) => {
    return { ...acc, [current]: { mean: 0, sd: 0 } };
  }, {});

  const y = [] as number[];

  const array: Data[] = (data as Data[]).reduce((acc: Data[], record: Data) => {
    let isInvalid = false;
    const element = inputs.reduce((acc2: Data, input: Input) => {
      if (record[input] === undefined) {
        isInvalid = true;
      }
      return { ...acc2, [input]: record[input] };
    }, {});
    if (isInvalid) {
      y.push(record['modechos']!);
      return [...acc];
    } else {
      return [...acc, element];
    }
  }, [] as Data[]);

  array.map(record => {
    inputs.map(input => {
      stats[input].mean += record[input];
      stats[input].sd += Math.pow(record[input]!, 2);
    });
  });

  inputs.map(input => {
    stats[input].mean /= array.length;
    stats[input].sd =
      stats[input].sd / array.length - Math.pow(stats[input].mean, 2);
  });

  array.map(record => {
    inputs.map(input => {
      record[input] = (record[input]! - stats[input].mean) / stats[input].sd;
    });
  });

  return { data: array, stats: stats, y: y };
};

export default createData;
