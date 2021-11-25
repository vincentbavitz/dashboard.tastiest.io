import { PlusOutlined } from '@ant-design/icons';
import {
  EmailTemplate,
  postFetch,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import { EmailTemplateCard } from 'components/EmailTemplateCard';
import { InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import nookies from 'nookies';
import { DeleteEmailTemplateParams } from 'pages/api/deleteEmailTemplate';
import { GetEmailTemplateReturn } from 'pages/api/getEmailTemplates';
import React from 'react';
import useSWR from 'swr';
import { LocalEndpoint } from 'types/api';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../../../constants';

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

  const restaurantData = await restaurantDataApi.getRestaurantData();

  const templates: EmailTemplate[] = Object.entries(
    restaurantData?.email?.templates ?? {},
  ).map(([id, template]) => ({ id, ...template }));

  return {
    props: {
      restaurantId,
      restaurantData,
      templates,
    },
  };
};

const Templates: NextPage<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = props => {
  const { restaurantId } = props;

  const { data: templates, mutate } = useSWR<GetEmailTemplateReturn>(
    `${LocalEndpoint.GET_EMAIL_TEMPLATES}?restaurantId=${restaurantId}`,
    {
      initialData: props.templates,
      refreshInterval: 30000,
      refreshWhenHidden: true,
    },
  );

  const onClickDeleteTemplate = async (id: string) => {
    await postFetch<DeleteEmailTemplateParams>(
      LocalEndpoint.DELETE_EMAIL_TEMPLATE,
      {
        id,
        restaurantId,
      },
    );

    mutate(
      templates.filter(t => t.id !== id),
      false,
    );
  };

  return (
    <>
      <Head>
        <title>Templates - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div className="flex flex-col space-y-10">
        <div>
          <h4 className="text-2xl leading-none pb-4 font-medium">
            My Templates
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <NewTemplateCard />

            {templates.map(template => {
              return (
                <EmailTemplateCard
                  key={template.id}
                  id={template.id}
                  template={template}
                  restaurantId={restaurantId}
                  onClickDelete={onClickDeleteTemplate}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const NewTemplateCard = () => {
  return (
    <Link href="/followers/templates/new">
      <a>
        <div className="relative w-full cursor-pointer">
          <div
            style={{ minHeight: '12rem' }}
            className="flex justify-center items-center relative bg-light shadow-lg filter duration-300 text-gray-400 hover:text-gray-500 rounded-lg"
          >
            <div className="flex items-center space-x-1">
              <PlusOutlined className="text-4xl" />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Templates;
