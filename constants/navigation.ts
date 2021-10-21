import { ClockCircleOutlined } from '@ant-design/icons';
import { HomeIcon, SupportIcon } from '@tastiest-io/tastiest-icons';
import { FC } from 'react';

export interface ISidebarItem {
  icon: FC<any>;
  label: string;
  page: string;
}

const SIDEBAR_ITEMS: ISidebarItem[] = [
  { label: 'Home', page: '/', icon: HomeIcon },
  { label: 'Times', page: '/times', icon: ClockCircleOutlined },
  { label: 'Support', page: '/support', icon: SupportIcon },
];

const NAVIGATION = {
  SIDEBAR_ITEMS,
};

export default NAVIGATION;
