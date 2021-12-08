import { Button, Modal } from '@tastiest-io/tastiest-ui';
import {
  humanTimeIntoMins,
  minsIntoHumanTime,
} from '@tastiest-io/tastiest-utils';
import BookingSlotsBlock from 'components/blocks/BookingSlotsBlock';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import { RangeSlider, Slider } from 'rsuite';
import 'rsuite/Slider/styles/index.less';
import { METADATA } from '../constants';

const Times: NextPage<DefaultAuthPageProps> = props => {
  const { restaurantData } = props;

  return (
    <>
      <Head>
        <title>Times - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div className="flex flex-col space-y-10">
        <DefineSlotsSection {...props} />
        {/* <BoostTablesSection {...props} /> */}
      </div>
    </>
  );
};

const DefineSlotsSection = (props: DefaultAuthPageProps) => {
  const { restaurantData, restaurantUser } = props;

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
          {restaurantData ? (
            <BookingSlotsBlock restaurantData={restaurantData} />
          ) : null}
        </div>

        <div className="flex-1">
          {/* {restaurantData ? (
            <QuietTimesBlock restaurantData={restaurantData} />
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

// const BoostTablesSection: FC<Props> = props => {
//   const { restaurantData } = props;

//   const cms = new CmsApi();
//   const [experiences, setExperiences] = useState<ExperiencePost[] | null>([]);
//   const [isFillTablesModalOpen, setIsFillTablesModalOpen] = useState(false);

//   const [boosting, setBoosting] = useState(false);
//   const [notifying, setNotifying] = useState(false);

//   useEffect(() => {
//     if (restaurantData?.details) {
//       cms
//         .getPostsOfRestaurant(restaurantData.details.uriName)
//         .then(({ posts }) => {
//           setExperiences(posts);
//         });
//     }
//   }, [restaurantData]);

//   const startAI = () => {
//     setIsFillTablesModalOpen(false);
//     setNotifying(true);

//     setTimeout(() => {
//       setNotifying(false);
//       setBoosting(true);
//     }, 2500);
//   };

//   return (
//     <div className="">
//       <FillTablesModal
//         onConfirm={startAI}
//         show={isFillTablesModalOpen}
//         close={() => setIsFillTablesModalOpen(false)}
//       />

//       <div className="flex items-end justify-between pb-4">
//         <p className="text-xl text-dark leading-none">AI Table Selection</p>

//         <Button
//           onClick={() => (boosting ? null : setIsFillTablesModalOpen(true))}
//           loading={notifying}
//         >
//           {boosting ? (
//             <>
//               <StatusOrb status="online" size={3} />{' '}
//               <span className="pl-2">Running</span>
//             </>
//           ) : (
//             'Fill tables'
//           )}
//         </Button>
//       </div>

//       <p className="">
//         Run ads with our AI to fill your tables at the last minute
//       </p>

//       <div className="flex flex-col pt-10 pb-12">
//         <p className="pb-4 text-xl text-dark leading-none">Current Ads</p>

//         <div className="grid gap-4 grid-cols-2">
//           {[...experiences, ...experiences]?.map((experience, key) => (
//             <LiveExperienceAdMetrics key={key} experience={experience} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

interface FillTablesModalProps {
  show: boolean;
  close: () => void;
  onConfirm: () => void;
}

const FillTablesModal = (props: FillTablesModalProps) => {
  const { close, onConfirm } = props;

  const [range, setRange] = useState([540, 1440]);
  const [coversRequired, setCoversRequired] = useState(1);

  const humanRange = `${minsIntoHumanTime(range[0])} > ${minsIntoHumanTime(
    range[1],
  )}`;

  const cost = useMemo(() => {
    const duration = range[1] - range[0];
    return (duration / 60) * 3 * (coversRequired / 20);
  }, [coversRequired, range]);

  return (
    <Modal title={'Fill Tables'} {...props}>
      <div style={{ minWidth: '300px' }}>
        <div className="flex pb-2 pt-4 justify-between">
          <div>What time?</div>
          <div>{humanRange}</div>
        </div>

        <RangeSlider
          defaultValue={[1080, 1140]}
          step={15}
          min={540}
          max={humanTimeIntoMins(24, 0)}
          onChange={setRange}
          tooltip={false}
        />
      </div>

      <div className="pt-6">
        <div className="flex pb-2 justify-between">
          <div>Covers required?</div>
          <div>{coversRequired}</div>
        </div>

        <Slider
          defaultValue={coversRequired}
          step={1}
          min={1}
          max={50}
          progress
          onChange={setCoversRequired}
        />
      </div>

      <div className="pt-10">
        <div className="flex space-x-2 justify-end">
          <Button color="light" onClick={close}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Times;
