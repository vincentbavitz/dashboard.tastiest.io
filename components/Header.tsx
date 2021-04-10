import { Input } from '@tastiest-io/tastiest-components';
import { BrandIcon, SearchIcon } from '@tastiest-io/tastiest-icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { HeaderAvatar } from './HeaderAvatar';

interface HeaderProps {
  blank?: boolean;
}

export default function Header({ blank }: HeaderProps) {
  const [query, setQuery] = useState<string>();

  const search = () => {
    return null;
  };

  return (
    <div className="flex items-center w-full px-6 py-4 space-between">
      <div className="flex items-center flex-grow space-x-6">
        <Link href="/">
          <a>
            <BrandIcon className="w-40" />
          </a>
        </Link>

        {!blank && (
          <div style={{ maxWidth: '300px' }} className="flex-grow">
            <Input
              size="small"
              color="neutral"
              value={query}
              onValueChange={setQuery}
              suffix={
                <SearchIcon
                  className="h-8 text-gray-400 fill-current"
                  onClick={search}
                />
              }
            />
          </div>
        )}
      </div>

      {!blank && <HeaderAvatar />}
    </div>
  );
}
