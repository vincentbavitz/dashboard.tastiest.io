import {
  EditOutlined,
  RightOutlined,
  RollbackOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Input } from '@tastiest-io/tastiest-ui';
import {
  dlog,
  postFetch,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import { Layouts } from 'layouts/LayoutHandler';
import lodash from 'lodash';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import nookies from 'nookies';
import { SaveEmailTemplateParams } from 'pages/api/saveEmailTemplate';
import React, { useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
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

  // Attempt to fetch the design
  const restaurantData = await restaurantDataApi.getRestaurantData();

  const templateId = context.params.id;
  const template = restaurantData.email?.templates?.[templateId] ?? null;

  return {
    props: {
      template,
      templateId,
      restaurantId,
      restaurantData,
    },
  };
};

const Template = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { template, templateId, restaurantData, restaurantId } = props;

  dlog('[id] ➡️ templateId:', templateId);
  dlog('[id] ➡️ template:', template);

  const emailEditorRef = useRef(null);
  const containerId = 'email-template-container';
  const [templateName, setTemplateName] = useState(
    template?.name ?? 'New template',
  );

  // Template name editing
  const [isEditingTemplateName, setIsEditingTemplateName] = useState(false);
  const [editedTemplateName, setEditedTemplateName] = useState(templateName);

  const [saving, setSaving] = useState(false);

  const saveTemplate = async () => {
    // setState is internally async, so we have to explicitly get the name
    const name = isEditingTemplateName ? editedTemplateName : templateName;
    saveTemplateName();
    setSaving(true);

    // Get html from the Email builder
    emailEditorRef.current.editor.exportHtml(async data => {
      dlog(
        '[id] ➡️ emailEditorRef.current.editor:',
        emailEditorRef.current.editor,
      );

      const { design, html } = data;

      await postFetch<SaveEmailTemplateParams>(
        LocalEndpoint.SAVE_EMAIL_TEMPLATE,
        {
          id: templateId,
          restaurantId,
          name,
          design,
          html,
        },
      );

      setSaving(false);
    });

    window.analytics.track('Restaurant Saved Email Template', {
      userId: restaurantId,
      properties: {
        name,
        template,
        restaurantDetails: lodash.omit(restaurantData.details, [
          'description',
          'video',
          'meta',
        ]),
      },
    });
  };

  const saveTemplateName = () => {
    setIsEditingTemplateName(false);
    setTemplateName(editedTemplateName);
  };

  /** Load pre-existing template if it exists */
  const onLoad = () => {
    if (template) {
      emailEditorRef.current?.editor.loadDesign(template.design);
    }
  };

  return (
    <>
      <Head>
        <title>
          {templateName} - {METADATA.TITLE_SUFFIX}
        </title>
      </Head>

      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center pb-4 pt-4 px-6">
          <div className="flex items-center space-x-2 text-lg leading-none font-medium">
            {isEditingTemplateName ? (
              <div className="w-64">
                <Input
                  value={templateName}
                  onValueChange={setEditedTemplateName}
                  className="!bg-transparent !border-secondary !border-opacity-50 border"
                  suffix={
                    <SaveOutlined
                      onClick={saveTemplateName}
                      className="text-xl duration-300 cursor-pointer"
                    />
                  }
                />
              </div>
            ) : (
              <>
                <span>{templateName} </span>{' '}
                <EditOutlined
                  onClick={() => setIsEditingTemplateName(true)}
                  className="text-xl duration-300 opacity-50 hover:opacity-100"
                />
              </>
            )}
          </div>

          <div className="flex space-x-4">
            <Link href="/followers/templates">
              <a>
                <Button
                  color="light"
                  prefix={<RollbackOutlined />}
                  onClick={saveTemplate}
                >
                  Back
                </Button>
              </a>
            </Link>

            <Button
              onClick={saveTemplate}
              suffix={<RightOutlined />}
              loading={saving}
            >
              Save
            </Button>
          </div>
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
        onLoad={onLoad}
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

Template.layout = Layouts.EMAIL_TEMPLATE;
export default Template;
