import { IBooking } from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import DatePicker from 'components/DatePicker';
import React from 'react';

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
  const booking: IBooking = original;

  // We need to keep and update the state of the cell normally
  const [date, setDate] = React.useState(
    initialValue ? new Date(initialValue) : undefined,
  );

  const onChange = (value: Date) => {
    setDate(value);
    updateData(value.getTime(), index, id);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setDate(initialValue ? new Date(initialValue) : undefined);
  }, [initialValue]);

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        booking.hasCancelled && 'opacity-30',
      )}
    >
      <DatePicker
        date={date}
        onChange={onChange}
        openToDate={new Date()}
        disabled={booking.hasCancelled}
      />
    </div>
  );
};
