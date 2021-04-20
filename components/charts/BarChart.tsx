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
    date: 'Mon',
    covers: 0,
  },
  {
    date: 'Tue',
    covers: 0,
  },
  {
    date: 'Wed',
    covers: 0,
  },
  {
    date: 'Thurs',
    covers: 0,
  },
  {
    date: 'Fri',
    covers: 0,
  },
  {
    date: 'Sat',
    covers: 0,
  },
  {
    date: 'Sun',
    covers: 0,
  },
];

export default function BarChart() {
  return (
    <div className="w-full h-full">
      <ResponsiveBar
        data={data}
        keys={['covers']}
        indexBy="date"
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
