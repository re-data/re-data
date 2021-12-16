import React, { PropsWithChildren, ReactElement } from 'react';
import { ITableSchema } from '../contexts/redataOverviewContext';

interface TableSchemaProps {
  tableSchemas: ITableSchema[]
}
const TableSchema: React.FC<TableSchemaProps> = (
  props: PropsWithChildren<TableSchemaProps>,
): ReactElement => {
  const { tableSchemas } = props;
  return (
    <>
      <span className="text-lg text--capitalize">Table Schema</span>
      <div className="mb-3 grid grid-cols-1">
        <div className="flex flex-col">
          <div className="-my-2 sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block w-full max-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
                <table className="max-w-full divide-y divide-gray-200 w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Column Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">

                    {tableSchemas.map((tableSchema) => (
                      <tr key={tableSchema.column_name}>
                        <td className="px-6 text-sm py-4 whitespace-nowrap">
                          <div
                            className="text-gray-900"
                          >
                            {tableSchema.column_name}
                          </div>
                        </td>
                        <td className="px-6 text-sm py-4 whitespace-nowrap">
                          <div
                            className="text-gray-900"
                          >
                            {tableSchema.data_type}
                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableSchema;
