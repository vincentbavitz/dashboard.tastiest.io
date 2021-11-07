import React from 'react';
import { LayoutProps } from './LayoutHandler';

interface LayoutAuthProps extends LayoutProps {
  children: any;
}

export default function LayoutAuth({
  router,
  pageProps,
  children,
}: LayoutAuthProps) {
  return <>{children}</>;
}
