import clsx from 'clsx';
import React from 'react';

interface Props {
  size: 1 | 2 | 3 | 4;
}

export default function OnlineOrb(props: Props) {
  const { size } = props;

  return (
    <div
      className={clsx(
        'relative inline-block',
        size === 1 && 'h-1 w-1',
        size === 2 && 'h-2 w-2',
        size === 3 && 'h-3 w-3',
        size === 4 && 'h-4 w-4',
      )}
    >
      <div className="absolute flex justify-center items-center w-full h-full">
        <div className="bg-green-300 h-full w-full z-0 rounded-full animate-ping"></div>
      </div>

      <div className="absolute inset-0 rounded-full bg-green-400"></div>
    </div>
  );
}
