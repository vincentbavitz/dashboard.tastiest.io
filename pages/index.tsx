import TimelineBarChart from 'components/charts/TimelineBarChart';
import InfoCard from 'components/InfoCard';
import Table from 'components/Table';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React, { useContext } from 'react';
import { IRestaurant } from 'types/cms';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';

interface Props {
  resaurant?: IRestaurant;
}

export const getServerSideProps: GetServerSideProps = async context => {
  // Get user ID from cookie.
  // const userDataApi = new RestaurantDataApi();
  // const { userId } = await userDataApi.init(context);
  const userId = 's34';

  // If no user, redirect to home
  if (!userId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { userId },
  };
};

const Index: NextPage<Props> = () => {
  const { isDesktop } = useContext(ScreenContext);

  // const { user } = useAuth();
  // const { userData } = useUserData(user);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'eaterName',
      },
      {
        Header: 'Deal',
        accessor: 'dealName',
      },
      {
        Header: 'Heads',
        accessor: 'heads',
      },
      {
        Header: 'Order Total',
        accessor: 'orderTotal',
      },
      {
        Header: 'Date of Purchase',
        accessor: 'paidAt',
      },
      {
        Header: 'Cancelled',
        accessor: 'hasCancelled',
      },
      {
        Header: 'Booking Date',
        accessor: 'bookingFor',
      },
      {
        Header: 'Eaten',
        accessor: 'hasEaten',
      },
    ],
    [],
  );

  const data = React.useMemo(
    () => [
      {
        eaterName: 'Kathleen Simoneau',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Dino Woerner',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Justa Stice',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Lee Hemmer',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Mindy Hoehn',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Ilda Langone',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Ressie Raines',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Eusebio Wiser',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Cori Osburn',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Selene Chupp',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Neta Gruber',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Harriette Price',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Wynell Covin',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Galina Escalera',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Nelida Swanner',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Clarice Almada',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Shandi Swan',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Lilliam Brockwell',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Carlyn Linen',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Ching Gentile',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Queen Winans',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Dalia Knobel',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Sheridan Kolstad',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Suzy Crossley',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Rodrick Flippen',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Kareem Carnegie',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Susann Resch',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Orlando Brinks',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Cathy Mccloud',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
    ],
    [],
  );

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
        <Introduction restaurantName="Krust Krab" />

        <div className="flex pt-2 space-x-6">
          <div className="w-7/12">
            <TimelineBarChart />
          </div>
          <div className="w-5/12">
            <InfoCard label="Net Payout" info="£5000.00" chart />
          </div>
        </div>
        <Table label="Customers" columns={columns} data={data} />
      </div>
    </>
  );
};

const Introduction = ({ restaurantName }: { restaurantName: string }) => (
  <div className="flex items-center justify-between text-gray-500">
    <div>
      <h2 className="text-xl font-medium text-black font-somatic">
        Welcome, {restaurantName}
      </h2>
      <p className="">Welcome to your dashboard</p>
    </div>

    <div className="text-right">
      <p className="text-sm">All time payout</p>
      <p className="text-lg font-medium tracking-wider text-black font-somatic">
        £1337.00
      </p>
    </div>
  </div>
);

export default Index;
