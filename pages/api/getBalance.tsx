import {
  dlog,
  RestaurantDataApi,
  transformPriceFromStripe,
} from '@tastiest-io/tastiest-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { firebaseAdmin } from 'utils/firebaseAdmin';

export interface GetBalanceReturn {
  total: number;
  pending: number;
  available: number;
}

/**
 * Gets restaurant Connect Account balances
 * Requires the query parameter `restaurantId`
 *
 * Intended to be used exclusively with useSWR
 */
export default async function getBalance(
  request: NextApiRequest,
  response: NextApiResponse<GetBalanceReturn>,
) {
  // Only allow GET
  if (request.method !== 'GET') {
    response.status(405).end();
    return;
  }

  const restaurantId = String(request.query.restaurantId);

  if (!restaurantId || !restaurantId?.length) {
    response.status(400).statusMessage = 'Restaurant ID not provided';
    response.end();
    return;
  }

  const restaurantDataApi = new RestaurantDataApi(firebaseAdmin, restaurantId);
  const restaurantData = await restaurantDataApi.getRestaurantData();

  const stripe = new Stripe(
    process.env.NODE_ENV === 'production'
      ? process.env.STRIPE_LIVE_SECRET_KEY
      : process.env.STRIPE_TEST_SECRET_KEY,
    {
      apiVersion: '2020-08-27',
    },
  );

  // Get Stripe account information
  const stripeAccount = restaurantData?.financial?.stripeConnectedAccount?.id;

  let total = 0;
  let pending = 0;
  let available = 0;

  try {
    const payouts = await stripe.payouts.list({
      stripeAccount,
    });

    dlog('getBalance ➡️  payouts.data:', payouts.data);

    total = transformPriceFromStripe(
      payouts.data
        .filter(a => a.currency === 'gbp')
        .reduce((a, b) => a + b?.amount ?? 0, 0),
    );

    const balance = await stripe.balance.retrieve({
      stripeAccount,
    });

    pending = transformPriceFromStripe(
      balance?.pending
        .filter(a => a.currency === 'gbp')
        .reduce((a, b) => a + b?.amount ?? 0, 0),
    );

    available = transformPriceFromStripe(
      balance?.available
        .filter(a => a.currency === 'gbp')
        .reduce((a, b) => a + b?.amount ?? 0, 0),
    );
  } catch (error) {
    response.status(400).end();
    return;
  }

  response.json({
    total,
    available,
    pending,
  });
}
