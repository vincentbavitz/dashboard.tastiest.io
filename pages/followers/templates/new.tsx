import { verifyCookieToken } from 'utils/firebaseAdmin';
import { v4 as uuid } from 'uuid';

/** This page exists purely as a redirect to /[id] to generate new IDs with each request */
export const getServerSideProps = async context => {
  const { valid, redirect } = await verifyCookieToken(context);
  if (!valid) return { redirect };

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
