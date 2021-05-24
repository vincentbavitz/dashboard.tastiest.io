import { useRouter } from 'next/router';
import nookies from 'nookies';
import React, { createContext, useEffect, useState } from 'react';
import { dlog } from 'utils/development';
import { firebaseClient } from '../utils/firebaseClient';

// Example taken from  https://github1s.com/colinhacks/next-firebase-ssr/blob/HEAD/auth.tsx
export const AuthContext = createContext<{
  restaurantUser: firebaseClient.User | null;
}>({
  restaurantUser: null,
});

export function AuthProvider({ children }: any) {
  const router = useRouter();

  // Undefined while loading, null if not logged in
  const [restaurantUser, setRestaurantUser] = useState<
    firebaseClient.User | null | undefined
  >(undefined);

  // Break default layout for certain pages
  const pagesWithoutAuth = [/^\/login/, /^\/merchant-terms-and-conditions/];
  const onNoAuthPage = pagesWithoutAuth.some(page =>
    page.test(router.pathname),
  );

  // Redirects based upon login state
  useEffect(() => {
    dlog('auth ➡️ restaurantUser:', restaurantUser);

    const isLoginPage = /^\/login/.test(router.pathname);
    // Logged in and on /login, redirect
    if (restaurantUser !== null && isLoginPage) {
      router.replace('/');
    }

    // Not logged in and not on a no auth page, redirect
    if (restaurantUser === null && !onNoAuthPage) {
      router.replace('/login');
    }
  }, [router.pathname, restaurantUser]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).nookies = nookies;
    }

    return firebaseClient.auth().onIdTokenChanged(async _restaurantUser => {
      dlog(`token changed!`);
      if (!_restaurantUser) {
        dlog(`no token found...`);
        setRestaurantUser(null);
        nookies.destroy(null, 'token');
        nookies.set(null, 'token', '', { path: '/' });
        return;
      }

      dlog(`updating token...`);
      const token = await _restaurantUser.getIdToken();

      setRestaurantUser(_restaurantUser);
      nookies.destroy(null, 'token');
      nookies.set(null, 'token', token, { path: '/' });
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      dlog(`refreshing token...`);
      const _restaurantUser = firebaseClient.auth().currentUser;
      if (_restaurantUser) await _restaurantUser.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ restaurantUser }}>
      {children}
    </AuthContext.Provider>
  );
}
