import { LoadingOutlined } from '@ant-design/icons';
import { HorusRestaurantEnchanted } from 'contexts/auth';
import firebaseApp from 'firebase/app';
import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { LayoutProps } from './LayoutHandler';
import LayoutWrapper from './LayoutWrapper';

interface LayoutDefaultProps extends LayoutProps {
  children: any;
}

export interface DefaultAuthPageProps {
  restaurantUser: firebaseApp.User;
  restaurantData: HorusRestaurantEnchanted;
}

export default function LayoutDefault({
  router,
  pageProps,
  children: Component,
}: LayoutDefaultProps) {
  const { restaurantUser, restaurantData } = useAuth();
  const restaurantId = restaurantUser?.uid;

  if (!restaurantId) {
    return null;
  }

  return (
    <LayoutWrapper router={router} pageProps={pageProps}>
      <div
        style={{ minWidth: '400px' }}
        className="absolute inset-0 flex h-full px-8 py-6 overflow-auto bg-gray-100"
      >
        {restaurantData ? (
          <div style={{ height: 'max-content' }} className="w-full">
            <Component
              {...pageProps}
              restaurantUser={restaurantUser}
              restaurantData={restaurantData}
            />
          </div>
        ) : (
          <div className="flex w-full h-full items-center justify-center">
            <LoadingOutlined className="-mt-20 text-5xl text-primary" />
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
