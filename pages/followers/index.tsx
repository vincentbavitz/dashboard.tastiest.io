import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Select } from '@tastiest-io/tastiest-components';
import {
  dlog,
  EmailTemplate,
  IRestaurantData,
  RestaurantDataApi,
} from '@tastiest-io/tastiest-utils';
import { Modal } from 'components/Modal';
import EmailsTable from 'components/tables/EmailsTable';
import dateFns from 'date-fns';
import lodash from 'lodash';
import { NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import { GetEmailTemplateReturn } from 'pages/api/getEmailTemplates';
import React, { useContext, useMemo, useState } from 'react';
import { DatePicker } from 'rsuite';
import useSWR from 'swr';
import { LocalEndpoint } from 'types/api';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { METADATA } from '../../constants';
import { ScreenContext } from '../../contexts/screen';

interface Props {
  restaurantId: string;
  restaurantData: IRestaurantData;
}

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
      restaurantId,
      restaurantData,
    },
  };
};

const Followers: NextPage<Props> = props => {
  const { restaurantId, restaurantData } = props;

  const { isDesktop } = useContext(ScreenContext);
  const [isBoosting, setIsBoosting] = useState(false);

  dlog('times ➡️ restaurantId:', props.restaurantId);
  dlog('times ➡️ props.restaurantData:', props.restaurantData);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

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

          <Button color="light" onClick={() => setIsScheduleModalOpen(true)}>
            Schedule Email
          </Button>
        </div>

        <div className="text-justify pb-6 border-b ">
          Notifying your followers about changes in your menu or ... <br />{' '}
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit,
          minima recusandae sequi delectus mollitia ab odit repellat cumque nisi
          repudiandae dignissimos quod animi dolorum accusantium? In enim
          facilis delectus quaerat molestiae fuga modi numquam possimus, minus
          culpa, perspiciatis repudiandae ratione sapiente rerum tempore quia
          veniam earum quidem soluta deleniti voluptatibus.
        </div>

        <div>
          <EmailsTable />
        </div>

        <ScheduleEmailModal
          restaurantId={restaurantId}
          initialTemplates={restaurantData.email?.templates ?? {}}
          isOpen={isScheduleModalOpen}
          close={() => setIsScheduleModalOpen(false)}
        />
      </div>
    </>
  );
};

interface ScheduleEmailModalProps {
  restaurantId: string;
  initialTemplates: { [key: string]: EmailTemplate };
  isOpen: boolean;
  close: () => void;
}

const ScheduleEmailModal = (props: ScheduleEmailModalProps) => {
  const { isOpen, close, restaurantId, initialTemplates: initialData } = props;
  const [selected, setSelected] = useState(null);

  const { data: templates } = useSWR<GetEmailTemplateReturn>(
    `${LocalEndpoint.GET_EMAIL_TEMPLATES}?restaurantId=${restaurantId}`,
    {
      initialData,
      refreshInterval: 30000,
      refreshWhenHidden: true,
    },
  );

  const approvedTemplates = useMemo(
    () => lodash.filter(templates, template => template.isApproved),
    [templates],
  );

  /** The scedule is valid IF
   *  1. It doesn't violate the rule of one email scheduled per week.
   *  2. The template is approved.
   *  3. It is not scheduled more than 30 days in advance.
   */
  const isValid = useMemo(() => {
    return approvedTemplates.length > 0;
  }, [templates]);

  return (
    <Modal
      id="schedule-email-modal"
      title="Schedule Email"
      isOpen={isOpen}
      close={close}
    >
      <div style={{ minWidth: '25rem' }} className="flex flex-col space-y-6">
        <div className="">
          To schedule an email, choose a template which has been
        </div>

        {approvedTemplates.length === 0 ? (
          <></>
        ) : (
          <Select
            label="Template (approved only)"
            onChange={setSelected}
            noDefault={true}
          >
            {Object.entries(approvedTemplates).map(([id, template]) => {
              return (
                <option key={id} value={id} selected={selected === id}>
                  {template.name}
                </option>
              );
            })}
          </Select>
        )}

        <div className="">
          <div id="datepicker-container" className="bg-blue-200 ">
            <DatePicker
              placeholder="Schedule for"
              format="YYYY MM-DD HH:mm"
              showTime={{ format: 'HH:mm' }}
              style={{ width: 260 }}
              showToday={false}
              ranges={[]}
              disabledDate={date => dateFns.isBefore(date, new Date())}
              hideHours={hour => hour < 6 || hour > 18}
            />
          </div>
        </div>

        <div className="flex space-x-3 justify-end">
          <Button color="light" onClick={close}>
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            color="secondary"
            prefix={<ClockCircleOutlined />}
          >
            Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Followers;
