import { Dropdown, DropdownItem } from '@tastiest-io/tastiest-components';
import { LogoIcon } from '@tastiest-io/tastiest-icons';
import { titleCase } from '@tastiest-io/tastiest-utils';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import { useRestaurantData } from 'hooks/useRestaurantData';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

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
      <div
        className={classNames(
          'relative flex justify-center items-center rounded-full cursor-pointer duration-300 bg-opacity-75 hover:bg-opacity-100',
          !url && 'bg-primary',
          `h-${size} w-${size}`,
        )}
      >
        <div
          className="flex items-center justify-center w-full h-full"
          onClick={onAvatarClick}
        >
          {url ? (
            // Custom Avatar Image
            <img
              style={{ filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.20))' }}
              className="object-cover w-full h-full rounded-full"
              src={`${url}?w=50`}
              alt={'Profile picture'}
            />
          ) : initial?.length ? (
            <div className="flex items-center justify-center w-full h-full text-xl text-white font-somatic">
              {initial[0]}
            </div>
          ) : (
            // Default Tastiest Avatar
            <LogoIcon className="h-4 text-white fill-current" />
          )}
        </div>
      </div>

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
