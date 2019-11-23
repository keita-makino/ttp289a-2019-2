import data from '../data/data.json';
import { Input, Data } from '../data/Data';

export type DataStats = {
  [key in Input]: {
    mean: number;
    sd: number;
  };
};

const createData = (inputs: Input[]) => {
  if (inputs.length === 0) {
    return {
      data: [],
      stats: [],
      y: data.reduce(
        (acc, current) =>
          current['modechos'] !== null
            ? [...acc, current['modechos']]
            : [...acc],
        [] as number[]
      )
    };
  }
  const stats = inputs.reduce((acc: any, current: Input) => {
    return { ...acc, [current]: { mean: 0, sd: 0 } };
  }, {});

  const y = [] as number[];
  const invalidIds = [] as number[];

  const array: Data[] = (data as Data[]).reduce(
    (acc: Data[], record: Data, index) => {
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
            invalidIds.concat([index, index + 1, index + 2]);
            break;
          case 1:
            invalidIds.concat([index - 1, index, index + 1]);
            break;
          default:
            invalidIds.concat([index - 2, index - 1, index]);
            break;
        }
        return [...acc];
      } else {
        y.push(record['modechos']!);
        return [...acc, element];
      }
    },
    []
  );

  array.filter((item, index) => !invalidIds.includes(index));

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
