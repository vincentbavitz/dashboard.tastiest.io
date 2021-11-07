import { PlusOutlined } from '@ant-design/icons';
import {
  dlog,
  IRestaurantData,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import nookies from 'nookies';
import React, { useContext, useState } from 'react';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../../constants';
import { ScreenContext } from '../../contexts/screen';

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

const Followers: NextPage<Props> = props => {
  const { isDesktop } = useContext(ScreenContext);
  const [isBoosting, setIsBoosting] = useState(false);

  dlog('times ➡️ restaurantId:', props.restaurantId);
  dlog('times ➡️ props.restaurantData:', props.restaurantData);

  return (
    <>
      <Head>
        <title>Followers - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div className="flex flex-col space-y-10">
        <h3 className="text-2xl leading-none font-medium text-primary">
          Notify Followers
        </h3>

        <div>
          <h4 className="text-2xl leading-none pb-4 font-medium">Templates</h4>

          <div className="grid grid-cols-2 gap-4">
            <TemplateCard
              label="New Dish"
              description={`"Short beef on the menu - only for the next week!"`}
            />

            <TemplateCard
              label="New Dish"
              description="We're now open on Sundays!"
            />
          </div>
        </div>

        <div>
          <h4 className="text-2xl leading-none pb-4 font-medium">
            My Templates
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <NewTemplateCard />
          </div>
        </div>
      </div>
    </>
  );
};

interface TemplateCardProps {
  label: string;
  description: string;
  imageSrc?: string;
  onClick?: () => void;
}

const TemplateCard = (props: TemplateCardProps) => {
  const { label, description, imageSrc, onClick } = props;

  return (
    <div onClick={onClick} className="relative w-full cursor-pointer">
      <div
        style={{ minHeight: '12rem' }}
        className="flex justify-center items-center relative bg-light shadow-lg filter duration-300 hover:brightness-105 rounded-lg"
      >
        <div className="flex items-center space-x-1">
          <PlusOutlined className="text-lg" /> <span>{label}</span>
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="flex items-center justify-center h-10 px-6 mb-3 w-full">
            <p className="italic text-sm text-center opacity-50">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewTemplateCard = () => {
  return (
    <Link href="followers/templates/new">
      <a>
        <div className="relative w-full cursor-pointer">
          <div
            style={{ minHeight: '12rem' }}
            className="flex justify-center items-center relative bg-light shadow-lg filter duration-300 text-gray-400 hover:text-gray-500 rounded-lg"
          >
            <div className="flex items-center space-x-1">
              <PlusOutlined className="text-4xl" />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Followers;
