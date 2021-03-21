import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div
      style={{ height: '100vh' }}
      className="relative flex flex-col overflow-hidden font-roboto"
    >
      <Header />

      <div className="flex h-full">
        <Sidebar />

        <div className="relative flex-grow w-full">
          <div className="absolute inset-0 flex h-full px-8 py-6 overflow-y-scroll bg-gray-100">
            <div style={{ height: 'max-content' }} className="w-full ">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
