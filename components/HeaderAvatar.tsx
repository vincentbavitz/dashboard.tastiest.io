import { Dropdown, DropdownItem } from '@tastiest-io/tastiest-components';
import { titleCase } from '@tastiest-io/tastiest-utils';
import { useAuth } from 'hooks/useAuth';
import { useRestaurantData } from 'hooks/useRestaurantData';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Avatar } from './Avatar';

interface IProfileDropdownItems {
  id: string;
  name: string;
  isSelected?: boolean;
  onClick: () => void;
}

export interface AvatarProps {
  // Size is in the same units as Tailwind units
  size?: 8 | 10 | 12 | 16 | 20;
}

export function HeaderAvatar(props: AvatarProps) {
  const { size = '8' } = props;

  const { restaurantUser, isSignedIn, signOut } = useAuth();
  const { restaurantData } = useRestaurantData(restaurantUser);

  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const displayName = titleCase(restaurantData?.details?.name);
  const initial = displayName?.[0];

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [router.pathname]);

  const dropdownItems: Array<IProfileDropdownItems> = [
    {
      id: 'support',
      name: 'Support',
      onClick: () => router.push('/support'),
      isSelected: false,
    },
  ];

  const onAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const url = restaurantData?.details?.profilePicture?.url ?? null;

  return (
    <div>
      <Avatar initial={restaurantData?.details?.name[0] ?? 'T'} />

      <Dropdown
        isOpen={isDropdownOpen}
        style="outline"
        onClickAway={() => setIsDropdownOpen(false)}
        pull="left"
      >
        <p className="pb-1 pl-4 pr-6 mb-1 text-sm text-gray-900 border-b border-gray-200">
          Welcome back, {displayName}
        </p>
        {dropdownItems.map(item => (
          <DropdownItem
            style="outline"
            key={item.id}
            id={item.id}
            onSelect={item.onClick}
            selected={item.isSelected}
          >
            {item.name}
          </DropdownItem>
        ))}

        <div className="pt-1 border-t border-gray-200">
          <DropdownItem
            style="outline"
            id={'sign-out'}
            onSelect={() => {
              signOut();
              setIsDropdownOpen(false);
            }}
            selected={false}
          >
            Sign Out
          </DropdownItem>
        </div>
      </Dropdown>
    </div>
  );
}
