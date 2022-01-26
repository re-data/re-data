import React, {
  ReactElement, useContext, useMemo, useState,
} from 'react';
import { FaRegSmileWink } from 'react-icons/all';
import { useSearchParams } from 'react-router-dom';
import { EmptyContent, Table } from '../components';
import { ColumnsProps } from '../components/Table';
import { ITestSchema, OverviewData, RedataOverviewContext } from '../contexts/redataOverviewContext';

type valueProps = {
  value: string;
}

const TestNameCell = ({ value }: valueProps) => (
  <p
    className="text-sm font-semibold"
  >
    {value}
  </p>
);

const StatusCell = ({ value }: valueProps) => (
  <div
    className={`${value?.toLowerCase()} text-xs font-medium text-center py-1 rounded-full`}
  >
    {value}
  </div>
);

const generateTestsData = (tests: ITestSchema[], model: string) => {
  const result = [];

  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    // get model name from the url and filter other out
    if (test.model === model) {
      result.push({
        column_name: test.column_name,
        status: test.status,
        test_name: test.test_name,
        model: test.model,
        run_at: test.run_at,
      });
    }
  }

  return { result };
};

const Tests: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { tests } = overview;
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();

  const model = searchParams.get('model') as string;

  const columns: ColumnsProps[] = useMemo(() => [
    {
      Header: 'Test Name',
      accessor: 'test_name',
      Cell: TestNameCell,
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: StatusCell,
    },
    {
      Header: 'Column',
      accessor: 'column_name',
    },
    {
      Header: 'Run At',
      accessor: 'run_at',
    },
  ], []);

  useMemo(() => {
    const initialTests = generateTestsData(tests, model);
    const { result } = initialTests;

    setData(result as []);
  }, [tests, model]);

  return (
    <>
      {(data.length)
        ? (
          <Table
            columns={columns}
            data={data}
            showSearch={false}
          />
        ) : (
          <EmptyContent text={`No test for ${model} model`}>
            <FaRegSmileWink size={80} color="#392396" />
          </EmptyContent>
        )}
    </>
  );
};

export default Tests;
