/* eslint-disable react/display-name */
import {
  HorusBooking,
  HorusOrder,
  HorusRestaurant,
  HorusUser,
} from '@tastiest-io/tastiest-horus';
import { Table } from '@tastiest-io/tastiest-ui';
import { dlog, Horus, TIME, useHorusSWR } from '@tastiest-io/tastiest-utils';
import { AuthContext } from 'contexts/auth';
import { DateTime } from 'luxon';
import moment from 'moment';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BookingDateCell } from './BookingDateCell';
import { HasArrivedCell } from './HasArrivedCell';
import { HasCancelledCell } from './HasCancelledCell';

enum EditableBookingFields {
  HAS_ARRIVED = 'has_arrived',
  HAS_CANCELLED = 'has_cancelled',
  BOOKED_FOR_TIMESTAMP = 'booked_for_timestamp',
}

export type HorusBookingEnchanted = HorusBooking & {
  user?: HorusUser;
  order?: HorusOrder;
  restaurant?: HorusRestaurant;
};

// Update any field in the current booking
// instantly using mutate SWR
async function setBookingField<T>(
  field: EditableBookingFields,
  value: T,
  bookings: HorusBookingEnchanted[],
  token: string,
  rowIndex: number,
) {
  const booking = bookings[rowIndex];
  if (!booking) {
    console.log('Booking not found');
    return;
  }

  dlog('HomeCustomersTable ➡️ booking:', booking);

  // Can't modify a cancelled booking
  if (booking.has_cancelled) {
    console.log("Can't modify a cancelled booking");
    return;
  }

  const horus = new Horus(token);
  const { data } = await horus.post('/bookings/update', {
    booking_id: booking.id,
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
  const { token } = useContext(AuthContext);

  const { data, mutate, isValidating } = useHorusSWR<HorusBookingEnchanted[]>(
    '/bookings/',
    {
      token,
      query: { restaurant_id: restaurantId },
    },
    {
      refreshInterval: 10000,
      initialData: null,
      refreshWhenHidden: true,
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    },
  );

  const bookings = useMemo(
    () =>
      // prettier-ignore
      data
        ?.filter(booking => booking.is_test === (process.env.NODE_ENV === 'development'))
        .sort((a, b) => new Date(b.booked_for).getTime() - new Date(a.booked_for).getTime()),
    [data],
  );

  console.log('HomeCustomersTable ➡️ bookings:', bookings);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (bookings || !isValidating) {
      setIsInitialLoading(false);
    }
  }, [bookings]);

  const todayMidnightTimestamp = DateTime.now()
    .setLocale(TIME.LOCALES.LONDON)
    .set({ hour: 0, minute: 0, second: 0 })
    .toMillis();

  const columns = [
    {
      id: 'eater-name',
      Header: 'Name',
      accessor: (row: HorusBookingEnchanted) => {
        const rowTimestamp = new Date(row.booked_for).getTime();

        const rowIsToday =
          rowTimestamp > todayMidnightTimestamp - 3 * TIME.MS_IN_ONE_DAY &&
          rowTimestamp < todayMidnightTimestamp + TIME.MS_IN_ONE_DAY;

        return (
          <div className="flex flex-col justify-center font-medium">
            <span>
              {row.user.first_name} {row.user.last_name}
            </span>

            {row.order.is_user_following || rowIsToday ? (
              <div className="flex space-x-2">
                {rowIsToday ? (
                  <span
                    style={{ width: 'fit-content' }}
                    className="px-2 rounded text-sm bg-blue-100"
                  >
                    Today
                  </span>
                ) : null}

                {row.order.is_user_following ? (
                  <span
                    style={{ width: 'fit-content' }}
                    className="px-2 rounded text-sm bg-green-100"
                  >
                    Follower
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      },
      minWidth: 150,
    },
    {
      Header: 'Arrived',
      accessor: 'has_arrived',
      Cell: HasArrivedCell,
      width: 90,
    },
    {
      Header: 'Cancelled',
      accessor: 'has_cancelled',
      Cell: HasCancelledCell,
      width: 90,
    },
    {
      Header: 'Booking Date',
      accessor: 'booked_for_timestamp',
      Cell: BookingDateCell,
    },
    {
      id: 'productName',
      Header: 'Experience',
      minWidth: 200,
      accessor: (row: HorusBookingEnchanted) => {
        return <p className="whitespace-pre-wrap">{row.order.product_name}</p>;
      },
    },
    {
      id: 'heads',
      Header: 'Covers',
      width: 80,
      accessor: (row: HorusBookingEnchanted) => <p>{row.order.heads}</p>,
    },
    {
      id: 'total',
      Header: 'Order Total',
      width: 100,
      accessor: (row: HorusBookingEnchanted) => (
        <p className="font-medium">
          £{Number(row.order.restaurant_portion ?? 0)?.toFixed(2)}
        </p>
      ),
    },
    {
      id: 'purchased',
      Header: 'Purchased',
      sortBy: 'paid_at',
      accessor: (row: HorusBookingEnchanted) => {
        return <p>{moment(row.order.paid_at).local().fromNow()}</p>;
      },
    },
  ];

  // Update data depending on the column
  const updateData = React.useMemo(
    () => (value: any, rowIndex: number, columnId: EditableBookingFields) => {
      console.log(
        `HomeCustomersTable ➡️ Updating '${columnId}' field on booking to ${value}`,
      );
      console.log('HomeCustomersTable ➡️ columnId:', columnId);
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

  const searchFunction = (query: string, data: HorusBookingEnchanted[]) => {
    return data.filter(booking => {
      return (
        booking.order.product_name
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        booking.user.first_name.toLowerCase().includes(query.toLowerCase())
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
