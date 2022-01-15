import { Booking, FirestoreCollection } from '@tastiest-io/tastiest-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'utils/firebaseAdmin';

/**
 * Gets a restaurant's bookings from Firestore
 * Requires the query parameter `restaurantId`
 *
 * Intended to be used exclusively with useSWR
 */
export default async function getBookings(
  request: NextApiRequest,
  response: NextApiResponse<Booking[]>,
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

  if (!restaurantId || !restaurantId?.length) {
    response.status(400).statusMessage = 'Restaurant ID not provided';
    response.end();
    return;
  }

  try {
    const query = await db(FirestoreCollection.BOOKINGS);

    const bookingsSnapshot = await query
      .where('restaurantId', '==', restaurantId)
      .where('isTest', '==', false)
      .orderBy('paidAt', 'desc')
      .startAt(startAt)
      .limit(limit)
      .get();

    const bookings: Booking[] = [];
    bookingsSnapshot.forEach(doc => bookings.push(doc.data() as Booking));

    if (!bookings?.length) {
      response.json([]);
      return;
    }

    response.json(bookings);
  } catch (error) {
    response.status(400).statusMessage = 'Unknown error';
    response.end();
    return;
  }
}
