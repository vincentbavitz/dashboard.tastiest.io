import { RollbackOutlined } from '@ant-design/icons';
import { Button, Input, TextArea } from '@tastiest-io/tastiest-ui';
import PageHeader from 'components/PageHeader';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { dlog } from 'utils/development';
import { verifyCookieToken } from 'utils/firebaseAdmin';
import { METADATA } from '../../constants';

type SupportFormData = {
  subject: string;
  message: string;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { valid, redirect } = await verifyCookieToken(context);
  if (!valid) return { redirect };
  return { props: {} };
};

const NewSupportTicket: NextPage<DefaultAuthPageProps> = ({
  restaurantData,
}) => {
  const router = useRouter();

  // FIX ME CORRECT ME
  // const { supportRequests, makeSupportRequest } = useSupport();
  const supportRequests = [];
  const makeSupportRequest = (a: string, b: string, c: string) => ({
    success: true,
    data: { id: a, b, c },
  });

  const [submitting, setSubmitting] = useState(false);

  // const { user } = useAuth();
  // const { userData } = useUserData(user);

  dlog('support ➡️ supportRequests:', supportRequests);

  const submit = async (form: SupportFormData) => {
    setSubmitting(true);

    const { success, data } = await makeSupportRequest(
      restaurantData.contact_first_name,
      form.subject,
      form.message,
    );

    if (success) {
      setSubmitting(false);
      router.push(`/support/${data.id}`);
    }
  };

  // Pre-fetch the [ticket] page
  useEffect(() => {
    router.prefetch('/support/[ticket]');
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SupportFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
    shouldFocusError: true,
  });

  const {
    field: { ref: subjectFieldRef, ...subjectFieldProps },
  } = useController({
    name: 'subject',
    defaultValue: '',
    control,
    rules: {
      required: {
        value: true,
        message: 'Please enter a subject',
      },
      maxLength: {
        value: 60,
        message: 'Please keep your subject concise.',
      },
    },
  });

  const {
    field: { ref: messageFieldRef, ...messageFieldProps },
  } = useController({
    name: 'message',
    defaultValue: '',
    control,
    rules: {
      required: {
        value: true,
        message: 'Please enter a message',
      },
      maxLength: {
        value: 2000,
        message: 'Please keep your message under 2000 characters.',
      },
    },
  });

  return (
    <>
      <Head>
        <title>Support - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <PageHeader label="Open New Support Ticket">
        <Link href="/support">
          <a className="no-underline">
            <Button color="light" prefix={<RollbackOutlined />}>
              Back
            </Button>
          </a>
        </Link>
      </PageHeader>

      <div className="flex items-center">
        <div
          style={{ maxWidth: '500px' }}
          className="flex flex-col w-full mt-10 space-y-4"
        >
          <Input
            ref={subjectFieldRef}
            label="Subject"
            size="large"
            error={errors.subject?.message ?? null}
            {...subjectFieldProps}
          />

          <TextArea
            ref={messageFieldRef}
            label="Message"
            size="large"
            rows={10}
            // error={errors.message?.message ?? null}
            {...messageFieldProps}
          />

          <Button
            wide
            size="large"
            loading={submitting}
            onClick={handleSubmit(submit)}
          >
            Open Ticket
          </Button>
        </div>
      </div>
    </>
  );
};

export default NewSupportTicket;
