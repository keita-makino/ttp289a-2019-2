import data from '../data/data.json';
import { Input, Data } from '../data/Data';

const createData = (input: Input[]) => {
  const stats = input.reduce((acc, current) => {
    return { ...acc, [current]: { mean: 0, sd: 0 } };
  }, {});

  const array = (data as Data[]).reduce(
    (acc: any[], current: Data, index: number) => {
      let isInvalid = false;
      const record = input.reduce(
        (acc2: any, current2: Input, index2: number) => {
          if (current[current2] === null) {
            isInvalid = true;
          }
          return { ...acc2, current2: current[current2] };
        },
        {}
      );
      return isInvalid ? [...acc] : [...acc, record];
    },
    [] as any[]
  );
  return { array: array };
};

export default createData;
