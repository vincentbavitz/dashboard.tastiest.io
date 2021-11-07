import { Email } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import Table from 'components/Table';
import { DateTime } from 'luxon';
import React from 'react';

export default function EmailsTable() {
  const emails: Email[] = [
    {
      id: '3471234987124183646198723',
      subject: 'Testing Email Subject',
      template: '2408bae7-97f0-4dab-a400-908c771b5c75',
      to: ['vincent@bavitz.org', 'xvrain@protonmail.com'],
      from: 'restaurants@mail.tastiest.io',
      body: 'test email body!!',
      isSent: false,
      sentAt: null,
      scheduledFor: 12873687213,
    },
    {
      id: '3471234987124183646198723',
      subject: 'Testing Email Subject',
      template: '2408bae7-97f0-4dab-a400-908c771b5c75',
      to: ['vincent@bavitz.org', 'xvrain@protonmail.com'],
      from: 'restaurants@mail.tastiest.io',
      body: 'test email body!!',
      isSent: true,
      sentAt: 234234897987,
      scheduledFor: 12873687213,
    },
  ];

  const columns = [
    {
      id: 'subject',
      Header: 'Subject',
      accessor: (row: any) => {
        return <p className="font-medium">{row.subject}</p>;
      },
    },
    {
      id: 'isSent',
      Header: 'Status',
      accessor: (row: any) => {
        const format = 'h:mm a - dd MMM';

        const scheduledFor = row.scheduledFor
          ? DateTime.fromMillis(row.scheduledFor).toFormat(format)
          : null;

        const sentAt = row.sentAt
          ? DateTime.fromMillis(row.sentAt).toFormat(format)
          : null;

        return (
          <div className="flex flex-col items-center space-y-1">
            <span
              className={clsx(
                'font-medium text-xs text-light py-px px-3 rounded-full',
                row.isSent ? 'bg-success' : 'bg-secondary',
              )}
            >
              {row.isSent ? 'Sent' : 'Scheduled'}
            </span>

            <span className="text-xs opacity-75">
              {row.isSent ? sentAt : scheduledFor}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      label="Emails"
      columns={columns}
      data={emails ?? []}
      noDataLabel="No emails yet."
    />
  );
}
