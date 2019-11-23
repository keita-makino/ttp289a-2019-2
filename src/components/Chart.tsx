import React, { useState, useEffect } from 'react';
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
import { Box, Typography, Button, Icon } from '@material-ui/core';
import { Data, Input } from '../data/Data';

type Props = {
  title: string;
  output: number[];
  truth: number[];
  data: Data[];
};

export type DataSeries = {
  label: string;
  values: number[];
};

const Chart: React.FC<Props> = (props: Props) => {
  const labels = Object.keys(props.data[0]) as Input[];
  const [show, setShow] = useState(false);
  const [X, setX] = useState('');
  const [Y, setY] = useState('');

  const indexer = Array(4)
    .fill(0)
    .map(item => Array(0));

  // props.output.map((item, index) => {
  //   const comb = [item, props.truth[index]];
  //   if (item === 1 && props.truth[index] === 1) {
  //     indexer[0].push(index);
  //   } else if (item === 1 && props.truth[index] === 0) {
  //     indexer[1].push(index);
  //   } else if (item === 0 && props.truth[index] === 0) {
  //     indexer[2].push(index);
  //   } else if (item === 0 && props.truth[index] === 1) {
  //     indexer[3].push(index);
  //   }
  // });
  // console.log(indexer);

  // let dataArray;
  // if (X === '' && Y === '') {
  //   dataArray = indexer.map(array =>
  //     array.map(item => ({ x: item, y: props.truth[item] }))
  //   );
  // } else if (Y === '') {
  //   const arrayX = props.data.filter(item => item.label === X)[0].values;
  //   dataArray = indexer.map(array =>
  //     array.map(item => ({ x: arrayX[item], y: props.truth[item] }))
  //   );
  // } else {
  //   const arrayX = props.data.filter(item => item.label === X)[0].values;
  //   const arrayY = props.data.filter(item => item.label === Y)[0].values;
  //   dataArray = indexer.map(array =>
  //     array.map(item => ({ x: arrayX[item], y: arrayY[item] }))
  //   );
  // }

  return (
    <Box
      margin={'0.6rem 0 0.6rem 0'}
      style={{ boxSizing: 'border-box', border: '1px gray solid' }}
    >
      {/*      <XYPlot
        colorType="literal"
        width={720}
        height={360}
        margin={{ left: 85, bottom: 65, right: 25 }}
        yType={Y === '' ? 'ordinal' : 'linear'}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <ChartLabel
          text={X !== '' ? X : 'Index of respondent'}
          xPercent={0.47}
          yPercent={0.72}
          style={{
            textAnchor: 'center'
          }}
        />
        <ChartLabel
          text={Y !== '' ? Y : 'Telecommuting (Predicted)'}
          xPercent={0.03}
          yPercent={0.48}
          style={{
            transform: 'rotate(-90)',
            textAnchor: 'center'
          }}
        />
        <MarkSeries
          animation={'stiff'}
          color={'#FF7777'}
          data={dataArray[3] as MarkSeriesPoint[]}
        ></MarkSeries>
        <MarkSeries
          animation={'stiff'}
          color={'#7777FF'}
          data={dataArray[1] as MarkSeriesPoint[]}
        ></MarkSeries>
        <MarkSeries
          animation={'stiff'}
          color={'#333399'}
          data={dataArray[2] as MarkSeriesPoint[]}
        ></MarkSeries>
        <MarkSeries
          animation={'stiff'}
          color={'#993333'}
          data={dataArray[0] as MarkSeriesPoint[]}
        ></MarkSeries>
      </XYPlot>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        margin={'0.25rem'}
      >
        <Box>
          <b>
            {props.title} (Pred. true=
            {props.output.filter(item => item === 1).length}, Actual true=
            {props.truth.filter(item => item === 1).length})
          </b>
          {props.title === 'Figure 2. Estimate by Basic Logit Model' ? (
            <>
              <br />
              <span>
                Blue / red color respectively represents that the estimate is
                true (doing telecommuting).
                <br />
                Thicker color represents that the estimate was correct.
              </span>
            </>
          ) : null}
        </Box>
        <Box>
          <Button
            onClick={() => {
              setShow(!show);
            }}
            size="small"
            variant="contained"
            style={{
              marginLeft: '0.8rem'
            }}
          >
            +
          </Button>
        </Box>
      </Box>

      {show ? (
        <>
          <hr />

          <Box
            display={'flex'}
            flexWrap="wrap"
            alignItems={'center'}
            margin={'0.25rem'}
          >
            <Typography>x:</Typography>
            {labels.map(item => (
              <Button
                onClick={() => {
                  setX(item);
                }}
                style={{ margin: '0.5rem' }}
                variant="contained"
              >
                {item}
              </Button>
            ))}
          </Box>
        </>
      ) : null}
      {X !== '' ? (
        <>
          <hr />
          <Box
            display={'flex'}
            flexWrap="wrap"
            alignItems={'center'}
            margin={'0.25rem'}
          >
            <Typography>y:</Typography>
            {labels.map(item => (
              <Button
                onClick={() => {
                  setY(item);
                }}
                style={{ margin: '0.5rem' }}
                variant="contained"
              >
                {item}
              </Button>
            ))}
          </Box>
        </>
      ) : null} */}
    </Box>
  );
};

export default Chart;
