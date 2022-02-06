import {
  ClockCircleOutlined,
  PlusOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { HomeIcon, SupportIcon } from '@tastiest-io/tastiest-icons';
import { Sidebar } from '@tastiest-io/tastiest-ui';
import Header, { HEADER_HEIGHT_REM } from 'components/Header';
import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { LayoutProps } from './LayoutHandler';

interface LayoutWrapperProps extends LayoutProps {
  children: any;
}

export default function LayoutWrapper({
  router,
  pageProps,
  children,
}: LayoutWrapperProps) {
  // Automatically re-route to /login if they're not logged in.
  const { isSignedIn } = useAuth();
  if (isSignedIn === false) {
    router.replace('/login');
    return null;
  }

  return (
    <div
      style={{ height: '100vh' }}
      className="relative flex flex-col overflow-hidden font-secondary"
    >
      {/* Modals (inside portal) */}
      <div id="modal-root" className="absolute"></div>

      <div className="flex h-full">
        <Sidebar router={router}>
          <Sidebar.Item label="Home" page="/" icon={HomeIcon} float="top" />
          <Sidebar.Item
            label="Slots"
            page="/slots"
            icon={ClockCircleOutlined}
            float="top"
          />
          <Sidebar.Item
            label="Followers"
            page="/followers"
            icon={PlusOutlined}
            float="top"
          />
          <Sidebar.Item
            label="Billing"
            page="/billing"
            icon={WalletOutlined}
            float="bottom"
          />
          <Sidebar.Item
            label="Support"
            page="/support"
            icon={SupportIcon}
            float="bottom"
          />
          {/* <Sidebar.Item
            label="Settings"
            page="/settings"
            icon={SettingOutlined} 
            float="bottom"
          /> */}
        </Sidebar>

        <div className="relative flex-grow w-full">
          <Header />

          <div
            style={{ height: `calc(100vh - ${HEADER_HEIGHT_REM}rem)` }}
            className="relative"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
