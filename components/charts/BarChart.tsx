import { ResponsiveBar } from '@nivo/bar';
import React from 'react';

const theme = {
  background: '#ffffff',
  textColor: '#333333',
  fontSize: 11,
  axis: {
    domain: {
      line: {
        stroke: '#ffffff',
        strokeWidth: 0,
      },
    },
    ticks: {
      line: {
        stroke: '#ffffff',
        strokeWidth: 0,
      },
    },
  },
  grid: {
    line: {
      stroke: '#f2f2f2',
      strokeWidth: 1,
    },
  },
};

const data = [
  {
    country: 'AD',
    burger: 36,
  },
  {
    country: 'AE',
    burger: 125,
  },
  {
    country: 'AF',
    burger: 166,
  },
  {
    country: 'AG',
    burger: 16,
  },
  {
    country: 'aa',
    burger: 9,
  },
  {
    country: 'bb',
    burger: 36,
  },
  {
    country: 'cc',
    burger: 125,
  },
  {
    country: 'AFs',
    burger: 166,
  },
  {
    country: 'AGw',
    burger: 16,
  },
  {
    country: 'AId',
    burger: 9,
  },
  {
    country: 'ADa',
    burger: 36,
  },
  {
    country: 'AE',
    burger: 125,
  },
  {
    country: 'AF',
    burger: 166,
  },
  {
    country: 'AG',
    burger: 16,
  },
  {
    country: 'AI',
    burger: 9,
  },
];

export default function BarChart() {
  return (
    <div className="w-full h-full">
      <ResponsiveBar
        data={data}
        keys={['burger']}
        indexBy="country"
        margin={{ top: 15, right: 15, bottom: 30, left: 40 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'yellow_orange_red' }}
        borderColor={{ from: '#ffd505' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
}
