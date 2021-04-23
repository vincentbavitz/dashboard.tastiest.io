/* eslint-disable react/display-name */
import { CheckFilledIcon, ExitFilledIcon } from '@tastiest-io/tastiest-icons';
import { dlog, IBooking } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import DatePicker from 'components/DatePicker';
import Table from 'components/Table';
import moment from 'moment';
import React from 'react';
import useSWR from 'swr';
import { LocalEndpoint } from 'types/api';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
}: {
  value: number;
  row: any[] | any;
  column: any;
  updateData: any;
}) => {
  // We need to keep and update the state of the cell normally
  const [date, setDate] = React.useState(new Date(initialValue));

  const onChange = (value: Date) => {
    setDate(value);
    updateData(value, index, id);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setDate(new Date(initialValue));
  }, [initialValue]);

  return (
    <div className="flex items-center justify-center">
      <DatePicker date={date} onChange={onChange} />
    </div>
  );
};

interface Props {
  restaurantId: string;
}

export default function HomeCustomersTable(props: Props) {
  const { restaurantId } = props;
  const { data: bookings, mutate } = useSWR<IBooking[]>(
    `${LocalEndpoint.GET_BOOKINGS}?restaurantId=${restaurantId}`,
    { refreshInterval: 5000, initialData: [] },
  );

  const setBookingDate = (value, rowIndex, columnId) => {
    console.log('CALLED');

    dlog('HomeCustomersTable ➡️ value:', value);
    dlog('HomeCustomersTable ➡️ rowIndex:', rowIndex);
    dlog('HomeCustomersTable ➡️ columnId:', columnId);

    const newData = bookings.map((row, index) =>
      index === rowIndex
        ? {
            ...bookings[rowIndex],
            bookingDate: 0,
          }
        : row,
    );

    mutate(newData, false);
  };

  const columns = [
    {
      Header: 'Name',
      accessor: 'eaterName',
    },
    {
      Header: 'Deal',
      accessor: 'dealName',
    },
    {
      Header: 'Heads',
      accessor: 'heads',
    },
    {
      Header: 'Order Total',
      accessor: (row: IBooking) => {
        return `£${row.price.final.toFixed(2)}`;
      },
    },
    {
      id: 'paidAt',
      Header: 'Purchased',
      accessor: (row: IBooking) => {
        return moment(row.paidAt).local().fromNow();
      },
    },
    {
      Header: 'Cancelled',
      accessor: (row: IBooking) => {
        return (
          <div className="flex items-center justify-center">
            <ExitFilledIcon
              className={clsx(
                'fill-current w-8 cursor-pointer',
                row.hasCancelled ? 'text-primary' : 'text-gray-300',
              )}
            />
          </div>
        );
      },
    },
    {
      Header: 'Booking Date',
      accessor: 'bookingDate',
      Cell: EditableCell,
    },
    {
      Header: 'Arrived',
      accessor: (row: IBooking) => {
        return (
          <div className="flex items-center justify-center">
            <CheckFilledIcon
              className={clsx(
                'fill-current w-8 cursor-pointer',
                row.hasArrived ? 'text-primary' : 'text-gray-300',
              )}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        label="Customers"
        columns={columns}
        data={bookings}
        noDataLabel="No customers yet."
        updateData={setBookingDate}
      />
    </div>
  );
}
