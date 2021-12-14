import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@tastiest-io/tastiest-ui';
import PageHeader from 'components/PageHeader';
import SupportTable from 'components/tables/SupportTable';
import { useSupport } from 'hooks/useSupport';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { verifyCookieToken } from 'utils/firebaseAdmin';
import { METADATA } from '../../constants';

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { valid, redirect } = await verifyCookieToken(context);
  if (!valid) return { redirect };
  return { props: {} };
};

const Support: NextPage<DefaultAuthPageProps> = () => {
  const { supportRequests } = useSupport();

  return (
    <>
      <Head>
        <title>Support - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <PageHeader label="Support">
        <Link href="/support/new">
          <a className="no-underline">
            <Button color="light" prefix={<PlusOutlined />}>
              Open ticket
            </Button>
          </a>
        </Link>
      </PageHeader>

      <SupportTable supportRequests={supportRequests} />
    </>
  );
};

export default Support;
