import { ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select } from '@tastiest-io/tastiest-ui';
import {
  dlog,
  EmailTemplate,
  IRestaurantData,
} from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import EmailsTable from 'components/tables/EmailsTable';
import * as dateFns from 'date-fns';
import { DefaultAuthPageProps } from 'layouts/LayoutDefault';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { GetEmailTemplateReturn } from 'pages/api/getEmailTemplates';
import React, { useContext, useMemo, useState } from 'react';
import { DatePicker } from 'rsuite';
import useSWR from 'swr';
import { LocalEndpoint } from 'types/api';
import { METADATA } from '../../constants';
import { ScreenContext } from '../../contexts/screen';

const Followers: NextPage<DefaultAuthPageProps> = props => {
  const { restaurantId, restaurantData } = props;

  const { isDesktop } = useContext(ScreenContext);
  const [isBoosting, setIsBoosting] = useState(false);

  dlog('times ➡️ restaurantId:', props.restaurantId);
  dlog('times ➡️ props.restaurantData:', props.restaurantData);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const templates: EmailTemplate[] = Object.entries(
    restaurantData?.email?.templates ?? {},
  ).map(([id, template]) => ({ id, ...template }));

  return (
    <>
      <Head>
        <title>Followers - {METADATA.TITLE_SUFFIX}</title>
      </Head>

      <div className="flex flex-col space-y-10">
        <div className="flex justify-between">
          <h3 className="text-2xl leading-none font-medium text-primary">
            Notify Followers
          </h3>

          <Button onClick={() => setIsScheduleModalOpen(true)}>
            Schedule email
          </Button>
        </div>

        <div className="text-justify pb-6">
          Notifying your followers about changes in your menu or ... <br />{' '}
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit,
          minima recusandae sequi delectus mollitia ab odit repellat cumque nisi
          repudiandae dignissimos quod animi dolorum accusantium? In enim
          facilis delectus quaerat molestiae fuga modi numquam possimus, minus
          culpa, perspiciatis repudiandae ratione sapiente rerum tempore quia
          veniam earum quidem soluta deleniti voluptatibus.
        </div>

        <div className="bg-green-100 bg-opacity-50 px-4 py-3 rounded-lg border-b-2 mb-6">
          <p className="pb-2 text-base">
            In order to notify your followers, you must first create an email
            template.
          </p>

          <div className="flex space-x-2">
            <Link href="/followers/templates/new">
              <a className="no-underline">
                <Button>Create template</Button>
              </a>
            </Link>

            <div className="filter drop-shadow">
              <Link href="/followers/templates">
                <a className="no-underline">
                  <Button color="light">View templates</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <EmailsTable />
        </div>

        <ScheduleEmailModal
          restaurantData={restaurantData}
          initialTemplates={templates}
          show={isScheduleModalOpen}
          close={() => setIsScheduleModalOpen(false)}
        />
      </div>
    </>
  );
};

interface ScheduleEmailModalProps {
  restaurantData: Partial<IRestaurantData>;
  initialTemplates: EmailTemplate[];
  show: boolean;
  close: () => void;
}

const ScheduleEmailModal = (props: ScheduleEmailModalProps) => {
  const { show, close, restaurantData, initialTemplates: initialData } = props;
  const [selected, setSelected] = useState(null);

  const { details } = restaurantData;

  const { data: templates } = useSWR<GetEmailTemplateReturn>(
    `${LocalEndpoint.GET_EMAIL_TEMPLATES}?restaurantId=${details.id}`,
    {
      initialData,
      refreshInterval: 30000,
      refreshWhenHidden: true,
    },
  );

  /** The scedule is valid IF
   *  1. It doesn't violate the rule of one email scheduled per week.
   *  2. The template is approved.
   *  3. It is not scheduled more than 30 days in advance.
   */
  const isValid = useMemo(() => {
    return templates.length > 0;
  }, [templates]);

  const hasTemplates = useMemo(() => {
    return templates.length > 0;
  }, [templates]);

  dlog('index ➡️ hasTemplates:', hasTemplates);
  dlog('index ➡️ templates:', templates);

  const [subject, setSubject] = useState('');
  const subjectSuffix = ' - Tastiest';

  return (
    <Modal title="Schedule Email" show={show} close={close}>
      <div style={{ minWidth: '25rem' }} className="flex flex-col space-y-6">
        {hasTemplates ? (
          <>
            <div className="">
              To schedule an email, choose a template which has been approved.
            </div>

            <Select onSelect={setSelected}>
              {templates.map(template => {
                return (
                  <Select.Option
                    id={template.id}
                    key={template.id}
                    value={`${template.name}${
                      template.isApproved ? '' : ' (unapproved)'
                    }`}
                    disabled={!template.isApproved}
                  />
                );
              })}
            </Select>

            <div>
              <Input
                label="Subject"
                value={subject}
                onValueChange={setSubject}
                maxLength={33}
              />
              <span
                className={clsx(
                  'text-base pt-4',
                  subject?.length ? '' : 'italic opacity-50',
                )}
              >
                {subject?.length
                  ? subject + subjectSuffix
                  : `Check out ${details.name}'s new menu! ${subjectSuffix}`}
              </span>
            </div>

            <div className="">
              <DatePicker
                disabled={!hasTemplates}
                placeholder="Schedule for"
                format="yyyy MM-dd HH:mm"
                style={{ width: '100%' }}
                ranges={[]}
                disabledDate={date => dateFns.isBefore(date, new Date())}
                hideHours={hour => hour < 4 || hour > 24}
              />
            </div>

            {/* <div className="text-base">
              <Toggle /> Notify me when it goes live
            </div> */}

            <div className="flex space-x-3 justify-end">
              {/* <Button
                color="primary"
                disabled={true}
                onClick={() => null}
                prefix={<PictureOutlined />}
              >
                Preview
              </Button> */}

              <Button disabled={!isValid} prefix={<ClockCircleOutlined />}>
                Schedule
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mt-2 bg-gray-100 px-4 py-2 rounded-md">
              <InfoCircleOutlined className="text-lg text-yellow-500" />

              <div>
                You don't have any email templates.
                <br />
                <Link href={'/followers/templates/new'}>
                  <a className="font-medium text-primary">Create a new one?</a>
                </Link>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={close}>Cancel</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default Followers;
