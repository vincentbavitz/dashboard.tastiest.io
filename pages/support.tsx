import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React, { useContext } from 'react';
import { IRestaurant } from 'types/cms';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';

interface Props {
  resaurant?: IRestaurant;
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60,
  };
};

const Support: NextPage<Props> = () => {
  const { isDesktop } = useContext(ScreenContext);

  // const { user } = useAuth();
  // const { userData } = useUserData(user);

  return (
    <>
      <Head>
        <title>Support - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div style={{ height: '600px', width: '100%' }}></div>
    </>
  );
};

export default Support;
