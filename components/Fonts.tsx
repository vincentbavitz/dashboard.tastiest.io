import React, { FC } from 'react';

/** To be placed inside `next/head` component only. */
const Fonts: FC = () => {
  return (
    <>
      {/* Add Optimized Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin={'true'}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Marmelad&family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700;1,900&display=swap"
        rel="stylesheet"
      />
    </>
  );
};

export default Fonts;
