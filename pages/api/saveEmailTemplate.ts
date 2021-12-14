import {
  RestaurantData,
  RestaurantDataApi,
  RestaurantDataKey,
} from '@tastiest-io/tastiest-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from 'utils/firebaseAdmin';

export interface SaveEmailTemplateParams {
  restaurantId: string;
  id: string;
  name: string;
  html: string;
  design: any;
}

/**
 * Saves an email HTML template for a restaurant.
 * Available shortcodes are
 *    {{ firstName }}
 *    {{ lastName }}
 *    {{ fullName }}
 * Requires the body parameters:
 * @param restaurantId string
 * @param id string --> Either an existing ID or a new one.
 * @param html string
 * @param name string
 * @param design any --> Used to load previous designs
 */
export default async function saveEmailTemplate(
  request: NextApiRequest,
  response: NextApiResponse,
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

  const {
    id = null,
    restaurantId = null,
    name = null,
    html = null,
    design = null,
  } = body as SaveEmailTemplateParams;

  if (
    !id?.length ||
    !restaurantId?.length ||
    !html?.length ||
    !name?.length ||
    !design
  ) {
    response.json({
      success: false,
      error: 'Invalid parameters given.',
      data: null,
    });
  }

  try {
    const restaurantDataApi = new RestaurantDataApi(
      firebaseAdmin,
      restaurantId,
    );

    // Does it already exist?
    const restaurantData = await restaurantDataApi.getRestaurantData();
    const templates = restaurantData?.email?.templates ?? {};

    const existingKey = Object.keys(templates).find(key => key === id);
    const existing = templates[existingKey];
    const createdAt = existing?.createdAt ?? Date.now();

    // Saving always sets it to un-approved.
    restaurantDataApi.setRestaurantData(RestaurantDataKey.EMAIL, {
      templates: {
        [id]: {
          id,
          name,
          html,
          design,
          createdAt,
          editedAt: Date.now(),
          isApproved: false,
          approvedAt: null,
        },
      },
    });

    response.json({ success: true, error: null, data: null });
  } catch (error) {
    response.status(400).statusMessage = `Error: ${error}`;
    response.end();
    return;
  }
}
