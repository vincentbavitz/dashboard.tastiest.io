import {
  dlog,
  FirebaseAuthError,
  FirestoreCollection,
  IRestaurantLegal,
  RestaurantData,
} from '@tastiest-io/tastiest-utils';
import DebouncePromise from 'awesome-debounce-promise';
import firebaseApp from 'firebase/app';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { FIREBASE } from '../constants';
import { AuthContext } from '../contexts/auth';

export const useAuth = () => {
  const firebase = useFirebase();
  const router = useRouter();
  const [error, _setError] = useState<string>(null);

  const firestore = useFirestore();
  const { restaurantUser } = useContext(AuthContext);

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

          if (!isRestaurantUser) {
            dlog("This user doesn't have the role of 'restaurant'");
            signOut();
            return;
          }

          // Identify restaurant with Segment
          dlog('useAuth ➡️ credential.user.uid:', credential.user.uid);
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

          // If restaurant's first time accepting TOS, log this
          const restaurantDataDoc = await firestore
            .collection(FirestoreCollection.RESTAURANTS)
            .doc(credential.user.uid)
            .get();

          const restaurantData = restaurantDataDoc.data();
          const legalData = restaurantData?.legal as IRestaurantLegal;

          if (!legalData.hasAcceptedTerms) {
            // Manually update TOS acceptance, as setRestaurantData
            // will not be defined yet
            await firestore
              .collection(FirestoreCollection.RESTAURANTS)
              .doc(credential.user.uid)
              .set(
                {
                  [RestaurantData.LEGAL]: { hasAcceptedTerms: true },
                },
                { merge: true },
              );

            // Fire off event with Segment which triggers Klaviyo email confirmation
            window.analytics.track('Restaurant Accepted TOS', {
              userId: credential.user.uid,
              email: credential.user.email,
            });
          }
        }
      }

      return credential;
    } catch (error) {
      console.log('error', error);
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

  // const resetPassword = async (email: string) => {
  //   _setError(null);

  //   //  Email must be given as a parameter because user might not be logged in.
  //   if (!email?.length) {
  //     return;
  //   }

  //   try {
  //     await firebase.auth().sendPasswordResetEmail(email);
  //     return true;
  //   } catch (error) {
  //     setError(error);
  //     return false;
  //   }
  // };

  // Null if the user information has not been loaded yet. else boolean
  const isSignedIn =
    restaurantUser === undefined ? null : Boolean(restaurantUser?.uid);

  return {
    restaurantUser,
    signIn,
    signOut,
    isSignedIn,
    error,
  };
};
