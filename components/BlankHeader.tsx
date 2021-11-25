import { TastiestBrand } from '@tastiest-io/tastiest-ui';
import Link from 'next/link';
import React from 'react';

export default function BlankHeader() {
  return (
    <div className="flex items-center w-full px-6 py-4 space-between">
      <div className="flex items-center flex-grow space-x-6">
        <Link href="/">
          <a>
            <TastiestBrand type="full" size={10} />
          </a>
        </Link>
      </div>
    </div>
  );
}
