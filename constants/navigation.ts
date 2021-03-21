import HomeSVG from '@svg/home.svg';
import SupportSVG from '@svg/support.svg';
import { FC } from 'react';

export interface ISidebarItem {
  icon: FC<any>;
  label: string;
  page: string;
}

const SIDEBAR_ITEMS: ISidebarItem[] = [
  { label: 'Home', page: '/', icon: HomeSVG },
  { label: 'Support', page: '/support', icon: SupportSVG },
];

const NAVIGATION = {
  SIDEBAR_ITEMS,
};

export default NAVIGATION;
