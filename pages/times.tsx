import { Button } from '@tastiest-io/tastiest-components';
import { HotIcon } from '@tastiest-io/tastiest-icons';
import {
  CmsApi,
  dlog,
  IRestaurantData,
  ITastiestDish,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import BookingSlotsBlock from 'components/blocks/BookingSlotsBlock';
import QuietTimesBlock from 'components/blocks/QuietTimesBlock';
import { useAuth } from 'hooks/useAuth';
import { useRestaurantData } from 'hooks/useRestaurantData';
import { NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import React, { FC, useContext, useEffect, useState } from 'react';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../constants';
import { ScreenContext } from '../contexts/screen';

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

const Times: NextPage<Props> = props => {
  const { isDesktop } = useContext(ScreenContext);
  const [isBoosting, setIsBoosting] = useState(false);

  dlog('times ➡️ restaurantId:', props.restaurantId);
  dlog('times ➡️ props.restaurantData:', props.restaurantData);

  return (
    <>
      <Head>
        <title>Times - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div className="flex flex-col space-y-10">
        <DefineSlotsSection {...props} />
        <BoostTablesSection {...props} />
      </div>
    </>
  );
};

const DefineSlotsSection: FC<Props> = props => {
  const { restaurantId } = props;
  const { restaurantUser } = useAuth();
  const { restaurantData } = useRestaurantData(restaurantUser);

  // Make the UX like a wizard / typeform flow. Next -> next etc.
  // Turn off when X number of people have booked.
  // Slots make up blocks.
  //
  // Steps: 1. How long is a sitting in your restaurant?
  //        2. Tick the days when you're quiet
  //        3. Tick the times when you're quiet
  //        4. How many tables are available during these times?
  //
  // Customer cancellations -> How many tables are available for how long and for how many people?
  // --> Send out push notifications to followers
  // --> Offer discount to these customers?
  // --> Push out ads
  //
  // Remove follower count from restaurant dashboard.
  // Separate pages: quiet times
  //                 boost --> schedule a boost
  //                       --> link them to the ads
  //                       --> how much we've spent on you
  //
  // Make the dishes for ads in restaurant dashboard more about experiences;
  // eg. Piccania Steak --> Tasting Menu
  //
  // When they Boost, our backend sends us an urgent email so we can set up ads.
  // In the future we should tap into the FB and Google ads APIs to automaticlly switch on.
  //
  // For each of their followers, if they have the notification bell on, it puts them into a
  // segment in Klaviyo which will send out an email to them; "There are only X numbers left!".
  // So if it's sold out when a user goes to the page, tell them "Sorry - this is sold out".

  return (
    <div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <BookingSlotsBlock restaurantData={restaurantData} />
        </div>

        <div className="flex-1">
          <QuietTimesBlock restaurantData={restaurantData} />
        </div>
      </div>
    </div>
  );
};

const BoostTablesSection: FC<Props> = props => {
  const numFollowers = 4;
  const cms = new CmsApi();
  const [offers, setOffers] = useState<ITastiestDish[] | null>(null);

  const [boosting, setBoosting] = useState(false);
  const [notifying, setNotifying] = useState(false);

  useEffect(() => {
    cms.getTastiestDishes().then(({ dishes }) => {
      setOffers(dishes);
    });
  }, []);

  const notify = () => {
    setNotifying(true);
    setTimeout(() => {
      setNotifying(false);
      setBoosting(true);
    }, 2500);
  };

  return (
    <div className="">
      <div className="flex items-end justify-between pb-4">
        <p className="text-lg leading-none font-primary">Boost</p>
        {boosting ? (
          <div className="flex items-center space-x-2 text-lg font-medium text-red-400">
            <HotIcon className="h-4 fill-current" />
            <div>Boosting Active</div>
          </div>
        ) : (
          <Button onClick={notify} loading={notifying} size="small">
            Notify Followers
          </Button>
        )}
      </div>

      <p className="">
        Boosting sends out notifications to all of your followers, letting them
        know that you have tables available. Your followers will receive a
        notification letting them know that you have a special spot saved for
        them. In addition, ads for your selected offers will be set to LIVE for
        the next 2 hours.
      </p>

      <div className="flex flex-col pt-4 pb-12">
        <p className="pb-4 text-lg leading-none font-primary">Current Ads</p>

        {offers?.map((offer, key) => (
          <div
            key={key}
            className="flex w-full mb-2 space-x-4 bg-gray-200 rounded-lg"
          >
            <img
              src={offer.image.url}
              className="object-cover w-20 h-16 rounded-l-lg"
            />

            <div className="flex flex-col flex-grow py-2">
              <h4 className="text-lg font-medium">{offer.name}</h4>
              <p className="duration-300 opacity-50 hover:opacity-100">
                Reach: 10,000 - 15,0000
              </p>
            </div>

            <div className="flex items-center py-2 pr-4">
              <Button>LIVE</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Times;
