import {
  dlog,
  FirestoreCollection,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import * as firebaseAdmin from 'firebase-admin';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

const cert = {
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

if (!cert.privateKey || !cert.clientEmail || !cert.projectId) {
  dlog(
    `Failed to load Firebase credentials. Follow the instructions in the README to set your Firebase credentials inside environment variables.`,
  );
}

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(cert),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

const db = (collection: FirestoreCollection) =>
  firebaseAdmin.firestore().collection(collection);

/** Verify cookie token inside getServerSideProps */
const verifyCookieToken = async (context: GetServerSidePropsContext) => {
  const cookieToken = nookies.get(context)?.token;
  const restaurantDataApi = new RestaurantDataApi(firebaseAdmin);
  const { restaurantId } = await restaurantDataApi.initFromCookieToken(
    cookieToken,
  );

  // If no user, redirect to login
  if (!restaurantId) {
    return {
      valid: false,
      cookieToken: null,
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { valid: true, cookieToken, redirect: null };
};

export { firebaseAdmin, verifyCookieToken, db };
