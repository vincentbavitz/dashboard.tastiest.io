/* eslint-disable react/display-name */
import { Table, Tooltip } from '@tastiest-io/tastiest-ui';
import {
  Booking,
  Horus,
  TIME,
  titleCase,
  useHorusSWR,
} from '@tastiest-io/tastiest-utils';
import { AuthContext } from 'contexts/auth';
import { DateTime } from 'luxon';
import moment from 'moment';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  const { token } = useContext(AuthContext);

  const { data, mutate } = useHorusSWR<Booking[]>(
    `/bookings?restaurantId=${restaurantId}`,
    token,
    {
      refreshInterval: 30000,
      initialData: null,
      refreshWhenHidden: true,
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    },
  );

  const bookings = useMemo(
    () =>
      // prettier-ignore
      data
        ?.filter(booking => !booking.isTest === (process.env.NODE_ENV === 'development'))
        .sort((a, b) => b.bookedForTimestamp - a.bookedForTimestamp),
    [data],
  );

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (bookings) {
      setIsInitialLoading(false);
    }
  }, [bookings]);

  const todayMidnightTimestamp = DateTime.now()
    .setLocale(TIME.LOCALES.LONDON)
    .set({ hour: 0, minute: 0, second: 0 })
    .toMillis();

  const columns = [
    {
      id: 'eaterName',
      Header: 'Name',
      accessor: (row: Booking) => {
        const rowIsToday =
          row.bookedForTimestamp >
            todayMidnightTimestamp - 3 * TIME.MS_IN_ONE_DAY &&
          row.bookedForTimestamp < todayMidnightTimestamp + TIME.MS_IN_ONE_DAY;

        return (
          <div className="flex flex-col justify-center font-medium">
            <span>{row.eaterName}</span>

            {row.isUserFollowing || rowIsToday ? (
              <div className="flex space-x-2">
                {rowIsToday ? (
                  <span
                    style={{ width: 'fit-content' }}
                    className="px-2 rounded text-sm bg-blue-100"
                  >
                    Today
                  </span>
                ) : null}

                {row.isUserFollowing ? (
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
      accessor: 'hasArrived',
      Cell: HasArrivedCell,
      width: 90,
    },
    {
      Header: 'Cancelled',
      accessor: 'hasCancelled',
      Cell: HasCancelledCell,
      width: 90,
    },
    {
      Header: 'Booking Date',
      accessor: 'bookedForTimestamp',
      Cell: BookingDateCell,
    },
    {
      id: 'dealName',
      Header: 'Experience',
      minWidth: 200,
      accessor: (row: Booking) => {
        const maxExperienceNameLength = 35;
        const exceedsLimit = row.dealName.length > maxExperienceNameLength;

        return (
          <Tooltip
            show={exceedsLimit ? undefined : false}
            content={row.dealName}
          >
            <p className="whitespace-pre-wrap">
              {titleCase(row.dealName).slice(0, maxExperienceNameLength)}
              {exceedsLimit && '...'}
            </p>
          </Tooltip>
        );
      },
    },
    {
      id: 'heads',
      Header: 'Covers',
      width: 80,
      accessor: (row: Booking) => <p>{row.heads}</p>,
    },
    {
      id: 'orderTotal',
      Header: 'Order Total',
      width: 100,
      accessor: (row: Booking) => (
        <p className="font-medium">
          £{Number(row.restaurantCut?.amount ?? 0)?.toFixed(2)}
        </p>
      ),
    },
    {
      id: 'purchased',
      Header: 'Purchased',
      sortBy: 'paidAt',
      accessor: (row: Booking) => {
        return <p>{moment(row.paidAt).local().fromNow()}</p>;
      },
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
