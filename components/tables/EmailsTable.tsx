import { Table } from '@tastiest-io/tastiest-ui';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import React from 'react';

export default function EmailsTable() {
  const emails = [];

  const columns = [
    {
      id: 'subject',
      Header: 'Subject',
      accessor: (row: any) => {
        return <p className="font-medium">{row.subject}</p>;
      },
    },
    {
      id: 'conversion',
      Header: 'Conversion %',
      accessor: (row: any) => {
        return <p className="font-medium">33%</p>;
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
