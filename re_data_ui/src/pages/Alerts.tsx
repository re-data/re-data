import React, {ReactElement, useContext} from "react";
import {Anomaly, OverviewData, RedataOverviewContext} from "../contexts/redataOverviewContext";
import {Link} from "react-router-dom";
import Moment from "react-moment";
import {stripQuotes} from "../utils/helpers";

const makeTableKey = (anomaly: Anomaly) => {
    const tableName = anomaly.table_name;
    const metric = anomaly.metric;
    const columnName = anomaly.column_name ? anomaly.column_name : '';
    return `${tableName}_${metric}_${columnName}`;

};

const generateAlertMessage = (anomaly: Anomaly) => {
    const compareText = anomaly.last_value > anomaly.last_avg ? 'greater than' : 'less than';
    const percentage = ((Math.abs(anomaly.last_value - anomaly.last_avg) / anomaly.last_avg) * 100).toFixed(2);
    const model = anomaly.column_name ? `column ${anomaly.column_name}` : 'this table';
    return `${anomaly.metric} for ${model} is ${percentage}% ${compareText} average`;
};

const Alerts: React.FC = (): ReactElement => {
    const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
    const overview: OverviewData = useContext(RedataOverviewContext);
    const anomalies = overview.anomalies;
    return (
        <div className='grid grid-cols-1'>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Model
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metric Value
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Computed On
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Details</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {anomalies.map(anomaly => (
                                    <tr key={makeTableKey(anomaly)}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="badge mb-3 bg-red-600 rounded-full px-2 py-1 text-center object-right-top text-white text-sm mr-1">!</span>
                                            <span
                                                className='text-xs text-gray-900'>{stripQuotes(anomaly.table_name)}</span>
                                        </td>
                                        <td className="px-6 text-sm py-4 whitespace-nowrap">
                                            <div
                                                className="text-gray-900">
                                                {generateAlertMessage(anomaly)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {anomaly.last_value.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Moment format={dateTimeFormat}>{anomaly.computed_on}</Moment>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={'/graph?model=' + stripQuotes(anomaly.table_name)}
                                                  className="text-indigo-600 hover:text-indigo-900">Details</Link>
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

export default Alerts;
