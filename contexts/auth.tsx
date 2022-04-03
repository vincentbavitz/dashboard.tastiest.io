import {
  HorusRestaurant,
  HorusRestaurantProfile,
} from '@tastiest-io/tastiest-horus';
import { Horus, useHorusSWR } from '@tastiest-io/tastiest-utils';
import nookies from 'nookies';
import React, { createContext, useEffect, useState } from 'react';
import { dlog } from 'utils/development';
import { firebaseClient } from '../utils/firebaseClient';

export type HorusRestaurantEnchanted = HorusRestaurant & {
  profile: HorusRestaurantProfile;
};

interface AuthContextParams {
  restaurantUser: firebaseClient.User | null;
  restaurantData: HorusRestaurantEnchanted | null;
  token: string | null;
}

// Example taken from  https://github1s.com/colinhacks/next-firebase-ssr/blob/HEAD/auth.tsx
export const AuthContext = createContext<AuthContextParams>({
  restaurantUser: null,
  restaurantData: null,
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

  // Force refresh the token every 10 minutes
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

  // Store user data in the provider.
  const { data: restaurantData, mutate } = useHorusSWR<
    HorusRestaurantEnchanted
  >(
    token ? '/restaurants/me' : null,
    { token },
    {
      refreshInterval: 30000,
    },
  );

  // Manually fetch restaurant-data for the mutation on useHorusSWR.
  // This occurs when the restaurant logs in or out.
  const fetchRestaurantData = async (
    token: string,
  ): Promise<HorusRestaurantEnchanted> => {
    const horus = new Horus(token);
    const { data: _restaurantData, error } = await horus.get<
      HorusRestaurantEnchanted
    >('/restaurants/me');

    if (error) {
      return null;
    }

    return _restaurantData as HorusRestaurantEnchanted;
  };

  // Mutate userData as soon as they sign in.
  useEffect(() => {
    if (!token) {
      return;
    }

    mutate(() => fetchRestaurantData(token));
  }, [token]);

  return (
    <AuthContext.Provider value={{ restaurantUser, restaurantData, token }}>
      {children}
    </AuthContext.Provider>
  );
}
