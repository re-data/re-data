import dayjs from 'dayjs';
import React, { ReactElement, useContext, useMemo } from 'react';
import { BiHappyAlt } from 'react-icons/all';
import { Link } from 'react-router-dom';
import { EmptyContent, Table } from '../components';
import AlertBadge from '../components/AlertBadge';
import { ColumnsProps } from '../components/Table';
import {
  Alert, OverviewData, RedataOverviewContext,
} from '../contexts/redataOverviewContext';

const generateAlertData = (alerts: Alert[]) => {
  const result = [];

  for (let index = 0; index < alerts.length; index++) {
    const alert = alerts[index];
    const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
    result.push({
      model: alert.value.model,
      type: alert.value.type,
      message: alert.value.message,
      value: alert.value.value,
      date: dayjs(alert.value.time_window_end).format(dateTimeFormat),
    });
  }

  return result;
};

type alertProps = {
  value: string;
  column: Record<string, number>;
  row:Record<string, string>;
}

const AlertCell = ({ value, column, row }: alertProps) => (
  <>
    <AlertBadge
      error={row.original[column.alertType] === 'anomaly'}
    />
    <Link
      to={`/graph?model=${value}`}
      className="text-sm text-gray-900"
    >
      {value}
    </Link>
  </>
);

type DetailsProps = {
  column: Record<string, number>;
  row:Record<string, string>;
}

const DetailsCell = ({ column, row }: DetailsProps) => (
  <Link
    to={`/graph?model=${row.original[column.model]}`}
    title="View graph details"
    className="details-cell text-xs hover:text-indigo-900 font-medium border px-4 py-1 rounded-full"
  >
    Details
  </Link>
);

const Alerts: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { alerts, graph } = overview;

  const columns: ColumnsProps[] = useMemo(() => [
    {
      Header: 'Model',
      accessor: 'model',
      Cell: AlertCell,
      alertType: 'type',
    },
    {
      Header: 'Message',
      accessor: 'message',
    },
    {
      Header: 'Metric Value',
      accessor: 'value',
    },
    {
      Header: 'Time Window',
      accessor: 'date',
    },
    {
      Header: ' ',
      accessor: 'details',
      Cell: DetailsCell,
      model: 'model',
    },
  ], []);

  const data = useMemo(() => generateAlertData(alerts), [alerts]) || [];

  return (
    <>
      {(alerts.length || !graph)
        ? (
          <div className="grid grid-cols-1 overflow-y-scroll">
            <h1 className="mb-3 text-2xl font-semibold">Alerts</h1>
            <div className="flex flex-col">
              <Table columns={columns} data={data} />
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
