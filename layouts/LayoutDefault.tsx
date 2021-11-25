import { LoadingOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import { GetRestaurantDataReturn } from 'pages/api/getRestaurantData';
import React from 'react';
import useSWR from 'swr';
import { LocalEndpoint } from 'types/api';
import { LayoutProps } from './LayoutHandler';
import LayoutWrapper from './LayoutWrapper';

interface LayoutDefaultProps extends LayoutProps {
  children: any;
}

export type DefaultAuthPageProps = {
  restaurantData: GetRestaurantDataReturn;
  restaurantUser: firebase.default.User;
};

export default function LayoutDefault({
  router,
  pageProps,
  children: Component,
}: LayoutDefaultProps) {
  const { restaurantUser } = useAuth();
  const restaurantId = restaurantUser?.uid;

  // Give all children restaurnatData in the props
  const swrURL = restaurantId
    ? `${LocalEndpoint.GET_RESTAURANT_DATA}?restaurantId=${restaurantId}`
    : null;

  const { data: restaurantData } = useSWR<GetRestaurantDataReturn[]>(swrURL, {
    refreshInterval: 30000,
    initialData: null,
    refreshWhenHidden: true,
    compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });

  return (
    <LayoutWrapper router={router} pageProps={pageProps}>
      <div
        style={{ minWidth: '700px' }}
        className="absolute inset-0 flex h-full px-8 py-6 overflow-auto bg-gray-100"
      >
        {restaurantData ? (
          <div style={{ height: 'max-content' }} className="w-full">
            <Component
              {...pageProps}
              restaurantData={restaurantData}
              restaurantUser={restaurantUser}
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
