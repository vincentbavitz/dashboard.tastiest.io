import {
  Booking,
  TIME as UTILS_TIME,
  useHorusSWR,
} from '@tastiest-io/tastiest-utils';
import { AuthContext } from 'contexts/auth';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { TIME } from '../../constants';
import BarChart from './BarChart';

const ONE_DAY_IN_MS = 86400000;

interface Props {
  restaurantId: string;
}

export default function CoversBarChart({ restaurantId }: Props) {
  const { token } = useContext(AuthContext);
  const { data } = useHorusSWR<Booking[]>(
    `/bookings?restaurantId=${restaurantId}`,
    token,
    {
      refreshInterval: 60000,
      initialData: null,
      refreshWhenHidden: true,
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    },
  );

  const bookings = data?.filter(
    booking => booking.isTest === (process.env.NODE_ENV === 'development'),
  );

  const coverHistory =
    bookings?.map(booking => ({
      covers: booking.heads,
      timestamp: booking.bookedForTimestamp,
    })) ?? [];

  const firstOfWeek = DateTime.now()
    .setZone(UTILS_TIME.LOCALES.LONDON)
    .set({ day: 1, hour: 0, second: 0 });

  // Day of the week corresponds to Date.getDay() numerals;
  // where Sunday = 0 and Saturday = 6.
  const thisWeek = [
    firstOfWeek.toMillis(),
    firstOfWeek.plus({ days: 1 }).toMillis(),
    firstOfWeek.plus({ days: 2 }).toMillis(),
    firstOfWeek.plus({ days: 3 }).toMillis(),
    firstOfWeek.plus({ days: 4 }).toMillis(),
    firstOfWeek.plus({ days: 5 }).toMillis(),
    firstOfWeek.plus({ days: 6 }).toMillis(),
  ];

  // Get covers for each day of the week
  const coversThisWeek = thisWeek.map(timestamp => {
    // prettier-ignore
    const dayNumber = DateTime
      .fromMillis(timestamp).setZone(UTILS_TIME.LOCALES.LONDON)
      .weekday - 1;

    const dayName = TIME.DAYS_OF_THE_WEEK[dayNumber];

    let coversForThisDay = 0;
    coverHistory.forEach(coverRecord => {
      if (
        coverRecord.timestamp >= timestamp &&
        coverRecord.timestamp < timestamp + ONE_DAY_IN_MS
      ) {
        coversForThisDay += coverRecord.covers;
      }
    });

    return { day: dayName, covers: coversForThisDay };
  });

  const totalCovers = coversThisWeek.reduce((a, b) => a + b.covers, 0);

  return (
    <div className="px-2 py-4 bg-white rounded-xl">
      <h4 className="px-4 text-xl text-primary">
        {totalCovers} <span className="text-sm">covers</span>
      </h4>

      <div className="relative w-full aspect-w-16 aspect-h-7">
        <BarChart data={coversThisWeek} indexBy="day" keys={['covers']} />
      </div>
    </div>
  );
}
