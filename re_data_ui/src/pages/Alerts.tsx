import dayjs from 'dayjs';
import React, {
  ReactElement, useContext, useMemo, useState,
} from 'react';
import { FaRegSmileBeam } from 'react-icons/all';
import { EmptyContent, Table } from '../components';
import AlertBadge from '../components/AlertBadge';
import { CellProps, ColumnsProps } from '../components/Table';
import {
  Alert,
  OverviewData,
  RedataOverviewContext,
} from '../contexts/redataOverviewContext';
import { ModelCell, TableSelect } from '../partials';
import colors from '../utils/colors.js';

export type AlertType = 'Anomaly' | 'Test' | 'Schema' | 'All' | '';

export type AlertData = {
  model: string;
  type: string;
  message: string;
  value: string;
  date: string;
};

const generateAlertData = (alerts: Alert[]): AlertData[] => {
  const result = [];

  for (let index = 0; index < alerts.length; index++) {
    const alert = alerts[index];
    const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

    result.push({
      model: alert.model,
      type: alert.type === 'schema_change' ? 'schema' : alert.type,
      message: alert.message,
      value: alert.value,
      date: dayjs(alert.time_window_end).format(dateTimeFormat),
    });
  }

  return result;
};

const AlertCell = ({ value }: CellProps) => <AlertBadge label={value} />;

const MessageCell = ({ value }: CellProps) => (
  <div className="truncate w-400">{value}</div>
);

const Alerts: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { alerts, graph } = overview;

  const [backupData, setBackUpData] = useState<AlertData[] | []>([]);
  const [alertType, setAlertType] = useState<AlertType | undefined>(undefined);

  const columns: ColumnsProps[] = useMemo(
    () => [
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
    ],
    [],
  );

  const data = useMemo(() => {
    if (!alertType || alertType === 'All') {
      if (backupData.length > 0) {
        return backupData;
      }

      const res = generateAlertData(alerts);

      setBackUpData(res);
      return generateAlertData(alerts);
    }

    return backupData.filter((row) => row.type === alertType?.toLowerCase());
  }, [alerts, alertType]) || [];

  const handleAlertChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as AlertType;

    setAlertType(type);
  };

  return (
    <>
      {alerts.length || !graph ? (
        <div className="grid grid-cols-1 overflow-y-scroll">
          <h1 className="mb-3 text-2xl font-semibold">Alerts</h1>
          <div className="flex flex-col">
            <Table
              columns={columns}
              data={data}
              RightComponent={() => (
                <TableSelect
                  placeholder="Select Alert Type"
                  options={['All', 'Anomaly', 'Test', 'Schema']}
                  value={alertType}
                  handleChange={handleAlertChange}
                />
              )}
            />
          </div>
        </div>
      ) : (
        <EmptyContent text="No Alerts!">
          <FaRegSmileBeam size={80} color={colors.primary} />
        </EmptyContent>
      )}
    </>
  );
};

export default Alerts;
