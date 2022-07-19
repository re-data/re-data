import React, { useMemo } from 'react';
import Table, { ColumnsProps } from './Table';

interface DynamicTableType {
  values: Record<string, string>[] | null;
}

const DynamicTable = ({ values }: DynamicTableType): JSX.Element => {
  const columns: ColumnsProps[] = useMemo(() => {
    if (!values) return [];
    const keys = Object.keys(values?.[0]);

    const result = [];

    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      result.push({
        Header: element?.replace('_', ' '),
        accessor: element,
      });
    }

    return result;
  }, [values]);

  const data: Record<string, string>[] = useMemo(() => {
    if (!values) return [];
    const result: Record<string, string>[] = [];

    for (let index = 0; index < values.length; index++) {
      const element = values[index];
      result.push(element);
    }
    return result;
  }, [values]);

  return <Table columns={columns} data={data} showSearch={false} />;
};

export default DynamicTable;
