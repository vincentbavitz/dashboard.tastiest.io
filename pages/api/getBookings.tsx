import { FirestoreCollection, IBooking } from '@tastiest-io/tastiest-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from 'utils/firebaseAdmin';

/**
 * Gets order request from Firestore
 * Requires the query parameter `orderId`
 *
 * Intended to be used exclusively with useSWR
 */
export default async function getBookings(
  request: NextApiRequest,
  response: NextApiResponse<IBooking[]>,
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
    const query = await firebaseAdmin
      .firestore()
      .collection(FirestoreCollection.BOOKINGS);

    const bookingsSnapshot = await query
      .where('restaurantId', '==', restaurantId)
      .orderBy('paidAt', 'desc')
      .startAt(startAt)
      .limit(limit)
      .get();

    const bookings: IBooking[] = [];
    bookingsSnapshot.forEach(doc => bookings.push(doc.data() as IBooking));

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
