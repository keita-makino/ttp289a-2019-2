import React from 'react';
import {
  XYPlot,
  MarkSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  MarkSeriesPoint,
  ChartLabel
} from 'react-vis';
import { Box, Typography } from '@material-ui/core';
import { data } from '@tensorflow/tfjs';

type Props = {
  title: string;
  output: string[];
  truth: string[];
  x?: number[];
  y?: number[];
};

const Chart: React.FC<Props> = (props: Props) => {
  const dataTT = props.output
    .map((item, index) => ({ index: index, value: item }))
    .filter(item => item.value === 'true')
    .filter(item => props.truth[item.index] === 'true');
  const dataTF = props.output
    .map((item, index) => ({ index: index, value: item }))
    .filter(item => item.value === 'true')
    .filter(item => props.truth[item.index] === 'false');
  const dataFF = props.output
    .map((item, index) => ({ index: index, value: item }))
    .filter(item => item.value === 'false')
    .filter(item => props.truth[item.index] === 'false');
  const dataFT = props.output
    .map((item, index) => ({ index: index, value: item }))
    .filter(item => item.value === 'false')
    .filter(item => props.truth[item.index] === 'true');

  const dataArray = [dataTT, dataTF, dataFF, dataFT].map(array =>
    array.map(item => ({ x: item.index, y: item.value }))
  );

  return (
    <Box style={{ boxSizing: 'border-box', border: '1px gray solid' }}>
      {(() => {
        if (props.x === undefined && props.y === undefined) {
          return (
            <XYPlot
              colorType="literal"
              width={720}
              height={480}
              yType="ordinal"
              margin={{ left: 85, bottom: 60, right: 25 }}
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis />
              <ChartLabel
                text={'Index of respondent'}
                xPercent={0.5}
                yPercent={0.8}
                style={{
                  textAnchor: 'middle'
                }}
              />
              <YAxis />
              <ChartLabel
                text={'Telecommuting (Predicted)'}
                xPercent={0.03}
                yPercent={0.32}
                style={{
                  transform: 'rotate(-90)',
                  textAnchor: 'middle'
                }}
              />
              <MarkSeries
                animation={'stiff'}
                color={'#FF7777'}
                data={dataArray[3] as MarkSeriesPoint[]}
              ></MarkSeries>
              <MarkSeries
                animation={'stiff'}
                color={'#993333'}
                data={dataArray[2] as MarkSeriesPoint[]}
              ></MarkSeries>
              <MarkSeries
                animation={'stiff'}
                color={'#7777FF'}
                data={dataArray[1] as MarkSeriesPoint[]}
              ></MarkSeries>
              <MarkSeries
                animation={'stiff'}
                color={'#333399'}
                data={dataArray[0] as MarkSeriesPoint[]}
              ></MarkSeries>
            </XYPlot>
          );
        }
      })()}
      <Box margin={'0.25rem'}>
        <b>
          {props.title} (Pred. true=
          {props.output.filter(item => item === 'true').length}, Actual true=
          {props.truth.filter(item => item === 'true').length})
        </b>
        <br />
        <span>
          Blue and red color respectively represents that the estimate is true
          (doing telecommuting).
          <br />
          Thicker color represents that the estimate was correct.
        </span>
      </Box>
    </Box>
  );
};

export default Chart;
