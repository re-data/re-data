import dayjs from 'dayjs';
import React, { ReactElement, useContext, useMemo } from 'react';
import { FaRegSmileBeam } from 'react-icons/all';
import utc from 'dayjs/plugin/utc';
import { EmptyContent, Table } from '../components';
import AlertBadge from '../components/AlertBadge';
import { CellProps, ColumnsProps } from '../components/Table';
import {
  Alert, OverviewData, RedataOverviewContext,
} from '../contexts/redataOverviewContext';
import colors from '../utils/colors.js';
import { ModelCell } from '../partials';

dayjs.extend(utc);

const generateAlertData = (alerts: Alert[]) => {
  const result = [];

  for (let index = 0; index < alerts.length; index++) {
    const alert = alerts[index];
    const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

    result.push({
      model: alert.model,
      type: alert.type === 'schema_change' ? 'schema' : alert.type,
      message: alert.message,
      value: alert.value,
      date: dayjs.utc(alert.time_window_end).format(dateTimeFormat),
    });
  }

  return result;
};

const AlertCell = ({ value }: CellProps) => (
  <AlertBadge label={value} />
);

const MessageCell = ({ value }: CellProps) => (
  <div className="truncate w-400">
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
      Header: 'Time (UTC)',
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
