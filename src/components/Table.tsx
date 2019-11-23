import React from 'react';
import {
  Table as TableMui,
  TableHead,
  TableCell,
  TableRow,
  TableBody
} from '@material-ui/core';
import TeX from '@matejmazur/react-katex';
import { History, ResultStats } from '../utils/useRegression';
import { Input } from '../data/Data';

import * as tf from '@tensorflow/tfjs';
import { DataStats } from '../utils/createData';

type Props = {
  inputs: Input[];
  lastState: History;
  resultStats: ResultStats;
  dataStats: DataStats;
  title: string;
  dataLength: number;
  hideDetails: boolean;
};

const getP = (t: number) => {
  return tf
    .scalar(-Math.abs(t))
    .div(Math.sqrt(2))
    .erf()
    .add(1)
    .dataSync()[0];
};

const Table: React.FC<Props> = (props: Props) => {
  console.log(props);
  return (
    <TableMui size="small">
      <TableHead>
        <TableRow style={{ backgroundColor: '#AAAAAA' }}>
          <TableCell>
            <b>
              {props.title} (N={props.dataLength})
            </b>
          </TableCell>
          <TableCell>S.D. (var)</TableCell>
          <TableCell>Mean (var)</TableCell>
          <TableCell>Estimate</TableCell>
          <TableCell>t-Sta.</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.hideDetails ? null : (
          <>
            {props.lastState.bias.map((item, index) => (
              <TableRow>
                <TableCell>(bias {index})</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{item.toFixed(3)}</TableCell>
                <TableCell>
                  {props.resultStats.tValue[0].toFixed(3)}
                  {getP(props.resultStats.tValue[0]) < 0.05 ? '*' : null}
                </TableCell>
              </TableRow>
            ))}

            {props.inputs.length === 0
              ? null
              : props.lastState.weights.map((item, index) => {
                  const key = props.inputs[index];
                  return (
                    <TableRow>
                      <TableCell>{key}</TableCell>
                      <TableCell>
                        {props.dataStats[key].sd.toFixed(3)}
                      </TableCell>
                      <TableCell>
                        {props.dataStats[key].mean.toFixed(3)}
                      </TableCell>
                      <TableCell>{item.toFixed(3)}</TableCell>
                      <TableCell>
                        {props.resultStats.tValue[index + 1].toFixed(3)}
                        {getP(props.resultStats.tValue[index + 1]) < 0.05
                          ? '**'
                          : getP(props.resultStats.tValue[index + 1]) < 0.1
                          ? '*'
                          : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </>
        )}

        <TableRow style={{ backgroundColor: '#DDDDDD' }}>
          <TableCell rowSpan={2}>Statistics</TableCell>
          <TableCell>log-likelihood</TableCell>
          <TableCell>-{props.lastState.loss.toFixed(3)}</TableCell>
          <TableCell>log-likelihood(EL)</TableCell>
          <TableCell>
            -
            {(
              Math.log(props.lastState.bias.length + 1) * props.dataLength
            ).toFixed(3)}
          </TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: '#DDDDDD' }}>
          <TableCell>r-squared</TableCell>
          <TableCell>{props.resultStats.rho.toFixed(3)}</TableCell>
          <TableCell>adj. r-squared</TableCell>
          <TableCell>{props.resultStats.rho2.toFixed(3)}</TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: '#DDDDDD' }}>
          <TableCell colSpan={5}>
            t-Statistic with ** / * indicates that it is significant with 95% /
            90% confidential level
          </TableCell>
        </TableRow>
      </TableBody>
    </TableMui>
  );
};

export default Table;
