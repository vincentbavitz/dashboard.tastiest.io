import Table from 'components/Table';
import React from 'react';

export default function HomeCustomersTable() {
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
        accessor: 'orderTotal',
      },
      {
        Header: 'Date of Purchase',
        accessor: 'paidAt',
      },
      {
        Header: 'Cancelled',
        accessor: 'hasCancelled',
      },
      {
        Header: 'Booking Date',
        accessor: 'bookingFor',
      },
      {
        Header: 'Eaten',
        accessor: 'hasEaten',
      },
    ],
    [],
  );

  const data = React.useMemo(
    () => [
      {
        eaterName: 'Kathleen Simoneau',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasBooked: false,
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Dino Woerner',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Justa Stice',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Lee Hemmer',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Mindy Hoehn',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Ilda Langone',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Ressie Raines',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Eusebio Wiser',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Cori Osburn',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Selene Chupp',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Neta Gruber',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Harriette Price',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Wynell Covin',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Galina Escalera',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Nelida Swanner',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Clarice Almada',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Shandi Swan',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Lilliam Brockwell',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Carlyn Linen',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Ching Gentile',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Queen Winans',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Dalia Knobel',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Sheridan Kolstad',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Suzy Crossley',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Rodrick Flippen',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Kareem Carnegie',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Susann Resch',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Orlando Brinks',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
      {
        eaterName: 'Cathy Mccloud',
        dealName: 'Krusky Krab',
        heads: Math.ceil(Math.random() * 10),
        orderTotal: 33,
        paidAt: Date.now(),
        bookingFor: Date.now(),
        hasEaten: Boolean(Math.round(Math.random())),
      },
    ],
    [],
  );

  return (
    <div>
      <Table
        label="Customers"
        columns={columns}
        data={[]}
        noDataLabel="No customers yet."
      />
    </div>
  );
}
