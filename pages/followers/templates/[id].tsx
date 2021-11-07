import { EditOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from '@tastiest-io/tastiest-components';
import {
  dlog,
  postFetch,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import { Layouts } from 'layouts/LayoutHandler';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import { SaveEmailTemplateParams } from 'pages/api/saveEmailTemplate';
import React, { useContext, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import { LocalEndpoint } from 'types/api';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../../../constants';
import { ScreenContext } from '../../../contexts/screen';

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

  return {
    props: {
      templateId: context.params.id,
      restaurantId,
      restaurantData,
    },
  };
};

const NewTemplate = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { templateId, restaurantId } = props;

  const { isDesktop } = useContext(ScreenContext);
  const [isBoosting, setIsBoosting] = useState(false);

  dlog('times ➡️ restaurantId:', props.restaurantId);
  dlog('times ➡️ props.restaurantData:', props.restaurantData);

  dlog('[id] ➡️ templateId:', templateId);

  const emailEditorRef = useRef(null);
  const containerId = 'email-template-container';
  const [templateName, setTemplateName] = useState('New template');

  const saveTemplate = async () => {
    // Get html from the Email builder
    emailEditorRef.current.editor.exportHtml(async data => {
      const { design, html } = data;

      await postFetch<SaveEmailTemplateParams>(
        LocalEndpoint.SAVE_EMAIL_TEMPLATE,
        {
          id: templateId,
          name: templateName,
          restaurantId,
          design,
          html,
        },
      );
    });
  };

  return (
    <>
      <Head>
        <title>New Template - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center pb-4 pt-4 px-6">
          <div className="flex items-center space-x-2 text-lg leading-none font-medium">
            <span>{templateName} </span>{' '}
            <EditOutlined className="text-xl duration-300 opacity-50 hover:opacity-100" />
          </div>

          <Button color="light" onClick={saveTemplate}>
            Save <RightOutlined />
          </Button>
        </div>

        <div className="relative flex-grow overflow-auto">
          <div className="absolute inset-0">
            <div id={containerId} className="relative h-full"></div>
          </div>
        </div>
      </div>

      <EmailEditor
        ref={emailEditorRef}
        editorId={containerId}
        minHeight="100%"
        appearance={{
          panels: {
            tools: {
              collapsible: true,
            },
          },
        }}
      />
    </>
  );
};

NewTemplate.layout = Layouts.EMAIL_TEMPLATE;
export default NewTemplate;
