import { LinkOutlined } from '@ant-design/icons';
import { InfoCard, StatusOrb } from '@tastiest-io/tastiest-ui';
import {
  CmsApi,
  ContentfulPost,
  formatCurrency,
  generateStaticURL,
  Horus,
} from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import PageHeader from 'components/PageHeader';
import { HorusBookingEnchanted } from 'components/tables/homeCustomersTable/HomeCustomersTable';
import { useScreenSize } from 'hooks/useScreen';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { verifyCookieToken } from 'utils/firebaseAdmin';
import { METADATA } from '../../constants';

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const {
    valid,
    redirect,
    cookieToken,
    restaurantData,
  } = await verifyCookieToken(context);
  if (!valid) return { redirect };

  const cms = new CmsApi(undefined, undefined, 'production');
  const { posts: experiences } = await cms.getPostsOfRestaurant(
    restaurantData.uri_name,
  );

  const horus = new Horus(cookieToken);
  const { data: bookings } = await horus.get<any, HorusBookingEnchanted[]>(
    '/bookings/',
    {
      query: {
        restaurant_id: restaurantData.id,
      },
    },
  );

  const covers = bookings
    .filter(b => b.is_test === (process.env.NODE_ENV === 'development'))
    .map(b => b.order.heads);

  const totalCovers = covers.reduce((a, b) => Number(a) + Number(b), 0);

  return { props: { experiences, bookings, totalCovers } };
};

const Experiences: NextPage<
  DefaultAuthPageProps & InferGetServerSidePropsType<typeof getServerSideProps>
> = props => {
  const { restaurantData, experiences, bookings, totalCovers } = props;

  props.restaurantData;
  console.log('index ➡️ experiences:', props.experiences);

  return (
    <>
      <Head>
        <title>Experiences - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <PageHeader label="Experiences"></PageHeader>

      <div style={{ maxWidth: '700px' }} className="flex space-x-6">
        <InfoCard
          label="Total Experiences"
          info={experiences.length}
          color="secondary"
          compact
        />
        <InfoCard
          label="Total Covers"
          info={totalCovers}
          color="tertiary"
          compact
        />
      </div>

      <h2 className="text-2xl mt-12 ">{restaurantData.name}'s Experiences</h2>

      {experiences.length ? (
        <div className="mt-2 flex flex-col gap-6">
          {experiences.map((experience, key) => {
            const bookingsFromExperience = bookings?.filter(
              b => b.order.product_name === experience.product.name,
            );

            const _covers = bookingsFromExperience
              .map(b => b.order.heads)
              .reduce((a, b) => Number(a) + Number(b), 0);

            const revenue = bookingsFromExperience
              .map(b => b.order.price.subtotal)
              .reduce((a, b) => Number(a) + Number(b), 0);

            const profit = bookingsFromExperience
              .map(b => b.order.restaurant_portion)
              .reduce((a, b) => Number(a) + Number(b), 0);

            const _following = bookingsFromExperience.filter(
              b => b.order.is_user_following,
            ).length;

            const _notFollowing = bookingsFromExperience.filter(
              b => !b.order.is_user_following,
            ).length;

            const followingPc =
              bookingsFromExperience.length === 0
                ? 0
                : 100 * (_notFollowing === 0 ? 1 : _following / _notFollowing);

            return (
              <ExperienceRow
                key={key}
                covers={_covers}
                bookings={bookingsFromExperience.length}
                revenue={revenue}
                profit={profit}
                followingPc={followingPc}
                {...experience}
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
};

type ExperienceRowProps = ContentfulPost & {
  bookings?: number;
  covers?: number;
  revenue?: number;
  profit?: number;
  followingPc?: number;
};

const ExperienceRow = (props: ExperienceRowProps) => {
  const {
    bookings = 0,
    covers = 0,
    revenue = 0,
    profit = 0,
    followingPc = 0,
    product,
    restaurant,
  } = props;

  const experiencePath = generateStaticURL({
    city: restaurant.city,
    cuisine: restaurant.cuisine,
    restaurant: restaurant.uri_name,
  });

  const experienceUrl = `https://tastiest.io${experiencePath.as}`;

  const { isDesktop, isHuge } = useScreenSize();

  return (
    <div style={{ maxWidth: '950px' }} className="flex bg-white border-2">
      <div
        style={{ minHeight: '100%', minWidth: '10rem' }}
        className="relative w-64"
      >
        <Image
          src={`${product.image.url}?w=250`}
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Body of the row */}
      <div className="flex-grow flex flex-col gap-2 px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium leading-none">{product.name}</h4>

          <span className="whitespace-nowrap">
            <StatusOrb status="online" /> Live
          </span>
        </div>

        {/* Link */}
        <div className="flex items-center gap-1">
          <LinkOutlined className="text-lg text-secondary" />

          <a
            className="font-thin hover:text-secondary duration-300"
            href={`${experienceUrl}?restaurateur`}
          >
            {experienceUrl}
          </a>
        </div>

        {/* Statistics */}
        <div
          className={clsx(
            'flex justify-between flex-wrap gap-4 mt-4',
            isDesktop ? '' : '',
          )}
        >
          <StatsBlock label="Covers">{covers}</StatsBlock>
          <StatsBlock label="Bookings">{bookings}</StatsBlock>
          <StatsBlock label="Revenue">{`£${formatCurrency(
            revenue,
          )}`}</StatsBlock>
          <StatsBlock label="Profit">{`£${formatCurrency(profit)}`}</StatsBlock>
          <StatsBlock label="Following">{`${followingPc}%`}</StatsBlock>
        </div>
      </div>
    </div>
  );
};

type StatsBlockProps = {
  label: string;
  children: number | string;
};

const StatsBlock = (props: StatsBlockProps) => {
  const { label, children: value } = props;

  return (
    <div className="flex flex-col space-y-2 items-center">
      <div
        style={{ fontSize: String(value).length > 5 ? '1rem' : '1.25rem' }}
        className="h-5 leading-none text-secondary"
      >
        {value}
      </div>
      <div className="text-sm leading-none opacity-75">{label}</div>
    </div>
  );
};

export default Experiences;
