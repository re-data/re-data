import dayjs from 'dayjs';
import React, { ReactElement, useContext, useMemo } from 'react';
import { FaRegSmileBeam } from 'react-icons/all';
import { Link } from 'react-router-dom';
import { EmptyContent, Table } from '../components';
import AlertBadge from '../components/AlertBadge';
import { CellProps, ColumnsProps } from '../components/Table';
import {
  Alert, OverviewData, RedataOverviewContext,
} from '../contexts/redataOverviewContext';
import colors from '../utils/colors.js';

const generateAlertData = (alerts: Alert[]) => {
  const result = [];

  for (let index = 0; index < alerts.length; index++) {
    const alert = alerts[index];
    const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

    result.push({
      model: alert.model,
      type: alert.type === 'schema_changes' ? 'schema' : alert.type,
      message: alert.message,
      value: alert.value,
      date: dayjs(alert.time_window_end).format(dateTimeFormat),
    });
  }

  return result;
};

const ModelCell = ({ value, row }: CellProps) => {
  const val = value?.split('.');
  const val3 = val?.splice(0, val?.length - 1)?.join('.');

  const table = val?.pop();
  // console.log('table ', val, val3);
  return (
    <Link
      to={`/graph?model=${value?.toLowerCase()}&tab=${row?.values?.type?.toLowerCase()}`}
      className="text-blue-700"
    >
      <span className="text-base font-semibold">{table}</span>
      <br />
      <em className="text-xs">{val3}</em>
    </Link>
  );
};

const AlertCell = ({ value }: CellProps) => (
  <AlertBadge label={value} />
);

const MessageCell = ({ value }: CellProps) => (
  <div className="truncate w-480">
    {value}
  </div>
);

const Alerts: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { alerts, graph } = overview;

  const columns: ColumnsProps[] = useMemo(() => [
    {
      Header: 'Model',
      accessor: 'model',
      Cell: ModelCell,
    },
    {
      Header: 'Alert',
      accessor: 'type',
      Cell: AlertCell,
    },
    {
      Header: 'Message',
      accessor: 'message',
      Cell: MessageCell,
    },
    {
      Header: 'Value',
      accessor: 'value',
    },
    {
      Header: 'Time',
      accessor: 'date',
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
            <FaRegSmileBeam size={80} color={colors.primary} />
          </EmptyContent>
        )}
    </>
  );
};

export default Alerts;
