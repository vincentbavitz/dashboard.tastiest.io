import React from 'react';
import { LayoutProps } from './LayoutHandler';

interface LayoutLegalProps extends LayoutProps {
  children: any;
}

export default function LayoutLegal({
  router,
  pageProps,
  children: Component,
}: LayoutLegalProps) {
  return <Component {...pageProps} />;
}
