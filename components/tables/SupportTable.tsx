import { StatusOrb, Table } from '@tastiest-io/tastiest-ui';
import { RestaurantSupportRequest } from '@tastiest-io/tastiest-utils';
import { DateTime } from 'luxon';
import Link from 'next/link';
import React from 'react';

interface Props {
  supportRequests: Partial<RestaurantSupportRequest>[];
}

export default function SupportTable(props: Props) {
  const { supportRequests } = props;

  const columns = [
    {
      id: 'subject',
      Header: 'Subject',
      accessor: (row: Partial<RestaurantSupportRequest>) => {
        return (
          <Link href={`/support/${row.id}`}>
            <a className="font-medium">{row.subject}</a>
          </Link>
        );
      },
    },
    {
      id: 'conversion',
      Header: 'Last Reply',
      accessor: (row: Partial<RestaurantSupportRequest>) => {
        return (
          <span className="font-medium">
            {row.conversation.length
              ? DateTime.fromMillis(
                  row.conversation[row.conversation.length - 1].timestamp,
                ).toRelative({
                  style: 'short',
                })
              : ''}
          </span>
        );
      },
    },
    {
      id: 'status',
      Header: 'Status',
      accessor: (row: Partial<RestaurantSupportRequest>) => {
        return (
          <p className="font-medium">
            {row.resolved ? (
              <div>
                <StatusOrb status="online" /> Resolved
              </div>
            ) : (
              <div>
                <StatusOrb status="warning" /> Open
              </div>
            )}
          </p>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={supportRequests ?? []}
      leftAlignedColumns={[0, 1, 2]}
      noDataLabel="You have no support tickets."
    />
  );
}
