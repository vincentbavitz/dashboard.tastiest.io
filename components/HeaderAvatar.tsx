import { DownOutlined, ExportOutlined } from '@ant-design/icons';
import { Avatar, AvatarProps, Dropdown } from '@tastiest-io/tastiest-ui';
import { titleCase } from '@tastiest-io/tastiest-utils';
import { useAuth } from 'hooks/useAuth';
import React from 'react';

export function HeaderAvatar(props: Pick<AvatarProps, 'size'>) {
  const { size = 8 } = props;

  const { restaurantUser, restaurantData, isSignedIn, signOut } = useAuth();

  const displayName = titleCase(restaurantData?.name);
  const initial = displayName?.[0];

  const url = restaurantData?.profile?.profile_picture?.url ?? null;

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <div className="flex cursor-pointer items-center space-x-2 text-gray-800">
          <Avatar initial={initial ?? 'T'} imageSrc={url} size={size} />

          <p>{restaurantData?.name}</p>
          <DownOutlined className="text-xs text-gray-400" />
        </div>
      </Dropdown.Trigger>

      {/* <Dropdown.Item icon={<SettingOutlined />} href={'/settings'}>
        Preferences
      </Dropdown.Item> */}

      {/* <Dropdown.Divider /> */}

      <Dropdown.Item
        icon={<ExportOutlined />}
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </Dropdown.Item>
    </Dropdown>
  );
}
