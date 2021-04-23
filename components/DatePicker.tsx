import { CalendarIcon } from '@tastiest-io/tastiest-icons';
import clsx from 'clsx';
import moment from 'moment';
import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  date?: Date;
  onChange: (value: Date) => void;
}

export default function DatePicker(props: Props) {
  const { onChange } = props;

  const [date, setDate] = useState(new Date());

  return (
    <div className="">
      <ReactDatePicker
        selected={date}
        onChange={(_date: Date) => props.onChange(_date)}
        popperPlacement={'bottom-end'}
        customInput={
          date ? (
            <p className="font-medium">{moment(date).format('DD/M/YY')}</p>
          ) : (
            <CalendarIcon
              className={clsx(
                'fill-current w-8 cursor-pointer',
                'text-gray-300',
              )}
            />
          )
        }
      />
    </div>
  );
}
