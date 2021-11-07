import Sidebar from 'components/Sidebar';
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
  return (
    <div
      style={{ height: '100vh' }}
      className="relative flex flex-col overflow-hidden font-secondary"
    >
      {/* Modals (inside portal) */}
      <div id="modal-root" className="absolute"></div>

      <div className="flex h-full">
        <Sidebar />

        <div className="relative flex-grow w-full">{children}</div>
      </div>
    </div>
  );
}
