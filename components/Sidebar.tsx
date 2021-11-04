import {
  ClockCircleOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SettingOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { TastiestBrand } from '@tastiest-io/tastiest-components';
import { HomeIcon, SupportIcon } from '@tastiest-io/tastiest-icons';
import clsx from 'clsx';
import { useScreenSize } from 'hooks/useScreen';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import { useToggle } from 'react-use';
import SidebarItem from './SidebarItem';

export interface ISidebarItem {
  icon: FC<any>;
  label: string;
  page: string;
  float: 'top' | 'bottom';
}

const SIDEBAR_ITEMS: ISidebarItem[] = [
  { label: 'Home', page: '/', icon: HomeIcon, float: 'top' },
  { label: 'Slots', page: '/slots', icon: ClockCircleOutlined, float: 'top' },
  { label: 'Followers', page: '/followers', icon: PlusOutlined, float: 'top' },

  { label: 'Billing', page: '/billing', icon: WalletOutlined, float: 'bottom' },
  { label: 'Support', page: '/support', icon: SupportIcon, float: 'bottom' },
  {
    label: 'Settings',
    page: '/settings',
    icon: SettingOutlined,
    float: 'bottom',
  },
];

export default function Sidebar() {
  const router = useRouter();

  const { isDesktop } = useScreenSize();
  const [collapsed, toggleCollapsed] = useToggle(!isDesktop);

  // Collapse on small screens
  useEffect(() => {
    if (!isDesktop) {
      toggleCollapsed(true);
    }
  }, [isDesktop]);

  // On small screens, the sidebar should be a drawer.
  const isDrawer = !isDesktop;

  return (
    <div style={{ minWidth: isDrawer ? '3rem' : 'auto' }} className="relative">
      <div
        className={clsx(
          'flex flex-col h-full duration-300 bg-primary text-light',
          isDrawer && !collapsed ? 'absolute left-0 z-50' : 'relative',
        )}
      >
        <div className="flex justify-center pt-4 pb-6">
          <TastiestBrand theme="dark" type="initial-ring" />
        </div>

        <div className="flex flex-col flex-grow justify-between">
          <div
            onClick={() => toggleCollapsed()}
            className={clsx(
              'absolute right-0 z-50 bg-white flex items-center w-4 h-10',
              'border-t-2 border-b-2 border-r-2 border-gray-300 rounded-r-md',
              'transform translate-x-full top-3 cursor-pointer',
            )}
          >
            {collapsed ? (
              <RightOutlined className="text-sm text-gray-500" />
            ) : (
              <LeftOutlined className="text-sm text-gray-500" />
            )}
          </div>

          <div className="">
            {Object.values(SIDEBAR_ITEMS)
              .filter(item => item.float === 'top')
              .map(item => (
                <SidebarItem
                  key={item.page}
                  collapsed={collapsed}
                  selected={
                    router.pathname.split('/')?.[1] ===
                    item.page.replace(/\//g, '')
                  }
                  {...item}
                />
              ))}
          </div>
          <div className="">
            {Object.values(SIDEBAR_ITEMS)
              .filter(item => item.float === 'bottom')
              .map(item => (
                <SidebarItem
                  key={item.page}
                  collapsed={collapsed}
                  selected={
                    router.pathname.split('/')?.[1] ===
                    item.page.replace(/\//g, '')
                  }
                  {...item}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
