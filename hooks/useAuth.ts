import { FirebaseAuthError } from '@tastiest-io/tastiest-utils';
import DebouncePromise from 'awesome-debounce-promise';
import firebaseApp from 'firebase/app';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useFirebase } from 'react-redux-firebase';
import { FIREBASE } from '../constants';
import { AuthContext } from '../contexts/auth';
import { useRestaurantData } from './useRestaurantData';

export const useAuth = () => {
  const firebase = useFirebase();
  const router = useRouter();
  const [error, _setError] = useState<string>(null);
  const { restaurantUser } = useContext(AuthContext);
  const { setRestaurantData } = useRestaurantData(restaurantUser);

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
      while (!restaurantUser && i < FIREBASE.MAX_LOGIN_ATTEMPTS) {
        credential = await attemptSignIn();
        i++;

        console.log(
          `Attempting to log user in. (${i}/${FIREBASE.MAX_LOGIN_ATTEMPTS})`,
        );
      }

      if (credential) {
        // Identify restaurant with Segment
        window.analytics.identify(credential.user.uid, {
          context: {
            userAgent: navigator?.userAgent,
          },
        });

        // Track restaurant sign in
        window.analytics.track('Restaurant Signed In', {
          userId: restaurantUser.uid,
        });

        return credential;
      }
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
