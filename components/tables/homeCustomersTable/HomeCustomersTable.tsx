/* eslint-disable react/display-name */
import { Table, Tooltip } from '@tastiest-io/tastiest-ui';
import {
  Booking,
  Horus,
  titleCase,
  useHorusSWR,
} from '@tastiest-io/tastiest-utils';
import { AuthContext } from 'contexts/auth';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { BookingDateCell } from './BookingDateCell';
import { HasArrivedCell } from './HasArrivedCell';
import { HasCancelledCell } from './HasCancelledCell';

enum EditableBookingFields {
  HAS_ARRIVED = 'hasArrived',
  HAS_CANCELLED = 'hasCancelled',
  BOOKED_FOR_TIMESTAMP = 'bookedForTimestamp',
}

// Update any field in the current booking
// instantly using mutate SWR
async function setBookingField<T>(
  field: EditableBookingFields,
  value: T,
  bookings: Booking[],
  token: string,
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

  const horus = new Horus(token);
  const { data } = await horus.post('/bookings/update', {
    bookingId: booking.orderId,
    [field]: value,
  });

  if (!data) {
    return;
  }
}

interface Props {
  restaurantId: string;
}

export default function HomeCustomersTable(props: Props) {
  const { restaurantId } = props;

  const { restaurantUser: user } = useContext(AuthContext);
  // Set token as soon as it's available.
  const [token, setToken] = useState(null);
  useEffect(() => {
    user?.getIdToken().then(setToken);
  }, [user]);

  const { data: bookings, mutate } = useHorusSWR<Booking[]>(
    `/bookings?restaurantId=${restaurantId}`,
    user,
    {
      refreshInterval: 30000,
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
      accessor: (row: Booking) => {
        return (
          <div className="flex items-center font-medium">
            {row.isUserFollowing ? (
              <Tooltip
                content={`${
                  row.eaterName.split(' ')[0]
                } was following you when they made this booking.`}
              >
                <div className="flex items-center justify-center bg-alt-1 bg-opacity-75 rounded-full h-5 w-5 text-white mr-1 cursor-pointer">
                  F
                </div>
              </Tooltip>
            ) : null}
            {row.eaterName}{' '}
          </div>
        );
      },
      minWidth: 200,
    },
    {
      id: 'dealName',
      Header: 'Experience',
      accessor: (row: Booking) => {
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
      Header: 'Covers',
      accessor: (row: Booking) => <p>{row.heads}</p>,
    },
    {
      id: 'orderTotal',
      Header: 'Order Total',
      accessor: (row: Booking) => (
        <p className="font-medium">
          £{Number(row.restaurantCut?.amount ?? 0)?.toFixed(2)}
        </p>
      ),
    },
    {
      Header: 'Booking Date',
      accessor: 'bookingDate',
      Cell: BookingDateCell,
    },

    {
      id: 'purchased',
      Header: 'Purchased',
      accessor: (row: Booking) => {
        return <p>{moment(row.paidAt).local().fromNow()}</p>;
      },
    },
    {
      Header: 'Cancelled',
      accessor: 'hasCancelled',
      Cell: HasCancelledCell,
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
      setBookingField(columnId, value, bookings, token, rowIndex);

      const booking = bookings[rowIndex];
      const updatedBookings = bookings.map((row, index) =>
        index === rowIndex
          ? {
              ...booking,
              [columnId]: value,
            }
          : row,
      );

      mutate(updatedBookings, false);
    },
    [bookings],
  );

  const searchFunction = (query: string, data: Booking[]) => {
    return data.filter(booking => {
      return (
        booking.dealName.toLowerCase().includes(query.toLowerCase()) ||
        booking.eaterName.toLowerCase().includes(query.toLowerCase())
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
        paginateInterval={10}
      />
    </div>
  );
}
