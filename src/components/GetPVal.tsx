import React from 'react';
import { jStat } from 'jstat';

const GetPVal = (props: { x: any; k: any }) => {
  const p = 1 - jStat.chisquare.cdf(props.x, props.k);
  console.log(`p-value: ${p}`);
  if (p.toString() === '0') {
    console.log('p-value is less than 1.0e-16');
  }
  return <></>;
};

export default GetPVal;
