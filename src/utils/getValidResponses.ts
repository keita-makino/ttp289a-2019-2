import data from '../data/data.json';

const getValidResponses = (input: string[]) => {
  const array = (data as any[]).reduce(
    (acc: number[], current: typeof data[0], index: number) => {
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

export default getValidResponses;
