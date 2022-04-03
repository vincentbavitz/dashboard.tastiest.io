import { dlog, FirebaseAuthError } from '@tastiest-io/tastiest-utils';
import DebouncePromise from 'awesome-debounce-promise';
import firebaseApp from 'firebase/app';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { FIREBASE } from '../constants';
import { AuthContext } from '../contexts/auth';

export const useAuth = () => {
  const firebase = useFirebase();
  const router = useRouter();
  const [error, _setError] = useState<string>(null);

  const firestore = useFirestore();
  const { restaurantUser, restaurantData, token } = useContext(AuthContext);

  // Kick them out if they're not a restaurant
  useEffect(() => {
    restaurantUser?.getIdTokenResult().then(token => {
      dlog('useAuth ➡️ token:', token.token);

      const isRestaurantUser = Boolean(token?.claims?.restaurant);
      if (!isRestaurantUser) {
        signOut();
      }
    });
  }, [restaurantUser]);

  // Convert firebase error code to Tastiest auth error message
  const setError = (e: { code: string; message: string }) => {
    const error =
      FIREBASE.ERROR_MESSAGES[e?.code] ??
      FIREBASE.ERROR_MESSAGES[FirebaseAuthError.OTHER];

    _setError(error);
  };

  const signIn = async (email: string, password: string) => {
    _setError(null);
    if (!email?.length || !password?.length) {
      return;
    }

    const attemptSignIn = DebouncePromise(
      () => firebase.auth().signInWithEmailAndPassword(email, password),
      2000,
    );

    try {
      // Retry on fail
      let credential: firebaseApp.auth.UserCredential;
      let i = 0;
      while (!credential && i < FIREBASE.MAX_LOGIN_ATTEMPTS) {
        credential = await attemptSignIn();
        i++;

        if (credential) {
          // Ensure user is actually a restaurant not eater
          const token = await credential.user.getIdTokenResult();
          const isRestaurantUser = Boolean(token?.claims?.restaurant);

          dlog('useAuth ➡️ token.claims:', token.claims);

          if (!isRestaurantUser) {
            dlog("This user doesn't have the role of 'restaurant'");
            signOut();
            return;
          }

          // Identify restaurant with Segment
          window.analytics.identify(credential.user.uid, {
            email: credential.user.email,
            userId: credential.user.uid,
            context: {
              userAgent: navigator?.userAgent,
            },
          });

          // Track restaurant sign in
          window.analytics.track('Restaurant Signed In', {
            userId: credential.user.uid,
            email: credential.user.email,
          });

          // FIX ME CORRECT ME; Make restaurant accepting TOS work
          // // If restaurant's first time accepting TOS, log this
          // const restaurantDataDoc = await firestore
          //   .collection(FirestoreCollection.RESTAURANTS)
          //   .doc(credential.user.uid)
          //   .get();

          // const restaurantData = restaurantDataDoc.data();
          // const legalData = restaurantData?.legal as RestaurantLegal;

          // if (!legalData.hasAcceptedTerms) {
          //   // Manually update TOS acceptance, as setRestaurantData
          //   // will not be defined yet
          //   await firestore
          //     .collection(FirestoreCollection.RESTAURANTS)
          //     .doc(credential.user.uid)
          //     .set(
          //       {
          //         [RestaurantDataKey.LEGAL]: { hasAcceptedTerms: true },
          //       },
          //       { merge: true },
          //     );

          //   // Fire off event with Segment which triggers Klaviyo email confirmation
          //   window.analytics.track('Restaurant Accepted TOS', {
          //     userId: credential.user.uid,
          //     email: credential.user.email,
          //   });
          // }

          router.push('/');
        }
      }

      return credential;
    } catch (error) {
      dlog('error', error);
      setError(error);
    }

    return false;
  };

  // If redirectTo is given, will redirect there after sign out.
  // Else, the page will simply reload.
  const signOut = async (redirectTo?: string) => {
    _setError(null);

    try {
      await firebase.auth().signOut();

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.reload();
      }
    } catch (error) {
      setError(error);
    }
  };

  // Null if the user information has not been loaded yet. else boolean
  const isSignedIn =
    restaurantUser === undefined ? null : Boolean(restaurantUser?.uid);

  return {
    restaurantUser,
    restaurantData,
    token,
    signIn,
    signOut,
    isSignedIn,
    error,
  };
};
