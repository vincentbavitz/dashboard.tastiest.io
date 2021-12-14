import { Button } from '@tastiest-io/tastiest-ui';
import { CardBrand, formatCurrency } from '@tastiest-io/tastiest-utils';
import AlphaTestingBlockOverlay from 'components/AlphaTestingBlockOverlay';
import PaymentCard from 'components/financial/PaymentCard';
import PaymentCardAdd from 'components/financial/PaymentCardAdd';
import PageHeader from 'components/PageHeader';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import React, { useContext } from 'react';
import { verifyCookieToken } from 'utils/firebaseAdmin';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { valid, redirect } = await verifyCookieToken(context);
  if (!valid) return { redirect };
  return { props: {} };
};

const Billing: NextPage<DefaultAuthPageProps> = () => {
  const { isDesktop } = useContext(ScreenContext);

  const balances = [
    { label: 'Accumulated from orders', balance: 142.25 },
    { label: 'Ad Platform funds', balance: 339.05 },
    { label: 'Held in reserve', balance: 693.25 },
  ];

  return (
    <>
      <Head>
        <title>Financial - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <AlphaTestingBlockOverlay label="Billing" />

      <PageHeader label="Balance">
        <Button color="light">Add to balance</Button>
      </PageHeader>

      <div className="py-4 px-6 bg-white flex space-y-3 flex-col rounded-lg shadow-lg">
        {balances.map((row, key) => (
          <div key={key} className="flex justify-between">
            <div>{row.label}</div>
            <div className="tracking-wider">£{formatCurrency(row.balance)}</div>
          </div>
        ))}
      </div>

      <h3 className="text-2xl pb-4 py-12 leading-none font-medium text-primary">
        Payment Methods
      </h3>

      <div style={{ maxWidth: '40rem' }} className="flex space-x-4">
        <PaymentCard
          brand={CardBrand.VISA}
          name="Example Name"
          last4={'3333'}
          expiry={{ month: '09', year: '21' }}
        />

        <PaymentCardAdd />
      </div>
    </>
  );
};

export default Billing;
