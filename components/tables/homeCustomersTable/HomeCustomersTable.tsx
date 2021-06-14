/* eslint-disable react/display-name */
import { IBooking, postFetch, titleCase } from '@tastiest-io/tastiest-utils';
import Table from 'components/Table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { LocalEndpoint } from 'types/api';
import { BookingDateCell } from './BookingDateCell';
import { HasArrivedCell } from './HasArrivedCell';
import { HasCancelledCell } from './HasCancelledCell';

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

  // Can't modify a cancelled booking
  if (booking.hasCancelled) {
    console.log("Can't modify a cancelled booking");
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
    {
      refreshInterval: 5000,
      initialData: null,
      refreshWhenHidden: true,
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    },
  );

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (bookings) {
      setIsInitialLoading(false);
    }
  }, [bookings]);

  const columns = [
    {
      id: 'eaterName',
      Header: 'Name',
      accessor: (row: IBooking) => {
        return <p className="font-medium">{row.eaterName}</p>;
      },
    },
    {
      id: 'dealName',
      Header: 'Deal',
      accessor: (row: IBooking) => {
        const maxDealNameLength = 25;
        return (
          <p>
            {titleCase(row.dealName).slice(0, maxDealNameLength)}
            {row.dealName.length > maxDealNameLength && '...'}
          </p>
        );
      },
    },
    {
      id: 'heads',
      Header: 'Heads',
      accessor: (row: IBooking) => <p>{row.heads}</p>,
    },
    {
      id: 'orderTotal',
      Header: 'Order Total',
      accessor: (row: IBooking) => (
        <p className="font-medium">
          £{Number(row.price?.final * 0.75)?.toFixed(2)}
        </p>
      ),
    },
    {
      id: 'paidAt',
      Header: 'Purchased',
      accessor: (row: IBooking) => {
        return <p>{moment(row.paidAt).local().fromNow()}</p>;
      },
    },
    {
      Header: 'Cancelled',
      accessor: 'hasCancelled',
      Cell: HasCancelledCell,
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
  ];

  // Update data depending on the column
  const updateData = React.useMemo(
    () => (value: any, rowIndex: number, columnId: EditableBookingFields) => {
      console.log(`Updating '${columnId}' field on booking to ${value}`);
      setBookingField(columnId, value, bookings, rowIndex);
    },
    [bookings],
  );

  const searchFunction = (query: string, data: IBooking[]) => {
    return data.filter(booking => {
      return (
        booking.dealName.toLowerCase().includes(query) ||
        booking.eaterName.toLowerCase().includes(query)
      );
    });
  };

  return (
    <div>
      <Table
        label="Customers"
        columns={columns}
        data={bookings ?? []}
        noDataLabel="No customers yet."
        updateData={updateData}
        searchFunction={searchFunction}
        isLoadingInitialData={isInitialLoading}
      />
    </div>
  );
}
