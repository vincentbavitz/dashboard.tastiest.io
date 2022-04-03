import { InfoCard } from '@tastiest-io/tastiest-ui';
import { formatCurrency, useHorusSWR } from '@tastiest-io/tastiest-utils';
import CoversBarChart from 'components/charts/CoversBarChart';
import HomeCustomersTable from 'components/tables/homeCustomersTable/HomeCustomersTable';
import { useAuth } from 'hooks/useAuth';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { verifyCookieToken } from 'utils/firebaseAdmin';
import { METADATA } from '../constants';

type GetBalanceReturn = {
  total: number;
  pending: number;
  available: number;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { valid, redirect } = await verifyCookieToken(context);
  if (!valid) return { redirect };
  return { props: {} };
};

const Index: NextPage<DefaultAuthPageProps> = props => {
  const { token } = useAuth();

  // Grabbing this from props is faster than from useAuth
  const { restaurantData } = props;

  const { data } = useHorusSWR<GetBalanceReturn>(
    token ? '/restaurants/get-balances' : null,
    { token },
    {
      refreshInterval: 60000,
      refreshWhenHidden: true,
    },
  );

  console.log('index ➡️ data:', data);

  return (
    <>
      <Head>
        <title>{METADATA.TITLE_SUFFIX}</title>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>

      <div className="flex flex-col h-full space-y-8">
        <Introduction
          payoutTotal={data?.total}
          restaurantName={restaurantData?.name}
        />

        <div className="flex flex-wrap justify-between pt-2 gap-6">
          <div style={{ maxWidth: '500px' }} className="flex-grow">
            <CoversBarChart restaurantId={restaurantData?.id} />
          </div>

          <div>
            <InfoCard
              label="This Payout"
              info={`£${formatCurrency(data?.available + data?.pending)}`}
              chart
            />
          </div>
        </div>

        <HomeCustomersTable
          restaurantId={restaurantData?.id}
          // metrics={restaurantData.metrics}
        />
      </div>
    </>
  );
};

interface IntroductionProps {
  restaurantName: string;
  payoutTotal: number;
}

const Introduction = ({ restaurantName, payoutTotal }: IntroductionProps) => {
  const payout = formatCurrency(payoutTotal ?? 0);

  return (
    <div className="flex items-center justify-between text-gray-500">
      <div>
        <h2 className="text-xl font-medium text-black leading-none pb-1 font-primary">
          {restaurantName}
        </h2>
        <p className="">Welcome to your dashboard</p>
      </div>

      <div className="text-right">
        <span className="text-sm">Total Payout</span>
        <div className="text-lg font-medium tracking-wider text-black">
          £{payout}
        </div>
      </div>
    </div>
  );
};

export default Index;
