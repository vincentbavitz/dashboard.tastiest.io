import { PlusOutlined } from '@ant-design/icons';
import { EmailTemplate, postFetch } from '@tastiest-io/tastiest-utils';
import { EmailTemplateCard } from 'components/EmailTemplateCard';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { DeleteEmailTemplateParams } from 'pages/api/deleteEmailTemplate';
import { GetEmailTemplateReturn } from 'pages/api/getEmailTemplates';
import React from 'react';
import useSWR from 'swr';
import { LocalEndpoint } from 'types/api';
import { METADATA } from '../../../constants';

const Templates: NextPage<DefaultAuthPageProps> = props => {
  const { restaurantId, restaurantData } = props;

  const templatesRaw: EmailTemplate[] = Object.entries(
    restaurantData?.email?.templates ?? {},
  ).map(([id, template]) => ({ id, ...template }));

  const { data, mutate } = useSWR<GetEmailTemplateReturn>(
    `${LocalEndpoint.GET_EMAIL_TEMPLATES}?restaurantId=${restaurantId}`,
    {
      initialData: templatesRaw,
      refreshInterval: 30000,
      refreshWhenHidden: true,
    },
  );

  const templates = data.sort((a, b) => a.editedAt - b.editedAt);

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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
