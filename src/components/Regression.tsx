import React, { useEffect, useState } from 'react';

import createData from '../utils/createData';
import useRegression from '../utils/useRegression';
import Chart from './Chart';
import { Input } from '../data/Data';
import Table from './Table';

type Props = {
  inputs: Input[];
  base: number;
  table?: TableProps;
  outPlot?: OutPlotProps;
};

type TableProps = {
  title: string;
  hideDetails: boolean;
};

type OutPlotProps = {
  title: string;
  x: string;
  y: string;
};

const Regression: React.FC<Props> = (props: Props) => {
  const { data, stats, y } = createData(props.inputs);
  const [result, loading] = useRegression(data, props.inputs, y, 3, props.base);

  return (
    <>
      {props.table !== undefined && !loading ? (
        <Table
          inputs={props.inputs}
          lastState={result.lastState}
          resultStats={result.stats}
          dataStats={stats}
          title={props.table.title}
          dataLength={result.lastState.estimate.length}
          hideDetails={props.table.hideDetails}
        />
      ) : (
        <div>loading...</div>
      )}
      <br />
      {props.outPlot !== undefined && !loading ? (
        <Chart
          title={props.outPlot.title}
          output={result.lastState.estimate}
          truth={y}
          data={data}
        />
      ) : null}
    </>
  );
};

export default Regression;
