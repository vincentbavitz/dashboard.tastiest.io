import { RestaurantDataApi } from '@tastiest-io/tastiest-utils';
import nookies from 'nookies';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { v4 as uuid } from 'uuid';

/** This page exists purely as a redirect to /[id] to generate new IDs with each request */
export const getServerSideProps = async context => {
  // Get user ID from cookie.
  const cookieToken = nookies.get(context)?.token;
  const restaurantDataApi = new RestaurantDataApi(firebaseAdmin);
  const { restaurantId } = await restaurantDataApi.initFromCookieToken(
    cookieToken,
  );

  // If no user, redirect to login
  if (!restaurantId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const newTemplateId = uuid();

  return {
    redirect: {
      destination: `/followers/templates/${newTemplateId}`,
      permanent: false,
    },
  };
};

const NewTemplateRedirect = () => <></>;
export default NewTemplateRedirect;
