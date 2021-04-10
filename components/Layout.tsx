import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  // Render null for login page
  const { pathname } = useRouter();
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div
      style={{ height: '100vh' }}
      className="relative flex flex-col overflow-hidden font-roboto"
    >
      <Header />

      <div className="flex h-full">
        <Sidebar />

        <div className="relative flex-grow w-full">
          <div
            style={{ minWidth: '700px' }}
            className="absolute inset-0 flex h-full px-8 py-6 overflow-auto bg-gray-100"
          >
            <div style={{ height: 'max-content' }} className="w-full ">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
