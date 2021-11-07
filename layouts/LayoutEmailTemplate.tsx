import React from 'react';
import { LayoutProps } from './LayoutHandler';
import LayoutWrapper from './LayoutWrapper';

interface LayoutEmailTemplateProps extends LayoutProps {
  children: any;
}

export default function LayoutEmailTemplate({
  router,
  pageProps,
  children: Component,
}: LayoutEmailTemplateProps) {
  return (
    <LayoutWrapper router={router} pageProps={pageProps}>
      <div
        style={{
          backgroundColor: 'rgb(249 249 249)',
        }}
        className="relative w-full h-full"
      >
        <Component {...pageProps} />
      </div>
    </LayoutWrapper>
  );
}
