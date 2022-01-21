import { CalendarOutlined } from '@ant-design/icons';
import { Button, Modal } from '@tastiest-io/tastiest-ui';
import { Booking } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import { AuthContext } from 'contexts/auth';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { DatePicker } from 'rsuite';

export const BookingDateCell = ({
  value: initialValue,
  row: { index, original },
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
}: {
  value: number | null;
  row: any[] | any;
  column: any;
  updateData: any;
}) => {
  const { restaurantUser: user } = useContext(AuthContext);
  const booking: Booking = original;
  const [token, setToken] = useState(null);

  const [showDateModal, setShowDateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editedDate, setEditedDate] = useState<Date | null>(null);
  const [bookingDate, setBookingDate] = useState(
    new Date(booking.bookedForTimestamp),
  );

  // Set token as soon as it's available.
  useEffect(() => {
    user?.getIdToken().then(setToken);
  }, [user]);

  const setNewBookingDate = async (value: Date) => {
    if (!token) {
      return;
    }

    setSubmitting(true);
    await updateData(value.getTime(), index, 'bookedForTimestamp');

    setSubmitting(false);
    setBookingDate(value);
    closeDateModal();
  };

  const closeDateModal = () => {
    setEditedDate(null);
    setShowDateModal(false);
  };

  const ranges = [
    {
      label: 'Now',
      value: new Date(),
    },
  ];

  return (
    <div className="flex items-center space-x-2">
      <p className="opacity-75">
        {DateTime.fromMillis(original.bookedForTimestamp).toFormat('h:mm a')}
        <br />
        {DateTime.fromMillis(original.bookedForTimestamp).toFormat(
          'dd LLL yyyy',
        )}
      </p>

      {booking.hasArrived || booking.hasCancelled ? null : (
        <CalendarOutlined
          onClick={() => setShowDateModal(true)}
          className="text-lg text-primary hover:text-secondary duration-300 cursor-pointer"
        />
      )}

      <Modal
        title="Update booking date"
        show={showDateModal}
        close={closeDateModal}
      >
        <div
          style={{ minWidth: '400px' }}
          className="flex items-center justify-between space-x-2 text-base border-b mb-2"
        >
          <h4 className="font-medium text-primary">Current Booking Date</h4>

          <span>
            {DateTime.fromMillis(original.bookedForTimestamp).toFormat(
              'h:mm a dd LLL yyyy',
            )}
          </span>
        </div>

        <div className="border-b pb-4">
          <p className="pt-2 mb-2 text-base">
            Please enter the new date and time of the booking.
          </p>
          <DatePicker
            format="dd MMM yy hh:mm aa"
            ranges={ranges}
            disabled={booking.hasCancelled}
            disabledDate={date =>
              DateTime.fromJSDate(date).year < DateTime.now().year ||
              DateTime.fromJSDate(date).ordinal < DateTime.now().ordinal
            }
            onChange={setEditedDate}
            defaultValue={bookingDate}
            placeholder={'Booking date'}
            showMeridian
          />
        </div>

        <div
          style={{ minWidth: '400px' }}
          className={clsx(
            'flex items-center justify-between space-x-2 text-base mt-4',
            editedDate ? 'opacity-100' : 'opacity-50',
          )}
        >
          <h4 className="">
            New booking date set for <br />
            {editedDate ? (
              <span className="font-medium">
                {DateTime.fromJSDate(editedDate).toFormat('h:mm a - DDDD')}
              </span>
            ) : (
              <div className="w-64 h-7 bg-gray-100"></div>
            )}
          </h4>
        </div>

        <p className="text-yellow-800 mt-4 bg-yellow-200 bg-opacity-25 rounded-lg px-4 py-2 shadow-md">
          Please note that modifying the booking date or time will notify the
          customer by email.{' '}
        </p>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            disabled={!editedDate}
            onClick={() => setNewBookingDate(editedDate)}
          >
            Confirm
          </Button>
          <Button color="light" onClick={closeDateModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
