import { InfoCard } from '@tastiest-io/tastiest-ui';
import { formatCurrency } from '@tastiest-io/tastiest-utils';
import CoversBarChart from 'components/charts/CoversBarChart';
import HomeCustomersTable from 'components/tables/homeCustomersTable/HomeCustomersTable';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import useSWR from 'swr';
import { LocalEndpoint } from 'types/api';
import { METADATA } from '../constants';
import { GetBalanceReturn } from './api/getBalance';

const Index: NextPage<DefaultAuthPageProps> = props => {
  const { restaurantData } = props;

  const swrURL = restaurantData?.details?.id
    ? `${LocalEndpoint.GET_BALANCE}?restaurantId=${restaurantData?.details.id}`
    : null;

  const { data } = useSWR<GetBalanceReturn>(swrURL, {
    refreshInterval: 60000,
    refreshWhenHidden: true,
  });

  const { payoutTotal, pendingBalance } = { payoutTotal: 0, pendingBalance: 0 };

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
          payoutTotal={payoutTotal}
          restaurantName={restaurantData.details?.name}
        />

        <div className="flex justify-between pt-2 space-x-6">
          <div style={{ maxWidth: '400px' }} className="w-7/12">
            <CoversBarChart restaurantId={restaurantData.details.id} />
          </div>
          <div style={{ maxWidth: '300px' }} className="w-5/12">
            <InfoCard
              label="This Payout"
              info={`£${formatCurrency(pendingBalance)}`}
              chart
            />
          </div>
        </div>

        <HomeCustomersTable restaurantId={restaurantData.details.id} />
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
