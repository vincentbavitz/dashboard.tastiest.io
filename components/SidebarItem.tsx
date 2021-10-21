import clsx from 'clsx';
import { ISidebarItem } from 'constants/navigation';
import Link from 'next/link';
import React from 'react';

export interface Props extends ISidebarItem {
  selected?: boolean;
}

export default function SidebarItem(props: Props) {
  const { label, page, selected } = props;

  return (
    <Link href={page} as={page}>
      <a className="no-underline">
        <div
          className={clsx(
            'px-6 text-gray-400 py-3 duration-150',
            selected
              ? 'bg-secondary bg-opacity-75'
              : 'hover:bg-secondary hover:bg-opacity-10',
          )}
        >
          <div className="flex items-center space-x-2 font-medium">
            <props.icon
              className={clsx(
                'flex items-center justify-center h-6 text-xl w-6 stroke-current fill-current',
                selected ? 'text-light' : 'text-primary',
              )}
            />
            <p className={clsx(selected ? 'text-light' : 'text-primary')}>
              {label}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}
