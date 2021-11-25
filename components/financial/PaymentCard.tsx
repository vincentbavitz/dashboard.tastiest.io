import { DeleteOutlined } from '@ant-design/icons';
import { VisaIcon } from '@tastiest-io/tastiest-icons';
import { CardBrand } from '@tastiest-io/tastiest-utils';
import React from 'react';

interface Props {
  brand: CardBrand | null;
  last4: string;
  name: string;
  expiry: { month: string; year: string };
}

export default function PaymentCard(props: Props) {
  const { brand, last4, name, expiry } = props;

  return (
    <div className="relative w-full">
      <div className="">
        <div
          style={{ borderRadius: '1rem' }}
          className="aspect-w-8 aspect-h-5 bg-blue-900"
        >
          <div
            style={{ paddingTop: '6%', paddingLeft: '8%', paddingRight: '8%' }}
            className=""
          >
            <div className="flex justify-end">
              {brand === CardBrand.VISA && (
                <VisaIcon style={{ width: '16%' }} className="" />
              )}
            </div>

            {/* Chip */}
            <div style={{ width: '20%', paddingTop: '4%' }}>
              <div className="aspect-w-6 aspect-h-5">
                <div className="bg-gray-400 h-full rounded-lg"></div>
              </div>
            </div>

            {/* Numbers */}
            <div
              style={{ gap: '4.5%', paddingTop: '5%' }}
              className="w-full grid  filter drop-shadow-sm grid-rows-1 grid-cols-4 items-center leading-none"
            >
              <div className="text-light tracking-wider">
                <svg className="w-full" viewBox="0 0 29 10">
                  <text x="0" y="14" fill="#fafafa">
                    ****
                  </text>
                </svg>
              </div>
              <div className="text-light tracking-wider">
                <svg className="w-full" viewBox="0 0 29 10">
                  <text x="0" y="14" fill="#fafafa">
                    ****
                  </text>
                </svg>
              </div>
              <div className="text-light tracking-wider">
                <svg className="w-full" viewBox="0 0 29 10">
                  <text x="0" y="14" fill="#fafafa">
                    ****
                  </text>
                </svg>
              </div>

              <div className="text-light tracking-widest">
                <svg className="w-full" viewBox="0 0 46 18">
                  <text x="4" y="15" fill="#fafafa">
                    {last4}
                  </text>
                </svg>
              </div>

              <div
                style={{ fontSize: '1.7rem', letterSpacing: '0.0rem' }}
                className="text-light font-mono"
              ></div>
            </div>

            <div
              style={{
                left: '8%',
                right: '8%',
                bottom: '6%',
              }}
              className="flex absolute bottom-0 justify-between items-center"
            >
              {/* Cardholder Name */}

              <div
                style={{ height: '8%' }}
                className="font-mono relative text-white"
              >
                <svg className="h-full w-full" viewBox="0 0 200 24">
                  <text x="0" y="16" fill="#fafafa">
                    {name.toUpperCase()}
                  </text>
                </svg>
              </div>

              {/* Expiry */}
              <div
                style={{ height: '6%', width: '20%' }}
                className="font-mono filter drop-shadow-sm tracking-wide text-xl text-white"
              >
                <svg className="h-full w-full" viewBox="0 0 60 20">
                  <text x="0" y="16" fill="#fafafa">
                    {expiry.month}/{expiry.year}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Is Primary? */}
      <div className="absolute -bottom-8 right-2 flex justify-end items-center space-x-2">
        <div className="justify-center flex leading-relaxed rounded-full items-center text-sm w-20 bg-green-300">
          Primary
        </div>

        <DeleteOutlined className="cursor-pointer text-red-500 text-xl mb-1" />
      </div>
    </div>
  );
}
