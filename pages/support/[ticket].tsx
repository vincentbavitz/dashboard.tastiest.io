import { RollbackOutlined } from '@ant-design/icons';
import { Button, TextArea, Tooltip } from '@tastiest-io/tastiest-ui';
import {
  Horus,
  RestaurantSupportRequest,
  SupportMessage,
  SupportMessageDirection,
  useHorusSWR,
} from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import PageHeader from 'components/PageHeader';
import { AuthContext } from 'contexts/auth';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { DateTime } from 'luxon';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { verifyCookieToken } from 'utils/firebaseAdmin';
import { METADATA } from '../../constants';

type TicketFormData = {
  message: string;
};

const MESSAGE_CHARACTER_LIMIT = 2000;

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { valid, redirect, cookieToken } = await verifyCookieToken(context);
  if (!valid) return { redirect };

  const ticketId = String(context.params.ticket);

  if (!ticketId) {
    return {
      props: {},
      redirect: {
        destination: '/support',
        permanent: false,
      },
    };
  }

  const horus = new Horus(cookieToken);
  const { data: ticket } = await horus.get<any, RestaurantSupportRequest>(
    `/support/restaurants/ticket/${ticketId}`,
  );

  if (!ticket) {
    return {
      props: {},
      redirect: {
        destination: '/support',
        permanent: false,
      },
    };
  }

  return { props: { ticket } };
};

const Ticket: NextPage<
  DefaultAuthPageProps & InferGetServerSidePropsType<typeof getServerSideProps>
> = props => {
  const [token, setToken] = useState<string | null>(null);
  const { restaurantUser: user } = useContext(AuthContext);

  // Set token as soon as it's available.
  useEffect(() => {
    user.getIdToken().then(setToken);
  }, [user]);

  const horus = useMemo(() => (token ? new Horus(token) : null), [token]);

  const { data: ticket, mutate } = useHorusSWR<RestaurantSupportRequest>(
    `/support/restaurants/ticket/${props.ticket.id}`,
    user,
    {
      initialData: props.ticket,
      refreshInterval: 120000,
    },
  );

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TicketFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
    shouldFocusError: true,
  });

  const formData = watch();

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
        value: MESSAGE_CHARACTER_LIMIT,
        message: `Please keep your message under ${MESSAGE_CHARACTER_LIMIT} characters.`,
      },
    },
  });

  const reply = async ({ message }: TicketFormData) => {
    const { data: replyData } = await horus?.post<any, SupportMessage>(
      '/support/restaurants/reply',
      {
        id: ticket.id,
        name: ticket.name,
        message,
      },
    );

    mutate(
      { ...ticket, conversation: [...ticket.conversation, replyData] },
      true,
    );
  };

  return (
    <>
      <Head>
        <title>Support - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <PageHeader
        label={ticket.subject}
        subLabel={`Opened at ${DateTime.fromMillis(ticket.createdAt).toFormat(
          'hh:mm DDDD',
        )}`}
      >
        <Link href="/support">
          <a className="no-underline">
            <Button color="light" prefix={<RollbackOutlined />}>
              Back
            </Button>
          </a>
        </Link>
      </PageHeader>

      <Tooltip
        trigger="manual"
        placement="top-start"
        content={errors.message?.message}
        show={Boolean(errors.message?.message)}
      >
        <div className="h-px w-full"></div>
      </Tooltip>

      <div className="flex flex-col gap-4 mb-10">
        <TextArea
          ref={messageFieldRef}
          placeholder="Reply..."
          rows={5}
          size="large"
          maxLength={MESSAGE_CHARACTER_LIMIT}
          {...messageFieldProps}
        />

        <div className="flex justify-between items-start">
          <Button
            size="large"
            onClick={handleSubmit(reply)}
            disabled={!formData.message?.length}
          >
            Post reply
          </Button>

          <div className="py-1 px-2 rounded-md text-2xs bg-gray-200">
            {formData?.message?.length ?? 0} / {MESSAGE_CHARACTER_LIMIT}
          </div>
        </div>
      </div>

      <h4 className="text-2xl font-medium mb-4">Ticket Messges</h4>
      <div className="flex flex-col space-y-4">
        {ticket.conversation.map((message, key) => {
          return <SupportMessageBlock key={key} {...message} />;
        })}
      </div>
    </>
  );
};

const SupportMessageBlock = (message: SupportMessage) => {
  return (
    <div
      className={clsx(
        'w-full rounded bg-white p-4 border border-l-4',
        message.direction === SupportMessageDirection.SUPPORT_TO_RESTAURANT
          ? 'border-green-600'
          : 'border-secondary',
      )}
    >
      <div className="flex justify-between">
        <div className="font-medium">
          {message.name}{' '}
          {message.direction ===
          SupportMessageDirection.SUPPORT_TO_RESTAURANT ? (
            <span className="py-1 px-2 ml-1 bg-green-600 rounded text-white text-2xs">
              Tastiest Team
            </span>
          ) : null}
        </div>

        <div className="text-xs tracking-wide opacity-75">
          {DateTime.fromMillis(message?.timestamp ?? 0).toFormat('hh:mm D')}
        </div>
      </div>

      <div className="py-3">
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default Ticket;
