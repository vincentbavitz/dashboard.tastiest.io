import nookies from 'nookies';
import React, { createContext, useEffect, useState } from 'react';
import { dlog } from 'utils/development';
import { firebaseClient } from '../utils/firebaseClient';

interface AuthContextParams {
  restaurantUser: firebaseClient.User | null;
  token: string | null;
}

// Example taken from  https://github1s.com/colinhacks/next-firebase-ssr/blob/HEAD/auth.tsx
export const AuthContext = createContext<AuthContextParams>({
  restaurantUser: null,
  token: null,
});

export function AuthProvider({ children }: any) {
  // Undefined while loading, null if not logged in
  const [restaurantUser, setRestaurantUser] = useState<
    firebaseClient.User | null | undefined
  >(undefined);

  // User Token for authentication middleware.
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).nookies = nookies;
    }

    return firebaseClient.auth().onIdTokenChanged(async _restaurantUser => {
      if (!_restaurantUser) {
        dlog(`No token found...`);

        nookies.destroy(null, 'token');
        nookies.set(null, 'token', '', { path: '/' });
        setRestaurantUser(null);
        setToken(null);

        return;
      }

      const _token = await _restaurantUser.getIdToken();

      nookies.destroy(null, 'token');
      nookies.set(null, 'token', _token, { path: '/' });
      setRestaurantUser(_restaurantUser);
      setToken(_token);

      dlog(`Updating token...`, token);
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      dlog(`Refreshing token...`);
      const _restaurantUser = firebaseClient.auth().currentUser;

      if (_restaurantUser) {
        await _restaurantUser.getIdToken(true);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ restaurantUser, token }}>
      {children}
    </AuthContext.Provider>
  );
}
