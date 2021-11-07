import { EmailTemplate, RestaurantDataApi } from '@tastiest-io/tastiest-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from 'utils/firebaseAdmin';

export type GetEmailTemplateReturn = {
  [id: string]: EmailTemplate;
};

/**
 * Gets a restaurant's email templates/.
 * Requires the query parameter `restaurantId`
 *
 * Intended to be used exclusively with useSWR
 */
export default async function getEmailTemplates(
  request: NextApiRequest,
  response: NextApiResponse<GetEmailTemplateReturn>,
) {
  // Only allow GET
  if (request.method !== 'GET') {
    response.status(405).end();
    return;
  }

  const restaurantId = String(request.query.restaurantId);

  if (!restaurantId?.length) {
    response.status(400).statusMessage = 'Restaurant ID not provided';
    response.end();
    return;
  }

  try {
    const restaurantDataApi = new RestaurantDataApi(
      firebaseAdmin,
      restaurantId,
    );

    const restaurantData = await restaurantDataApi.getRestaurantData();
    const templates = restaurantData?.email?.templates ?? {};

    response.json(templates);
  } catch (error) {
    response.status(400).statusMessage = 'Unknown error';
    response.end();
    return;
  }
}
