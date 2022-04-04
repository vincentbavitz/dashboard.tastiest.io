import {
  DayOfWeek,
  OpenTimesMetricDay,
  WeekOpenTimes,
} from '@tastiest-io/tastiest-horus';
import {
  Horus,
  humanTimeIntoMins,
  TIME,
  useHorusSWR,
} from '@tastiest-io/tastiest-utils';
import { useAuth } from 'hooks/useAuth';
import React, { useState } from 'react';
import { OpenTimesData } from '../BookingSlotsBlock';

export enum BookingSlotsSelectorSteps {
  DAYS,
  HOURS,
  SLOTS,
}

export type OpenTimesArray = [
  OpenTimesMetricDay,
  OpenTimesMetricDay,
  OpenTimesMetricDay,
  OpenTimesMetricDay,
  OpenTimesMetricDay,
  OpenTimesMetricDay,
  OpenTimesMetricDay,
];

type BookingSlots = {
  step: BookingSlotsSelectorSteps;
  setStep: React.Dispatch<React.SetStateAction<BookingSlotsSelectorSteps>>;
  saving: boolean;
  seatingDuration: number; // in minutes
  openTimes: WeekOpenTimes;
  setSeatingDuration: React.Dispatch<React.SetStateAction<number>>;
  openTimesMetric: OpenTimesMetricDay[];
  setOpenTimesMetric: React.Dispatch<
    React.SetStateAction<OpenTimesMetricDay[]>
  >;

  saveBookingSlots: (restaurantId: string) => Promise<void>;
  resetToDefaults: () => void;
};

const startTime = humanTimeIntoMins(9, 0);
const endTime = humanTimeIntoMins(20, 0);
const defaultValue: OpenTimesMetricDay = {
  open: false,
  range: [startTime, endTime],
};

export type DayNumeral = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const BookingSlotsContext = React.createContext<BookingSlots>(undefined);

export const BookingSlotsProvider = ({ children }) => {
  const { token, restaurantData } = useAuth();

  const { data, mutate } = useHorusSWR<OpenTimesData>(
    '/restaurants/public/open-times',
    {
      token,
      query: { restaurant_id: restaurantData.id },
    },
    {
      refreshInterval: 30000,
      refreshWhenHidden: true,
    },
  );

  const openTimes = data?.open_times ?? null;

  const [step, setStep] = useState<BookingSlotsSelectorSteps>(
    BookingSlotsSelectorSteps.DAYS,
  );

  // Loading for the save button
  const [saving, setSaving] = useState(false);

  // Days of the week where Sunday = 0, Saturday = 6
  const [openTimesMetric, setOpenTimesMetric] = useState<OpenTimesArray>(
    Array(TIME.DAYS_IN_WEEK).fill(defaultValue) as OpenTimesArray,
  );

  // In minutes
  const [seatingDuration, setSeatingDuration] = useState(15);

  const saveBookingSlots = async (restaurantId: string) => {
    if (step !== BookingSlotsSelectorSteps.SLOTS) {
      return;
    }

    mutate({
      open_times: {
        [DayOfWeek.SUNDAY]: openTimesMetric[DayOfWeek.SUNDAY],
        [DayOfWeek.MONDAY]: openTimesMetric[DayOfWeek.MONDAY],
        [DayOfWeek.TUESDAY]: openTimesMetric[DayOfWeek.TUESDAY],
        [DayOfWeek.WEDNESDAY]: openTimesMetric[DayOfWeek.WEDNESDAY],
        [DayOfWeek.THURSDAY]: openTimesMetric[DayOfWeek.THURSDAY],
        [DayOfWeek.FRIDAY]: openTimesMetric[DayOfWeek.FRIDAY],
        [DayOfWeek.SATURDAY]: openTimesMetric[DayOfWeek.SATURDAY],
      },
      seating_duration: seatingDuration,
    });

    setSaving(true);

    const transformedForDto = openTimesMetric.map(c =>
      c.open ? c.range : [0, 0],
    );

    const horus = new Horus(token);
    await horus.post('/restaurants/set-open-times', {
      restaurant_id: restaurantId,
      seating_duration: Math.round(seatingDuration),
      0: transformedForDto[0],
      1: transformedForDto[1],
      2: transformedForDto[2],
      3: transformedForDto[3],
      4: transformedForDto[4],
      5: transformedForDto[5],
      6: transformedForDto[6],
    });

    setSaving(false);
  };

  const resetToDefaults = () => {
    setStep(BookingSlotsSelectorSteps.DAYS);
    setOpenTimesMetric(
      Array(TIME.DAYS_IN_WEEK).fill(defaultValue) as OpenTimesArray,
    );
  };

  const params: BookingSlots = {
    step,
    setStep,
    saving,
    openTimes,
    saveBookingSlots,
    resetToDefaults,
    openTimesMetric,
    setOpenTimesMetric,
    seatingDuration,
    setSeatingDuration,
  };

  return (
    <BookingSlotsContext.Provider value={params}>
      {children}
    </BookingSlotsContext.Provider>
  );
};
