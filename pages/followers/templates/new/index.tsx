import {
  dlog,
  IRestaurantData,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import { NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import React, { useContext, useState } from 'react';
import EmailEditor from 'react-email-editor';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../../../../constants';
import { ScreenContext } from '../../../../contexts/screen';

interface Props {
  restaurantId: string;
  restaurantData: IRestaurantData;
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

  return {
    props: {
      restaurantId,
      restaurantData,
    },
  };
};

const NewTemplate: NextPage<Props> = props => {
  const { isDesktop } = useContext(ScreenContext);
  const [isBoosting, setIsBoosting] = useState(false);

  dlog('times ➡️ restaurantId:', props.restaurantId);
  dlog('times ➡️ props.restaurantData:', props.restaurantData);

  return (
    <>
      <Head>
        <title>New Template - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div className="flex flex-col space-y-10">
        <h3 className="text-2xl leading-none font-medium text-primary">
          Notify Followers
        </h3>

        <div>
          <EmailEditor />
        </div>
      </div>
    </>
  );
};

export default NewTemplate;
