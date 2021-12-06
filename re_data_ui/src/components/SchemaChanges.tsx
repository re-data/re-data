import React, {PropsWithChildren, ReactElement} from "react";
import {DATE_TIME_FORMAT, generateSchemaChangeMessage} from "../utils/helpers";
import moment from "moment/moment";
import {AggregatedAlerts, SchemaChange} from "../contexts/redataOverviewContext";

interface SchemaChangesProps {
    alerts: AggregatedAlerts;
}

const SchemaChanges: React.FC<SchemaChangesProps> = (props: PropsWithChildren<SchemaChangesProps>): ReactElement => {
    const schemaChanges: SchemaChange[] = [];
    for (const changes of props.alerts.schemaChanges.values()) {
        schemaChanges.push(...changes);
    }
    return (
        <div className='mb-3 grid grid-cols-1'>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block max-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="max-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Schema Changes
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">

                                {schemaChanges.map(change => (
                                    <tr key={change.id + '_' + change.prev_column_name}>
                                        <td className="px-6 text-sm py-4 whitespace-nowrap">
                                            <div
                                                className="text-gray-900">
                                                <span
                                                    className="badge mb-3 bg-yellow-300 rounded-full px-2 py-1
                                         text-center object-right-top text-white text-sm mr-1">!</span>
                                                {generateSchemaChangeMessage(change)} at {moment(change.detected_time).format(DATE_TIME_FORMAT)}
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
};

export default SchemaChanges;
