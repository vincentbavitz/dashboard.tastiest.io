import { NextComponentType, NextPageContext } from 'next';
import { Router } from 'next/router';
import LayoutAuth from './LayoutAuth';
import LayoutDefault from './LayoutDefault';
import LayoutEmailTemplate from './LayoutEmailTemplate';
import LayoutLegal from './LayoutLegal';

export enum Layouts {
  DEFAULT = 'default',
  AUTH = 'auth',
  EMAIL_TEMPLATE = 'email-template',
  LEGAL = 'legal',
}

const layouts = {
  [Layouts.DEFAULT]: LayoutDefault,
  [Layouts.AUTH]: LayoutAuth,
  [Layouts.EMAIL_TEMPLATE]: LayoutEmailTemplate,
  [Layouts.LEGAL]: LayoutLegal,
};

type ChildrenWithLayout = { layout?: Layouts } & NextComponentType<
  NextPageContext
>;

export type LayoutProps<T = any> = {
  pageProps: T;
  router: Router;
  children: ChildrenWithLayout;
};

const LayoutHandler = (props: LayoutProps) => {
  // To get the text value of the assigned layout of each component
  const Layout = layouts[props.children?.layout];

  // If we have a registered layout render children with said layout
  if (Layout != null) {
    return <Layout {...props}>{props.children}</Layout>;
  }

  // If not render children with fragment
  return <LayoutDefault {...props}>{props.children}</LayoutDefault>;
};

export default LayoutHandler;
