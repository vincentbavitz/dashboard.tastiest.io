import {
  dlog,
  IRestaurant,
  RestaurantData,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import TimelineBarChart from 'components/charts/TimelineBarChart';
import InfoCard from 'components/InfoCard';
import HomeCustomersTable from 'components/tables/HomeCustomersTable';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import React, { useContext } from 'react';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';

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

  const restaurantData = await restaurantDataApi.getRestaurantData(
    RestaurantData.DETAILS,
  );

  dlog('index ➡️ restaurantData:', restaurantData);

  return {
    props: { restaurantId, restaurantData },
  };
};

const Index = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { restaurantData, restaurantId } = props;
  const { isDesktop } = useContext(ScreenContext);

  dlog('index ➡️ restaurantId:', restaurantId);
  dlog('index ➡️ restaurantData:', restaurantData);

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
        <Introduction restaurantName={restaurantData?.name} />

        <div className="flex pt-2 space-x-6">
          <div className="w-7/12">
            <TimelineBarChart />
          </div>
          <div className="w-5/12">
            <InfoCard label="Net Payout" info="£0.00" chart />
          </div>
        </div>

        <HomeCustomersTable restaurantId={restaurantId} />
      </div>
    </>
  );
};

const Introduction = ({ restaurantName }: { restaurantName: string }) => (
  <div className="flex items-center justify-between text-gray-500">
    <div>
      <h2 className="text-xl font-medium text-black font-somatic">
        {restaurantName}
      </h2>
      <p className="">Welcome to your dashboard</p>
    </div>

    <div className="text-right">
      <p className="text-sm">All time payout</p>
      <p className="text-lg font-medium tracking-wider text-black font-somatic">
        £0.00
      </p>
    </div>
  </div>
);

export default Index;
