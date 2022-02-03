import React, { useMemo, PropsWithChildren, ReactElement } from 'react';
import { ITableSchema } from '../contexts/redataOverviewContext';
import Table, { ColumnsProps } from './Table';

export interface TableSchemaProps {
  tableSchemas: ITableSchema[],
  showTitle?: boolean
}

const TableSchema: React.FC<TableSchemaProps> = (
  props: PropsWithChildren<TableSchemaProps>,
): ReactElement => {
  const { tableSchemas, showTitle } = props;
  const data = tableSchemas as unknown as Record<string, unknown>[];

  const columns: ColumnsProps[] = useMemo(() => [
    {
      Header: 'Column Name',
      accessor: 'column_name',
    },
    {
      Header: 'Data Type',
      accessor: 'data_type',
    },
  ],
  []);
  return (
    <>
      {showTitle && (
        <span className="text-lg">Table Schema</span>
      )}
      <div className="mb-3 grid grid-cols-1">
        <div className="flex flex-col">
          <div className="-my-2 sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block w-full max-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
                <Table columns={columns} data={data} showSearch={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableSchema;
