import { Button, Checkbox, Input } from '@tastiest-io/tastiest-components';
import { IRestaurant, RestaurantDataApi } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import Header from 'components/Header';
import { useAuth } from 'hooks/useAuth';
import { NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import React, { useContext, useEffect, useState } from 'react';
import { useLocalStorage, useWindowSize } from 'react-use';
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

  const { signIn, error: authError } = useAuth();
  const { height } = useWindowSize();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Save has accepted terms to local storage so it doesn't bug them
  const [hasAcceptedTerms, setHasAcceptedTerms] = useLocalStorage(
    'hasAcceptedTerms',
    false,
  );

  // Accepted terms error
  const [termsError, setTermsError] = useState<string | null>(null);

  const submit = async () => {
    if (!hasAcceptedTerms) {
      setTermsError('Please accept terms before continuing.');
      return;
    }

    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  // Remove error when they click accept terms
  useEffect(() => {
    if (hasAcceptedTerms) {
      setTermsError(null);
    }
  }, [hasAcceptedTerms]);

  return (
    <>
      <Head>
        <title>Sign In - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div
        style={{ height: '100vh' }}
        className="relative w-full overflow-hidden"
      >
        <div style={{ zIndex: -1 }} className="absolute bottom-0 w-full">
          <div className="flex justify-center">
            <img
              style={{ maxWidth: '800px' }}
              src="/assets/illustrations/hero.svg"
            />
          </div>
        </div>

        <div
          className={clsx(
            'flex flex-col z-10 h-full mt-32  space-y-10 items-center',
          )}
        >
          <div className="w-full text-center">
            <h1 className="text-4xl font-primary text-primary">
              Tastiest Dashboard
            </h1>

            <h2 className="text-xl">Please sign in below</h2>
          </div>
          <div
            className={clsx(
              'flex flex-col p-10 space-y-4 filter drop-shadow-xl glass rounded-md',
              'w-auto',
            )}
          >
            <div className="w-64">
              <Input
                value={email}
                onValueChange={setEmail}
                label={'Admin Email'}
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

            <Checkbox
              checked={hasAcceptedTerms}
              onChange={setHasAcceptedTerms}
              label={
                <p className="text-xs leading-tight">
                  <p>I have read and agree to be bound by the</p>
                  <a
                    href="/merchant-terms-and-conditions"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Merchant Terms {'&'} Conditions
                  </a>
                </p>
              }
            />

            <Button wide onClick={submit} loading={loading}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="absolute top-0 w-full">
          <Header blank />
        </div>
      </div>
    </>
  );
};

export default LogIn;
