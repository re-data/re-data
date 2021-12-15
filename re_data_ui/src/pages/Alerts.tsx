import React, { ReactElement, useContext } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { BiHappyAlt } from 'react-icons/all';
import {
  Alert, Anomaly, OverviewData, RedataOverviewContext, SchemaChange,
} from '../contexts/redataOverviewContext';
import {
  generateAnomalyMessage, generateAnomalyValue, generateSchemaChangeMessage,
} from '../utils/helpers';
import AlertBadge from '../components/AlertBadge';
import EmptyContent from '../components/EmptyContent';

const generateAlertRow = (alert: Alert): ReactElement => {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
  let key: string;
  let message: string;
  let timeWindow: string;
  const value = alert.type === 'anomaly' ? generateAnomalyValue(alert.value as Anomaly) : undefined;
  if (alert.type === 'schema_change') {
    const schemaChange = alert.value as SchemaChange;
    key = `${schemaChange.id}_schemaChange`;
    message = generateSchemaChangeMessage(schemaChange);
    timeWindow = schemaChange.detected_time;
  } else {
    const anomaly = alert.value as Anomaly;
    key = `${anomaly.id}_anomaly`;
    message = generateAnomalyMessage(anomaly);
    timeWindow = anomaly.time_window_end;
  }
  return (
    <tr key={key}>
      <td className="px-6 py-4 whitespace-nowrap">
        <AlertBadge
          error={alert.type === 'anomaly'}
        />
        <span
          className="text-sm text-gray-900"
        >
          {alert.model}
        </span>
      </td>
      <td className="px-6 text-sm py-4 whitespace-nowrap">
        <div
          className="text-gray-900"
        >
          {message}
        </div>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap">
        {value}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dayjs(timeWindow).format(dateTimeFormat)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          to={`/graph?model=${alert.model}`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Details
        </Link>
      </td>
    </tr>
  );
};

const Alerts: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  let { alerts } = overview;
  alerts = [];

  return (
    <>
      {alerts.length
        ? (
          <div className="grid grid-cols-1">
            <h1 className="pl-3 mb-3 text-2xl">Alerts</h1>
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium
                              text-gray-500 uppercase tracking-wider"
                          >
                            Model
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Message
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Metric Value
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Time Window
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Details</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {alerts.map(generateAlertRow)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        : (
          <EmptyContent text="No Alerts!">
            <BiHappyAlt size={80} color="#392396" />
          </EmptyContent>
        )}
    </>
  );
};

export default Alerts;
