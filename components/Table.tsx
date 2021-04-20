import { TriangleIcon } from '@tastiest-io/tastiest-icons';
import clsx from 'clsx';
import { isUndefined } from 'lodash';
import React from 'react';
import { useSortBy, useTable } from 'react-table';
import { v4 as uuid } from 'uuid';

interface TableProps {
  label?: string;
  columns: any[];
  data: any[];

  noDataLabel?: string;
}

export type TableColumn = {
  // Required by react-table
  Header: string;
  accessor: string;

  // Additional
  bold?: boolean;
}[];

export default function Table(props: TableProps) {
  const { columns, data, label, noDataLabel } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      data,
      columns,
    },
    useSortBy,
  );

  console.log('Table ➡️ getTableProps:', getTableProps());
  console.log('Table ➡️ headerGroups:', headerGroups);
  console.log('Table ➡️ rows:', rows);

  const leftAlignedColumns = [0];

  return (
    <div>
      {label && <p className="mb-2 text-lg font-somatic">{label}</p>}
      <div
        style={{ maxWidth: '100%' }}
        className="w-full px-6 pb-6 overflow-x-auto bg-white rounded-xl"
      >
        {data.length > 0 && (
          <table
            // style={{ width: 'max-content' }}
            className="w-full"
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map(headerGroup => (
                <tr key={uuid()} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, i) => (
                    <th
                      key={uuid()}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={clsx(
                        !isUndefined(leftAlignedColumns.find(n => n === i)) &&
                          'text-left',
                        'py-4 text-sm text-gray-600 font-normal select-none',
                      )}
                    >
                      <div className="flex items-center pr-2">
                        {column.render('Header')}
                        <span>
                          {column.isSorted ? (
                            <TriangleIcon
                              className={clsx(
                                'h-2 ml-2 duration-150 transform fill-current text-gray-400',
                                column.isSortedDesc
                                  ? 'rotate-90'
                                  : '-rotate-90',
                              )}
                            />
                          ) : (
                            ''
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                i;
                prepareRow(row);
                return (
                  <tr
                    key={uuid()}
                    {...row.getRowProps()}
                    className="border-t border-gray-300"
                  >
                    {row.cells.map((cell, j) => {
                      return (
                        <td
                          key={uuid()}
                          {...cell.getCellProps()}
                          className={clsx(j !== 0 && 'text-center')}
                        >
                          <div className="py-2 pr-2">{cell.render('Cell')}</div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!data?.length && (
          <div className="flex items-center justify-center h-32">
            <p className="text-lg">{noDataLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
