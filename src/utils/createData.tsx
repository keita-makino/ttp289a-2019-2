import data from '../data/data.json';
import { Input, Data } from '../data/Data';

export type DataStats = {
  [key in Input]: {
    mean: number;
    sd: number;
  };
};

const createData = (inputs: Input[], base: number) => {
  let y = [] as number[];
  const invalidIds = [] as number[];

  const stats = inputs.reduce((acc: any, current: Input) => {
    return { ...acc, [current]: { mean: 0, sd: 0 } };
  }, {});

  let array: Data[] = (data as Data[])
    .reduce((acc: Data[], record: Data, index) => {
      let isInvalid = false;
      const element = inputs.reduce((acc2: Data, input: Input) => {
        if (record[input] === null) {
          isInvalid = true;
        }
        return { ...acc2, [input]: record[input] };
      }, {});
      if (isInvalid) {
        switch (index % 3) {
          case 0:
            invalidIds.push(index, index + 1, index + 2);
            break;
          case 1:
            invalidIds.push(index - 1, index, index + 1);
            break;
          default:
            invalidIds.push(index - 2, index - 1, index);
            break;
        }
      }
      y.push(record['modechos']!);
      return [...acc, element];
    }, [])
    .filter((item, index) => !invalidIds.includes(index));

  y = y.filter((item, index) => !invalidIds.includes(index));

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

  // array.map(record => {
  //   inputs.map(input => {
  //     record[input] = (record[input]! - stats[input].mean) / stats[input].sd;
  //   });
  // });

  const ySorted = [];
  const arraySorted = [];

  switch (base) {
    case 0:
      for (let index = 0; index < array.length; index += 3) {
        ySorted.push(y[index + 1], y[index + 2], y[index]);
        arraySorted.push(array[index + 1], array[index + 2], array[index]);
      }
      y = ySorted;
      array = arraySorted;
      break;
    case 1:
      for (let index = 0; index < array.length; index += 3) {
        ySorted.push(y[index], y[index + 2], y[index + 1]);
        arraySorted.push(array[index], array[index + 2], array[index + 1]);
      }
      y = ySorted;
      array = arraySorted;
      break;
    default:
      break;
  }
  return { data: array, stats: stats, y: y };
};

export default createData;
