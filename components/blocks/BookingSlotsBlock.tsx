import { EditOutlined } from '@ant-design/icons';
import { WeekOpenTimes } from '@tastiest-io/tastiest-horus';
import { minsIntoHumanTime, TIME } from '@tastiest-io/tastiest-utils';
import { useAuth } from 'hooks/useAuth';
import React, { useContext, useState } from 'react';
import BlockTemplate from './BlockTemplate';
import BookingSlotsSelector from './BookingSlotsSelector';
import {
  BookingSlotsContext,
  BookingSlotsProvider,
} from './BookingSlotsSelector/BookingSlotsContext';

export type OpenTimesData = {
  open_times: WeekOpenTimes;
  seating_duration: number;
};

export default function BookingSlotsBlock() {
  return (
    <BookingSlotsProvider>
      <BookingSlotsBlockInner />
    </BookingSlotsProvider>
  );
}

function BookingSlotsBlockInner() {
  const [openTimesSelectorOpen, setOpenTimesSelectorOpen] = useState(false);

  const { restaurantData } = useAuth();
  const { openTimes, seatingDuration } = useContext(BookingSlotsContext);

  return (
    <>
      <BookingSlotsSelector
        restaurantId={restaurantData.id}
        show={openTimesSelectorOpen}
        close={() => setOpenTimesSelectorOpen(false)}
      />

      <BlockTemplate
        title="Booking Slots"
        theme="alt-3"
        icon={EditOutlined}
        onIconClick={() => setOpenTimesSelectorOpen(true)}
      >
        <div className="flex flex-col">
          <div className="pb-3 text-left">
            Seating duration: {seatingDuration} mins
          </div>

          {openTimes ? (
            Object.entries(openTimes).map(([key, day]) => {
              return day.open ? (
                <div
                  key={key}
                  className="flex justify-between py-2 text-base text-alt"
                >
                  <div className="font-medium">
                    {TIME.DAYS_OF_THE_WEEK[key]}
                  </div>
                  <div className="">
                    {minsIntoHumanTime(day.range[0])}
                    <div className="inline px-1 font-mono">→</div>
                    {minsIntoHumanTime(day.range[1])}
                  </div>
                </div>
              ) : null;
            })
          ) : (
            <div className="flex items-center justify-center h-20">
              No booking slots set.
            </div>
          )}
        </div>
      </BlockTemplate>
    </>
  );
}
