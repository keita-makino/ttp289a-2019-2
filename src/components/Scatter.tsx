import React from 'react';
import {
  XYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  ChartLabel
} from 'react-vis';
import { Box } from '@material-ui/core';
import data from '../data/data.json';

type Props = { label: string; title: string; caption: string };

const getFreq = (data: number[], xMin: number, xMax: number) => {
  const uniques = data.filter(
    (item, index, array) => array.indexOf(item) === index
  );
  const segment = Math.min(8, Math.max(uniques.length - 1, 1));
  const diff = (xMax - xMin) / segment;
  const thresholds = Array(segment + 1)
    .fill(0)
    .map((_item, index) => xMin + ((xMax - xMin) * index) / segment);
  return thresholds.map((item, index, array) => ({
    x: segment < 3 ? (item === 1 ? 'true' : 'false') : item,
    y: data.filter((item2: number) => {
      if (index < array.length - 1) {
        return item2 >= item && item2 < item + diff;
      } else {
        return item2 >= item && item2 <= item + diff;
      }
    }).length
  }));
};

const Bar: React.FC<Props> = (props: Props) => {
  // const mergedData = data
  //   .map(item => ({
  //     gender: item['FEMALE'],
  //     value: item[props.label as keyof typeof data[0]]!
  //   }))
  //   .filter(item => item.value !== null);
  // const xMin = Math.min(...mergedData.map(item => item.value));
  // const xMax = Math.max(...mergedData.map(item => item.value));
  // const freqM = getFreq(
  //   mergedData.filter(item => item.gender === 0).map(item => item.value),
  //   xMin,
  //   xMax
  // );
  // const freqF = getFreq(
  //   mergedData.filter(item => item.gender === 1).map(item => item.value),
  //   xMin,
  //   xMax
  // );
  return (
    <>
      {/* <Box
        margin={'0.6rem 0 0.6rem 0'}
        style={{ boxSizing: 'border-box', border: '1px gray solid' }}
      >
        <XYPlot
          colorType="literal"
          width={720}
          height={360}
          margin={{ left: 85, bottom: 65, right: 25 }}
          xType={freqM.length < 8 ? 'ordinal' : undefined}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <ChartLabel
            text={props.label ? props.label : 'Index of respondent'}
            xPercent={0.5}
            yPercent={0.72}
            style={{
              textAnchor: 'center'
            }}
          />
          <ChartLabel
            text={'# of Observations'}
            xPercent={0.03}
            yPercent={0.48}
            style={{
              transform: 'rotate(-90)',
              textAnchor: 'center'
            }}
          />
          <VerticalBarSeries data={freqM} />
          <VerticalBarSeries data={freqF} />
        </XYPlot>
        <Box margin={'0.25rem'}>
          <b>
            {props.title} of "
            {dictionary[props.label as keyof typeof dictionary]}" (N(Male) ={' '}
            {freqM.reduce((acc, cur) => acc + cur.y, 0)}, N(Female) =
            {freqF.reduce((acc, cur) => acc + cur.y, 0)})
          </b>
          {props.caption ? (
            <>
              <br />
              <span>{props.caption}</span>
            </>
          ) : null}
        </Box>
      </Box> */}
    </>
  );
};

export default Bar;
