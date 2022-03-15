/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo } from 'react';
import {
  Row, TableInstance, useAsyncDebounce,
  useGlobalFilter, usePagination, useSortBy, useTable,
} from 'react-table';

export interface CellProps {
  value: string;
  column: Record<string, number>;
  row: Record<string, string>;
}
export interface ColumnsProps {
  Header: string;
  accessor: string;
  Cell?: ({ value, column, row }: CellProps) => JSX.Element;
  type?: string;
}

export interface ITable {
  columns: ColumnsProps[];
  data: Record<string, unknown>[];
  showSearch?: boolean;
  RightComponent?: React.FunctionComponent<unknown> | null;
}

interface IFilter {
  preGlobalFilteredRows: Row[];
  globalFilter: string;
  setGlobalFilter: (v?: string) => void;
}

const CustomFilter = memo(({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: IFilter) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 200);

  return (
    <label className="flex gap-x-2 items-baseline w-1/4">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className="block w-full px-2 py-1 rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          return onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  );
});

/**
 * This is a simple table component that uses react-table to display data.
 * @param  {array of objects} columns
 * @param  {array of objects} data
 * @param  {boolean} showSearch - default: true
 * @param  {ReactElement | null} RightComponent - default: null
 * @returns JSX
 */

function Table(params: ITable): JSX.Element {
  const {
    columns, data, showSearch = true, RightComponent = null,
  } = params;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
  }: TableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  return (
    <>
      {(showSearch || RightComponent) && (
        <div className="flex justify-between items-center pb-3 pt-2">
          {showSearch && (
            <CustomFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          )}

          {RightComponent && (
            <RightComponent />
          )}
        </div>
      )}

      <table
        {...getTableProps()}
        className="min-w-full w-full table-fixed divide-y divide-gray-200"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  {...column.getHeaderProps(
                    column.getSortByToggleProps(),
                  )}
                >
                  <div className="group flex items-center justify-between">
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (
                        <>
                          {column.isSortedDesc ? (
                            <span className="ml-2 text-gray-400">↓</span>
                          ) : (
                            <span className="ml-2 text-gray-400">↑</span>
                          )}
                        </>
                      ) : (
                        <span className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100">
                          ↕
                        </span>
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200"
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row?.id}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-6 py-4 text-sm whitespace-nowrap truncate"
                    role="cell"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {page.length > 0 && (
        <div className="py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button type="button" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button type="button" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>

          {pageOptions.length > 1 && (
            <>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    Page
                    <span className="font-medium px-1">{pageIndex + 1}</span>
                    of
                    <span className="font-medium px-1">{pageOptions.length}</span>
                  </p>
                  <label>
                    <span className="sr-only">Items Per Page</span>
                    <select
                      className="mt-1 block w-full ml-3 px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                      }}
                    >
                      {[5, 10, 20, 50, 100].map((size: number) => (
                        <option key={size} value={size}>
                          Show
                          {' '}
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      onClick={() => gotoPage(0)}
                      disabled={!canPreviousPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                      className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                      className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => gotoPage(pageCount - 1)}
                      disabled={!canNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Table;
