import { Button, Input } from '@tastiest-io/tastiest-components';
import { IRestaurant, RestaurantDataApi } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import Header from 'components/Header';
import { useAuth } from 'hooks/useAuth';
import { NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import { ChefIllustration } from 'public/assets/illustrations';
import React, { useContext, useState } from 'react';
import { useWindowSize } from 'react-use';
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

  // Redirect to dashboard if logged in
  if (restaurantId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const LogIn: NextPage<Props> = () => {
  const { isDesktop } = useContext(ScreenContext);

  const { signIn, error } = useAuth();
  const { height } = useWindowSize();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //  I have read and agree to be bound by the Merchant Terms & Conditions [insert hyperlink to the T&Cs page]

  return (
    <>
      <Head>
        <title>Sign In - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div
        style={{ height: '100vh' }}
        className="relative w-full overflow-hidden"
      >
        <div
          className={clsx(
            'flex flex-col h-full mt-32 space-y-10 items-center',
            isDesktop && height < 850 && '-ml-64',
          )}
        >
          <div className="w-full text-center">
            <h1 className="text-4xl bg-white font-somatic text-primary">
              Tastiest for Restaurants
            </h1>

            <h2 className="text-xl">Please sign in below</h2>
          </div>
          <div
            className={clsx(
              'flex flex-col p-10 space-y-4 border-2 border-primary rounded-xl',
              isDesktop && height < 850 && 'w-auto',
            )}
          >
            <div className="w-64">
              <Input
                value={email}
                onValueChange={setEmail}
                label={'Restaurant Email'}
              />
            </div>
            <div className="w-64">
              <Input
                value={password}
                onValueChange={setPassword}
                type="password"
                label={'Password'}
              />
            </div>

            {/* <Checkbox
              checked={false}
              onChange={() => null}
              label={
                <span>
                  "I have read and agree to be bound by the{' '}
                  <a href="/merchant-terms-and-conditions">
                    Merchant Terms & Conditions
                  </a>
                </span>
              }
            /> */}

            <Button wide onClick={() => signIn(email, password)}>
              Sign In
            </Button>

            {error && <p className="mt-3">{error}</p>}
          </div>
          <h3 className="text-2xl font-medium text-center text-secondary font-somatic">
            {METADATA.TAGLINE}
          </h3>
        </div>

        <div className="absolute top-0 w-full">
          <Header blank />
        </div>

        {isDesktop && (
          <div className="absolute bottom-0 right-0 pointer-events-none">
            <div
              style={{
                width: '25rem',
                height: '40rem',
                boxShadow: 'inset 25px 25px 33px -33px rgba(0,0,0,0.33)',
              }}
              className="transform translate-x-1/2 translate-y-1/2 rounded-full bg-primary "
            ></div>
            <ChefIllustration className="absolute bottom-0 right-0 w-64 transform" />
          </div>
        )}
      </div>
    </>
  );
};

export default LogIn;
