import React, { useMemo } from 'react';
import { StatusCell } from '../partials';
import Table, { CellProps, ColumnsProps } from './Table';
// import { EmptyTable } from '../partials';

interface DynamicTableType {
  values: Record<string, string>[] | null;
}

const OtherCell = ({ value }: CellProps): JSX.Element => <span>{value}</span>;

const DynamicTable = ({ values }: DynamicTableType): JSX.Element => {
  if (!values) {
    return (
      <Table
        columns={[]}
        data={[]}
        showSearch={false}
        // EmptyData={(
        //   <EmptyTable
        //     title="Nothing to see here"
        //     subtitle="You currently do not have any uploads."
        //   />
        // )}
      />
    );
  }

  const columns: ColumnsProps[] = useMemo(() => {
    const keys = Object.keys(values?.[0]);
    const result = [];

    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      result.push({
        Header: element?.replace('_', ' '),
        accessor: element,
        Cell: element === 'status' ? StatusCell : OtherCell,
      });
    }

    return result;
  }, [values]);

  const data: Record<string, string>[] = useMemo(() => {
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
