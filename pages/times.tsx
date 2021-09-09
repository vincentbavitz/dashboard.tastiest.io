import { Button } from '@tastiest-io/tastiest-components';
import {
  CmsApi,
  dlog,
  IRestaurantData,
  ITastiestDish,
  postFetch,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import {
  TimeSlots,
  WeekTimeSlots,
} from '@tastiest-io/tastiest-utils/dist/types/time';
import clsx from 'clsx';
import { useAuth } from 'hooks/useAuth';
import { useRestaurantData } from 'hooks/useRestaurantData';
import lodash from 'lodash';
import { NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import React, { FC, useContext, useEffect, useState } from 'react';
import { LocalEndpoint } from 'types/api';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA, TIME } from '../constants';
import { ScreenContext } from '../contexts/screen';
import { SetQuietSlotsParams } from './api/setQuietSlots';

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

  const [day, setDay] = useState(0);
  const [slots, setSlots] = useState<TimeSlots>(
    props.restaurantData.metrics.quietTimes?.[day],
  );

  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  const [updatedSlots, setUpdatedSlots] = useState<WeekTimeSlots | null>(null);

  dlog('times ➡️ slots:', slots);

  // Update slots
  useEffect(() => {
    setSlots(props.restaurantData.metrics.quietTimes?.[day]);
  }, [day]);

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
  //
  //
  // 1. Restaurants now have openSlots and quietSlots defined in their profiles
  //    - They are in 15 minute increments
  //    - This will automatically generate their opening hours on the restaurant page.
  //    - They can modify the quietSlots as they like. openSlots are not yet modifiable.
  // 2. Eaters can now follow restaurants which does three things;
  //    - Fires off an event to Segment of `User Followed Restaurant`
  //    - Adds user to restaurant's followers and add's restaurant to user's follow list.
  //    - Sets up Google Cloud Functions for notifications to user emails. Emails don't send yet.
  // 3. Events for everything.
  //
  //
  //

  // const setInitial = async () => {
  //   const result = await postFetch<SetQuietSlotsParams>(
  //     LocalEndpoint.SET_QUIET_SLOTS,
  //     {
  //       restaurantId,
  //       slots: {
  //         [0]: (Array(96).fill(1) as never) as TimeSlots,
  //         [1]: (Array(96).fill(1) as never) as TimeSlots,
  //         [2]: (Array(96).fill(0) as never) as TimeSlots,
  //         [3]: (Array(96).fill(0) as never) as TimeSlots,
  //         [4]: (Array(96).fill(0) as never) as TimeSlots,
  //         [5]: (Array(96).fill(0) as never) as TimeSlots,
  //         [6]: (Array(96).fill(0) as never) as TimeSlots,
  //       },
  //     },
  //   );

  //   dlog('times ➡️ result:', result);
  // };

  // useEffect(() => {
  //   setInitial();
  // }, [day]);

  const updateSlot = (slot: number, available: boolean) => {
    const week = lodash.cloneDeep(
      updatedSlots ?? restaurantData?.metrics?.quietTimes,
    );

    if (!week || !week[day]) {
      return;
    }

    week[day][slot] = available ? 1 : 0;
    setUpdatedSlots(week);
    setSaved(false);
  };

  // Save updated to server
  const save = async () => {
    setSaving(true);
    const { success } = await postFetch<SetQuietSlotsParams>(
      LocalEndpoint.SET_QUIET_SLOTS,
      {
        restaurantId,
        slots: updatedSlots,
      },
    );

    setSaving(false);
    if (success) {
      setSaved(true);
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between pb-4">
        <p className="text-lg font-somatic">Define available time slots</p>
        <Button onClick={save} size="small" disabled={saved} loading={saving}>
          Save
        </Button>
      </div>

      <div
        className="flex w-full space-x-2"
        style={{
          maxWidth: '800px',
        }}
      >
        {TIME.DAYS_OF_THE_WEEK.map((_, key) => {
          const selected = key === day;

          return (
            <div
              key={key}
              className={clsx(
                'flex py-1 justify-center cursor-pointer duration-300 rounded-md items-center flex-1',
                selected ? 'bg-secondary bg-opacity-75' : 'bg-gray-200',
              )}
              onClick={() => setDay(key)}
            >
              {TIME.DAYS_OF_THE_WEEK[key]}
            </div>
          );
        })}
      </div>

      <div
        className="grid grid-cols-6 gap-0 mt-3 overflow-hidden text-sm rounded-md tablet:grid-cols-8 desktop:grid-cols-12"
        style={{
          maxWidth: '800px',
        }}
      >
        {(updatedSlots?.[day] ?? slots)?.map((available, key) => {
          dlog('times ➡️ available:', available);
          const minsInterval = 15;

          const startHours = Math.floor(key / 4);
          const startMins = (key % 4) * minsInterval;
          const endHours = startMins === 45 ? startHours + 1 : startHours;
          const endMins = startMins === 45 ? 0 : startMins + minsInterval;

          // prettier-ignore
          const start = `${startHours < 10 ? '0' : ''}${startHours}:${startMins < 10 ? '0' : ''}${startMins}`;
          const end = `${endHours < 10 ? '0' : ''}${endHours}:${
            endMins < 10 ? '0' : ''
          }${endMins}`;

          return (
            <div
              key={key}
              className={clsx(
                'flex flex-col py-1 items-center leading-none justify-center',
                'border border-gray-50 cursor-pointer',
                available
                  ? 'bg-primary-2 bg-opacity-75 text-white'
                  : 'bg-gray-300 text-gray-500',
              )}
              onClick={() => updateSlot(key, !available)}
            >
              <div>{start}</div>
              <div>{end}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BoostTablesSection: FC<Props> = props => {
  const numFollowers = 4;
  const cms = new CmsApi();
  const [offers, setOffers] = useState<ITastiestDish[] | null>(null);

  useEffect(() => {
    cms.getTastiestDishes().then(({ dishes }) => {
      setOffers(dishes);
    });
  }, []);

  return (
    <div className="">
      <div className="flex items-end justify-between pb-4">
        <p className="text-lg leading-none font-somatic">Boost</p>
        <Button size="small">Notify {numFollowers} Followers</Button>
      </div>
      <p className="">
        Boosting sends out notifications to all of your followers, letting them
        know that you have tables available. Your followers will receive a
        notification letting them know that you have a special spot saved for
        them. In addition, ads for your selected offers will be set to LIVE for
        the next 2 hours.
      </p>

      <div className="flex flex-col pt-4 pb-12">
        <p className="pb-4 text-lg leading-none font-somatic">Current Ads</p>

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
              <Button className="">LIVE</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Times;
