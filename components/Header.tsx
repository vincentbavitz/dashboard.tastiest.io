import BrandSVG from '@svg/brand.svg';
import SearchSVG from '@svg/search.svg';
import { Input } from '@tastiest-io/tastiest-components';
import React, { useState } from 'react';
import { HeaderAvatar } from './HeaderAvatar';

export default function Header() {
  const [query, setQuery] = useState<string>();

  const search = () => {
    return null;
  };

  return (
    <div className="flex items-center w-full px-6 py-4 space-between">
      <div className="flex items-center flex-grow space-x-6">
        <BrandSVG className="w-40" />

        <div style={{ maxWidth: '300px' }} className="flex-grow">
          <Input
            size="small"
            color="neutral"
            value={query}
            onValueChange={setQuery}
            suffix={
              <SearchSVG
                className="h-8 text-gray-400 fill-current"
                onClick={search}
              />
            }
          />
        </div>
      </div>

      <HeaderAvatar />
    </div>
  );
}
