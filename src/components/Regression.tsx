import React from 'react';
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography
} from '@material-ui/core';
import * as tf from '@tensorflow/tfjs';

import useRegression from '../utils/useRegression';
import dictionary from '../data/dictionary.json';
import Chart from './Chart';

type Props = {
  type: 'logit' | 'probit';
  data: any[];
  input: {
    name: string;
    location: number;
    type?: string;
  }[];
  table: Table;
  outPlot: OutPlot;
};

type Table = {
  title: string;
};

type OutPlot = {
  title: string;
  x: string;
  y: string;
};

const getP = (t: string) => {
  return tf
    .scalar(-Math.abs(parseFloat(t)))
    .div(Math.sqrt(2))
    .erf()
    .add(1)
    .dataSync()[0];
};

const Regression: React.FC<Props> = (props: Props) => {
  const result = useRegression(
    props.type,
    props.data,
    props.input,
    'C3H17M',
    2
  );
  const lastState = result.lastState;
  const stats = (({ sds, means, rho, rho2, coefSds, tValue }) => ({
    sds,
    means,
    rho,
    rho2,
    coefSds,
    tValue
  }))(result);

  return (
    <>
      {(() => {
        if (props.table !== null) {
          return (
            <Table size="small">
              <TableHead>
                <TableRow style={{ backgroundColor: '#AAAAAA' }}>
                  <TableCell>
                    <b>
                      {props.table.title} (N={props.data.length})
                    </b>
                  </TableCell>
                  <TableCell>S.D. (var)</TableCell>
                  <TableCell>Mean (var)</TableCell>
                  <TableCell>Estimate</TableCell>
                  <TableCell>t-Sta.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>bias</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{lastState.bias}</TableCell>
                  <TableCell>
                    {stats.tValue[0]}
                    {getP(stats.tValue[0]) < 0.05 ? '*' : null}
                  </TableCell>
                </TableRow>
                {props.input.length === 0
                  ? null
                  : lastState.weights.map((item, index) => {
                      const key = props.input[index]
                        .name as keyof typeof dictionary;
                      return (
                        <TableRow>
                          <TableCell>{dictionary[key]}</TableCell>
                          <TableCell>{stats.sds[index]}</TableCell>
                          <TableCell>{stats.means[index]}</TableCell>
                          <TableCell>{item}</TableCell>
                          <TableCell>
                            {stats.tValue[index + 1]}
                            {getP(stats.tValue[index + 1]) < 0.05
                              ? '**'
                              : getP(stats.tValue[index + 1]) < 0.1
                              ? '*'
                              : null}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                <TableRow style={{ backgroundColor: '#DDDDDD' }}>
                  <TableCell rowSpan={2}>Statistics</TableCell>
                  <TableCell>log-likelihood</TableCell>
                  <TableCell>
                    -{parseFloat(lastState.loss).toFixed(3)}
                  </TableCell>
                  <TableCell>log-likelihood(EL)</TableCell>
                  <TableCell>
                    -{(Math.log(2) * props.data.length).toFixed(3)}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#DDDDDD' }}>
                  <TableCell>r-squared</TableCell>
                  <TableCell>{stats.rho}</TableCell>
                  <TableCell>adj. r-squared</TableCell>
                  <TableCell>{stats.rho2}</TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#DDDDDD' }}>
                  <TableCell colSpan={5}>
                    t-Statistic with ** / * indicates that it is significant
                    with 95% / 90% confidential level
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          );
        }
      })()}
      <br />
      {(() => {
        if (props.outPlot !== undefined) {
          return (
            <Chart
              title={props.outPlot.title}
              output={lastState.estimate}
              truth={props.data.map(item =>
                item['C3H17M'] === 1 ? 'true' : 'false'
              )}
            ></Chart>
          );
        }
      })()}
    </>
  );
};

export default Regression;
