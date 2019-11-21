import data from '../data/data.json';
import { Input, Data } from '../data/Data';

const createData = (input: Input[]) => {
  const array = (data as any[]).reduce(
    (acc: number[], current: Data, index: number) => {
      let isInvalid = false;
      input.map(item => {
        if (current[item as keyof typeof data[0]] === null) {
          isInvalid = true;
        }
      });
      if (!isInvalid) {
        return [...acc, index];
      } else {
        return acc;
      }
    },
    [] as number[]
  );
  return array;
};

export default createData;
