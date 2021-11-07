import { FirestoreCollection } from '@tastiest-io/tastiest-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { db, firebaseAdmin } from 'utils/firebaseAdmin';

export interface DeleteEmailTemplateParams {
  id: string;
  restaurantId: string;
}

/**
 * Deletes an email HTML template of a restaurant.
 * Requires the body parameters:
 * @param restaurantId string
 * @param id string --> The template ID
 */
export default async function deleteEmailTemplate(
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

  const { id = null, restaurantId = null } = body as DeleteEmailTemplateParams;

  if (!id?.length || !restaurantId?.length) {
    response.json({
      success: false,
      error: 'Invalid parameters given.',
      data: null,
    });
  }

  console.log(`/${restaurantId}/email/templates/${id}`);

  try {
    await db(FirestoreCollection.RESTAURANTS)
      .doc(restaurantId)
      .update({
        [`email.templates.${id}`]: firebaseAdmin.firestore.FieldValue.delete(),
      });

    response.json({ success: true, error: null, data: null });
  } catch (error) {
    response.status(400).statusMessage = `Error: ${error}`;
    response.end();
    return;
  }
}
