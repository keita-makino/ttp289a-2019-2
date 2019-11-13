import React from 'react';
import {
  XYPlot,
  BarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  MarkSeriesPoint,
  ChartLabel
} from 'react-vis';
import { Box } from '@material-ui/core';

type Props = {};

const Bar: React.FC<Props> = (props: Props) => {
  return (
    <Box style={{ boxSizing: 'border-box', border: '1px gray solid' }}>
      <XYPlot
        colorType="literal"
        width={720}
        height={480}
        yType={props.y === undefined ? 'ordinal' : props.y.label}
        margin={{ left: 85, bottom: 60, right: 25 }}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <ChartLabel
          text={props.x ? props.x.label : 'Index of respondent'}
          xPercent={0.5}
          yPercent={0.8}
          style={{
            textAnchor: 'center'
          }}
        />
        <ChartLabel
          text={props.y ? props.y.label : 'Telecommuting (Predicted)'}
          xPercent={0.03}
          yPercent={0.5}
          style={{
            transform: 'rotate(-90)',
            textAnchor: 'center'
          }}
        />
      </XYPlot>
    </Box>
  );
};

export default Bar;
