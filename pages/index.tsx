import {
  dlog,
  IRestaurant,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import TimelineBarChart from 'components/charts/TimelineBarChart';
import InfoCard from 'components/InfoCard';
import HomeCustomersTable from 'components/tables/homeCustomersTable/HomeCustomersTable';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { LocalEndpoint } from 'types/api';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';
import { GetBalanceReturn } from './api/getBalance';

interface Props {
  resaurant?: IRestaurant;
}

export const getServerSideProps = async context => {
  // Get user ID from cookie.
  const cookieToken = nookies.get(context)?.token;
  const restaurantDataApi = new RestaurantDataApi(firebaseAdmin);
  const { restaurantId } = await restaurantDataApi.initFromCookieToken(
    cookieToken,
  );

  // If no user, redirect to login
  if (!restaurantId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const restaurantData = await restaurantDataApi.getRestaurantData();

  const data = await fetch(
    process.env.NODE_ENV === 'production'
      ? 'https://dashboard.tastiest.io'
      : 'http://localhost:3333' +
          LocalEndpoint.GET_BALANCE +
          `?restaurantId=${restaurantId}`,
  );

  dlog('index ➡️ data:', data);
  const { payoutTotal = 0, pendingBalance = 0 } = {}; //await data.json();

  dlog('index ➡️ process.env:', process.env);

  return {
    props: {
      restaurantId,
      restaurantDetails: restaurantData?.details ?? null,
      pendingBalance,
      payoutTotal,
    },
  };
};

const Index = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { restaurantId, restaurantDetails } = props;

  const {
    data: { payoutTotal, pendingBalance },
  } = useSWR<GetBalanceReturn>(
    `${LocalEndpoint.GET_BALANCE}?restaurantId=${restaurantId}`,
    {
      refreshInterval: 5000,
      initialData: {
        payoutTotal: props.payoutTotal,
        pendingBalance: props.pendingBalance,
      },
      refreshWhenHidden: true,
    },
  );

  const { isDesktop } = useContext(ScreenContext);

  return (
    <>
      <Head>
        <title>{METADATA.TITLE_SUFFIX}</title>
        <meta
          property="og:title"
          content="Tastiest food no matter where you are"
          key="title"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>

      <div className="flex flex-col h-full space-y-8">
        <Introduction
          payoutTotal={payoutTotal}
          restaurantName={restaurantDetails?.name}
        />

        <div className="flex justify-between pt-2 space-x-6">
          <div style={{ maxWidth: '400px' }} className="w-7/12">
            <TimelineBarChart restaurantId={restaurantId} />
          </div>
          <div style={{ maxWidth: '300px' }} className="w-5/12">
            <InfoCard label="This Payout" info={`£${pendingBalance}`} chart />
          </div>
        </div>

        <HomeCustomersTable restaurantId={restaurantId} />
      </div>
    </>
  );
};

interface IntroductionProps {
  restaurantName: string;
  payoutTotal: number;
}

const Introduction = ({ restaurantName, payoutTotal }: IntroductionProps) => (
  <div className="flex items-center justify-between text-gray-500">
    <div>
      <h2 className="text-xl font-medium text-black font-somatic">
        {restaurantName}
      </h2>
      <p className="">Welcome to your dashboard</p>
    </div>

    <div className="text-right">
      <p className="text-sm">Total Payout</p>
      <p className="text-lg font-medium tracking-wider text-black font-somatic">
        <span className="-mt-px font-roboto">£</span>
        {payoutTotal ?? 0}
      </p>
    </div>
  </div>
);

export default Index;
