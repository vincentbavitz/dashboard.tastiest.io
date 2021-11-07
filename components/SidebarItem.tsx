import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { ISidebarItem } from './Sidebar';

export interface Props extends ISidebarItem {
  selected?: boolean;
  collapsed?: boolean;
}

export default function SidebarItem(props: Props) {
  const { label, page, selected, collapsed } = props;

  return (
    <Link href={page}>
      <a className="no-underline">
        <div
          className={clsx(
            'text-gray-400 duration-150 hover:text-primary py-4 filter',
            collapsed ? 'px-6' : 'px-4',
            selected ? '-bg-primary-1' : 'bg-primary',
            'hover:brightness-95',
          )}
        >
          <div
            className={clsx(
              'flex items-center space-x-2 font-medium',
              collapsed && 'justify-center',
              selected ? 'text-light' : 'text-gray-300',
            )}
          >
            <props.icon
              className={clsx('h-6 stroke-current w-6 text-xl fill-current')}
            />

            {!collapsed && <p className={clsx()}>{label}</p>}
          </div>
        </div>
      </a>
    </Link>
  );
}
