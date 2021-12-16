import React, { PropsWithChildren, ReactElement } from 'react';
import { BiHappyAlt } from 'react-icons/all';
import { generateSchemaChangeMessage } from '../utils/helpers';
import { ReDataModelDetails } from '../contexts/redataOverviewContext';
import AlertBadge from './AlertBadge';
import EmptyContent from './EmptyContent';

interface SchemaChangesProps {
  modelDetails: ReDataModelDetails;
}

const SchemaChanges: React.FC<SchemaChangesProps> = (
  props: PropsWithChildren<SchemaChangesProps>,
)
  : ReactElement => {
  const { modelDetails } = props;
  const { schemaChanges } = modelDetails;

  return (
    <>
      <span className="text-lg text--capitalize">Schema Changes</span>
      {schemaChanges.length
        ? (
          <div className="mb-3 grid grid-cols-1">
            <div className="flex flex-col">
              <div className="-my-2 sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block max-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-scroll border-b border-gray-200 sm:rounded-lg">
                    <table className="max-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium
                             text-gray-500 uppercase tracking-wider"
                          >
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">

                        {schemaChanges.map((change) => (
                          <tr key={`${change.id}_${change.prev_column_name}`}>
                            <td className="px-6 text-sm py-4 whitespace-nowrap">
                              <div
                                className="text-gray-900"
                              >
                                <AlertBadge error={false} />
                                {generateSchemaChangeMessage(change)}
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
        )
        : (
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-4 mt-3 mb-3">
            <EmptyContent text="No Schema Changes!">
              <BiHappyAlt size={50} color="#392396" />
            </EmptyContent>
          </div>
        )}
    </>
  );
};

export default SchemaChanges;
