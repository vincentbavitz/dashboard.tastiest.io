import { Button } from '@tastiest-io/tastiest-components';
import {
  CmsApi,
  dlog,
  IPost,
  IRestaurantData,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import BookingSlotsBlock from 'components/blocks/BookingSlotsBlock';
import QuietTimesBlock from 'components/blocks/QuietTimesBlock';
import LiveExperienceAdMetrics from 'components/LiveExperienceAdMetrics';
import OnlineOrb from 'components/OnlineOrb';
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

  dlog('times ➡️ restaurantData:', restaurantData);

  return (
    <div>
      <div className="flex space-x-4">
        <div className="flex-1">
          {restaurantData ? (
            <BookingSlotsBlock restaurantData={restaurantData} />
          ) : null}
        </div>

        <div className="flex-1">
          {restaurantData ? (
            <QuietTimesBlock restaurantData={restaurantData} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const BoostTablesSection: FC<Props> = props => {
  const { restaurantData } = props;

  const cms = new CmsApi();
  const [experiences, setExperiences] = useState<IPost[] | null>([]);

  const [boosting, setBoosting] = useState(false);
  const [notifying, setNotifying] = useState(false);

  useEffect(() => {
    if (restaurantData?.details) {
      cms
        .getPostsOfRestaurant(restaurantData.details.uriName)
        .then(({ posts }) => {
          setExperiences(posts);
        });
    }
  }, [restaurantData]);

  const startAI = () => {
    setNotifying(true);
    setTimeout(() => {
      setNotifying(false);
      setBoosting(true);
    }, 2500);
  };

  return (
    <div className="">
      <div className="flex items-end justify-between pb-4">
        <p className="text-xl text-dark leading-none">AI Table Selection</p>

        <Button onClick={startAI} loading={notifying}>
          {boosting ? (
            <>
              <OnlineOrb size={3} /> <span className="pl-2">Running</span>
            </>
          ) : (
            'Fill tables'
          )}
        </Button>
      </div>

      <p className="">
        Boosting sends out notifications to all of your followers, letting them
        know that you have tables available. Your followers will receive a
        notification letting them know that you have a special spot saved for
        them. In addition, ads for your selected offers will be set to LIVE for
        the next 2 hours.
      </p>

      <div className="flex flex-col pt-10 pb-12">
        <p className="pb-4 text-xl text-dark leading-none">Current Ads</p>

        <div className="grid gap-4 grid-cols-2">
          {[...experiences, ...experiences]?.map((experience, key) => (
            <LiveExperienceAdMetrics key={key} experience={experience} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Times;
