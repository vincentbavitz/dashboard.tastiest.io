import clsx from 'clsx';
import React from 'react';

interface Props {
  label: string;
}

export default function AlphaTestingBlockOverlay({ label }: Props) {
  return (
    <div
      style={{ zIndex: 10000 }}
      className={clsx(
        'absolute inset-0',
        'flex justify-center items-center',
        'backdrop-filter backdrop-blur-sm',
        'bg-white bg-opacity-30',
      )}
    >
      <div
        style={{ filter: 'drop-shadow(0 0 33px rgba(255,255,255,0.33))' }}
        className="text-2xl -mt-20 py-6 px-8 bg-secondary rounded-xl font-bold text-white shadow-lg"
      >
        {label} is disabled for Beta.
      </div>
    </div>
  );
}
