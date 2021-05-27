import { FirestoreCollection, IBooking } from '@tastiest-io/tastiest-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from 'utils/firebaseAdmin';

interface ICoverGroup {
  covers: number;
  timestamp: number;
}

interface GetCoversResponse {
  covers: ICoverGroup[];
  totalCoversForPeriod: number;
}

type CoversPeriod = 'today' | 'week' | 'all';
const MS_IN_A_DAY = 86400000;
const MS_IN_A_WEEK = MS_IN_A_DAY * 7;

/**
 * Gets covers information from Firestore
 * Intended to be used exclusively with useSWR
 *
 * Periods are given in timestamp values. You should
 * transform them into your local timezone client-side.
 * Eg. 'today' just means in the last 24 hours.
 *
 * `period` may be `today`, `week` or `all`.
 */
export default async function getCovers(
  request: NextApiRequest,
  response: NextApiResponse<GetCoversResponse>,
) {
  // Only allow GET
  if (request.method !== 'GET') {
    response.status(405).end();
    return;
  }

  const restaurantId = String(request.query.restaurantId);

  // Timestamp to start at (for pagination)
  const startAt = Number(request?.query?.startAt ?? Number.MAX_SAFE_INTEGER);
  const limit = Number(request?.query?.limit ?? 100);

  // Covers over the period
  const period: CoversPeriod = String(
    request?.query?.period ?? 'week',
  ) as CoversPeriod;

  // prettier-ignore
  const periodStartedAtTimestamp =
    period === 'all' ? 0 : 
    period === 'week' ? Date.now() - MS_IN_A_WEEK : 
    period === 'today' ? Date.now() - MS_IN_A_DAY :
    '0';

  if (!restaurantId || !restaurantId?.length) {
    response.status(400).statusMessage = 'Restaurant ID not provided';
    response.end();
    return;
  }

  try {
    const query = await firebaseAdmin
      .firestore()
      .collection(FirestoreCollection.BOOKINGS);

    const bookingsSnapshot = await query
      .where('restaurantId', '==', restaurantId)
      .where('paidAt', '>=', periodStartedAtTimestamp)
      .orderBy('paidAt', 'desc')
      .startAt(startAt)
      .limit(limit)
      .get();

    const bookings: IBooking[] = [];
    bookingsSnapshot.forEach(doc => bookings.push(doc.data() as IBooking));

    if (!bookings?.length) {
      response.json({ covers: [], totalCoversForPeriod: 0 });
      return;
    }

    // Calculate covers
    const covers: ICoverGroup[] = [];
    let totalCoversForPeriod = 0;
    bookings.forEach(booking => {
      covers.push({
        covers: booking.heads,
        timestamp: booking.paidAt,
      });

      totalCoversForPeriod += booking.heads;
    });

    response.json({
      covers,
      totalCoversForPeriod,
    });
  } catch (error) {
    response.status(400).statusMessage = 'Unknown error';
    response.end();
    return;
  }
}
