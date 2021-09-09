import {
  FunctionsResponse,
  RestaurantData,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import { WeekTimeSlots } from '@tastiest-io/tastiest-utils/dist/types/time';
import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from 'utils/firebaseAdmin';

export type SetQuietSlotsParams = {
  restaurantId: string;
  slots: WeekTimeSlots;
};

export type SetQuietSlotsReturn = FunctionsResponse<{
  slots: WeekTimeSlots | null;
}>;

/**
 * Requires `restaurantId: string`
 * and `slots: WeekTimeSlots` as parameters.
 */
export default async function setQuietSlots(
  request: NextApiRequest,
  response: NextApiResponse<SetQuietSlotsReturn>,
) {
  // Only allow POST
  if (request.method !== 'POST') {
    response.status(405).end();
    return;
  }

  // Get body as JSON or raw
  let body;
  try {
    body = JSON.parse(request.body);
  } catch (e) {
    body = request.body;
  }

  const { restaurantId, slots } = body;

  // Restaurant ID is required
  if (!restaurantId?.length) {
    response.json({
      success: false,
      data: { slots: null },
      error: 'No restaurant ID provided',
    });
    return;
  }

  const validateSlotsType = (slots: WeekTimeSlots) => {
    return true;
    // (
    // !slots[0]?.length ||
    // slots[0].length !== 96 ||
    // !slots[1]?.length ||
    // slots[1].length !== 96 ||
    // !slots[2]?.length ||
    // slots[2].length !== 96 ||
    // !slots[3]?.length ||
    // slots[3].length !== 96 ||
    // !slots[4]?.length ||
    // slots[4].length !== 96 ||
    // !slots[5]?.length ||
    // slots[5].length !== 96 ||
    // !slots[6]?.length ||
    // slots[6].length !== 96 ||
    // slots[0].some?.(t => t !== 0 && t !== 1) ||
    // slots[1].some?.(t => t !== 0 && t !== 1) ||
    // slots[2].some?.(t => t !== 0 && t !== 1) ||
    // slots[3].some?.(t => t !== 0 && t !== 1) ||
    // slots[4].some?.(t => t !== 0 && t !== 1) ||
    // slots[5].some?.(t => t !== 0 && t !== 1) ||
    // slots[6].some?.(t => t !== 0 && t !== 1)
    // );
  };

  // Ensure correct type for slots
  if (!validateSlotsType(slots)) {
    response.json({
      success: false,
      data: { slots: null },
      error: 'Invalid slots parameter provided',
    });
    return;
  }

  try {
    // Fetch the restaurant from Firestore
    const restaurantDataApi = new RestaurantDataApi(
      firebaseAdmin,
      restaurantId,
    );

    const { success, error } = await restaurantDataApi.setRestaurantData(
      RestaurantData.METRICS,
      {
        quietTimes: (slots as never) as WeekTimeSlots,
      },
    );

    response.json({
      success,
      data: { slots: (slots as never) as WeekTimeSlots },
      error,
    });
  } catch (e) {
    response.json({
      success: false,
      data: { slots: null },
      error: String(e),
    });
    return;
  }
}
