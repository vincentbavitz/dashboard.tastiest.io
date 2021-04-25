/* eslint-disable react/display-name */
import { ExitFilledIcon } from '@tastiest-io/tastiest-icons';
import { IBooking, postFetch } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import Table from 'components/Table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { LocalEndpoint } from 'types/api';
import { BookingDateCell } from './BookingDateCell';
import { HasArrivedCell } from './HasArrivedCell';

enum EditableBookingFields {
  BOOKING_DATE = 'bookingDate',
  HAS_ARRIVED = 'hasArrived',
  HAS_CANCELLED = 'hasCancelled',
}

// Update any field in the current booking
// instantly using mutate SWR
async function setBookingField<T>(
  field: EditableBookingFields,
  value: T,
  bookings: IBooking[],
  rowIndex: number,
) {
  const booking = bookings[rowIndex];
  if (!booking) {
    console.log('Booking not found');
    return;
  }

  const updatedBookings = bookings.map((row, index) =>
    index === rowIndex
      ? {
          ...booking,
          [field]: value,
        }
      : row,
  );

  // Update booking server side
  await postFetch<any, IBooking>(LocalEndpoint.UPDATE_BOOKING, {
    bookingId: booking.orderId,
    [field]: value,
  });

  mutate(
    `${LocalEndpoint.GET_BOOKINGS}?restaurantId=${booking.restaurantId}`,
    updatedBookings,
    false,
  );
}

interface Props {
  restaurantId: string;
}

export default function HomeCustomersTable(props: Props) {
  const { restaurantId } = props;
  const { data: bookings } = useSWR<IBooking[]>(
    `${LocalEndpoint.GET_BOOKINGS}?restaurantId=${restaurantId}`,
    { refreshInterval: 5000, initialData: [] },
  );

  // Loading initial data
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading && bookings.length) {
      setLoading(false);
    }
  }, [bookings]);

  const columns = React.useMemo(
    () => [
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
        Cell: BookingDateCell,
      },
      {
        Header: 'Arrived',
        accessor: 'hasArrived',
        Cell: HasArrivedCell,
      },
    ],
    [bookings],
  );

  // Update data depending on the column
  const updateData = React.useMemo(
    () => (value: any, rowIndex: number, columnId: EditableBookingFields) => {
      console.log(`Updating '${columnId}' field on booking to ${value}`);
      setBookingField(columnId, value, bookings, rowIndex);
    },
    [bookings],
  );

  return (
    <div>
      <Table
        label="Customers"
        columns={columns}
        data={bookings}
        noDataLabel="No customers yet."
        updateData={updateData}
        isLoadingInitialData={loading}
      />
    </div>
  );
}
