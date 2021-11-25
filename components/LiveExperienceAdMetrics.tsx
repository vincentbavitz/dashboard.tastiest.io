import { PoweroffOutlined } from '@ant-design/icons';
import { StatusOrb } from '@tastiest-io/tastiest-ui';
import { formatCurrency, IPost } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import React from 'react';

interface Props {
  experience: IPost;
}

export default function LiveExperienceAdMetrics(props: Props) {
  const { experience } = props;

  const getRandomMetrics = () => {
    const randomMetrics = [
      { label: 'Ad Clicks', value: Math.ceil(Math.random() * 200 + 1000) },
      {
        label: 'Earned',
        value: `+£${formatCurrency(Math.random() * 300 + 100)}`,
      },
      {
        label: 'Projected',
        value: `+£${formatCurrency(Math.random() * 300 + 200)}`,
      },
      // { label: 'Reach', value: 15000 },
    ];

    return randomMetrics;
  };

  const metrics = getRandomMetrics();

  return (
    <div className="flex w-full mb-2 px-4 space-x-4 bg-white shadow-lg rounded-lg">
      {/* <img
          src={experience.deal.image.url}
          className="object-cover w-32 rounded-l-lg"
        /> */}

      <div className="flex flex-col flex-grow pt-4 pb-4">
        <div className="flex justify-between">
          <h4 className="text-lg leading-none overflow-ellipsis text-dark font-medium">
            {experience.title}
          </h4>

          <PoweroffOutlined className="pl-4 cursor-pointer hover:text-gray-900 duration-300 text-xl" />
        </div>

        <div className="pt-3 pb-1 pl-1 font-medium">
          <StatusOrb status="online" size={3} />
          <span className="pl-2">1H 34M</span>
        </div>

        <div className="flex justify-between bg-gray-100 rounded-lg w-full px-4 py-3">
          <div className="leading-none">
            <p className="font-medium">Spent GBP</p>
            <p className="text-dark text-lg tracking-wider">£154.23</p>
          </div>

          <div className="leading-none">
            <p className="font-medium text-right">Covers</p>
            <p className="text-dark text-right text-lg tracking-wider">+14</p>
          </div>
        </div>

        <div className="flex pt-4 justify-between">
          <div className="grid gap-4 w-full grid-cols-3">
            {metrics.map((metric, key) => {
              const index = (key + 1) % 3;
              const float =
                index === 0 ? 'right' : index === 1 ? 'left' : 'center';

              return <SubMetric key={key} {...metric} float={float} />;
            })}
          </div>
        </div>

        {/* Timer at the bottom */}
        <div></div>
      </div>
    </div>
  );
}

interface SubMetricProps {
  label: string;
  value: number | string;
  float: 'left' | 'center' | 'right';
}

const SubMetric = (props: SubMetricProps) => {
  const { label, value, float } = props;

  return (
    <div
      className={clsx(
        'w-full leading-none',
        float === 'left' && 'text-left',
        float === 'center' && 'text-center',
        float === 'right' && 'text-right',
      )}
    >
      <p>{label}</p>
      <div className="text-dark pt-1 font-medium tracking-wider text-base">
        {value}
      </div>
    </div>
  );
};
