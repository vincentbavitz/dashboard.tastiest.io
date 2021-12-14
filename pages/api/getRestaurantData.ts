import {
  dlog,
  RestaurantData,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from 'utils/firebaseAdmin';

export type GetRestaurantDataReturn = Partial<RestaurantData>;

/**
 * Gets restaurant data for the logged in restaurant.
 * Used inside the layout component to give data to its children.
 * Intended to be used exclusively with useSWR
 */
export default async function getRestaurantData(
  request: NextApiRequest,
  response: NextApiResponse<GetRestaurantDataReturn>,
) {
  // Only allow GET
  if (request.method !== 'GET') {
    response.status(405).end();
    return;
  }

  if (!request.query.restaurantId) {
    response.status(405).end();
    return;
  }

  try {
    const restaurantDataApi = new RestaurantDataApi(
      firebaseAdmin,
      String(request.query.restaurantId),
    );

    dlog(
      'getRestaurantData ➡️ String(request.query.restaurantId):',
      String(request.query.restaurantId),
    );

    const restaurantData = await restaurantDataApi.getRestaurantData();

    dlog('getRestaurantData ➡️ restaurantData:', restaurantData);
    if (!restaurantData) {
      response.status(400).end();
      return;
    }

    response.json(restaurantData);
  } catch (error) {
    response.status(400).statusMessage = `Error: ${error}`;
    response.end();
    return;
  }
}
