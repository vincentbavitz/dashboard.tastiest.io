import { Button } from '@tastiest-io/tastiest-ui';
import {
  CardBrand,
  formatCurrency,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import PaymentCard from 'components/financial/PaymentCard';
import PaymentCardAdd from 'components/financial/PaymentCardAdd';
import { InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import React, { useContext } from 'react';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';

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

  return {
    props: {
      restaurantId,
      restaurantData,
    },
  };
};

const Financial: NextPage<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = () => {
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

      <div className="flex justify-between items-end pb-4">
        <h3 className="text-2xl leading-none font-medium text-primary">
          Balances
        </h3>

        <Button color="light">Add to balance</Button>
      </div>

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
          name="Tomer ElVaquero"
          last4={'5164'}
          expiry={{ month: '09', year: '21' }}
        />

        <PaymentCardAdd />
      </div>
    </>
  );
};

export default Financial;
