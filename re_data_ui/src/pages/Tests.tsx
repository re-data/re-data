import React, {
  ReactElement, useContext, useMemo, useState,
} from 'react';
import { FaRegSmileWink } from 'react-icons/all';
import { Link } from 'react-router-dom';
import { EmptyContent, Table } from '../components';
import { ColumnsProps } from '../components/Table';
import { ITestSchema, OverviewData, RedataOverviewContext } from '../contexts/redataOverviewContext';

type valueProps = {
  value: string;
}

const ModelCell = ({ value }: valueProps) => (
  <Link
    to={`/graph?model=${value.toLowerCase()}`}
    className="text-sm text-blue-700 font-semibold"
  >
    {value}
  </Link>
);

const StatusCell = ({ value }: valueProps) => (
  <div
    className={`${value?.toLowerCase()} text-xs font-medium text-center py-1 rounded-full`}
  >
    {value}
  </div>
);

const generateTestsData = (tests: ITestSchema[]) => {
  const result = [];
  const runAts = new Set<string>();

  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    runAts.add(test.run_at);
    result.push({
      column_name: test.column_name,
      status: test.status,
      test_name: test.test_name,
      model: test.model,
      run_at: test.run_at,
    });
  }

  return { result, runAts };
};

type RightComponentProps = {
  options: string[];
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const RightComponent = ({ options, value, handleChange }: RightComponentProps) => (
  <select
    className="px-2 py-1 rounded-md w-1/4 right-component"
    onChange={handleChange}
    value={value}
  >
    <option value="">All sorted by run time (new firsts)</option>
    {options.map((option: string) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const Tests: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { tests } = overview;
  const [backUpData, setBackUpData] = useState([]);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const columns: ColumnsProps[] = useMemo(() => [
    {
      Header: 'Test Name',
      accessor: 'test_name',
    },
    {
      Header: 'Model',
      accessor: 'model',
      Cell: ModelCell,
      testType: 'type',
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
  ], []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSelectedOption(option);
    if (option) {
      setData(backUpData.filter((row: ITestSchema) => row.run_at === option));
    } else {
      setData(backUpData);
    }
  };

  useMemo(() => {
    const initialTests = generateTestsData(tests);
    const { result, runAts } = initialTests;

    setOptions(Array.from(runAts) as []);
    setBackUpData(result as []);
    setData(result as []);
  }, [tests]);

  return (
    <>
      {(tests.length)
        ? (
          <div className="grid grid-cols-1 overflow-y-scroll">
            <h1 className="mb-3 text-2xl font-semibold">Tests</h1>
            <div className="flex flex-col">
              <Table
                columns={columns}
                data={data}
                RightComponent={() => (
                  <RightComponent
                    value={selectedOption}
                    options={options}
                    handleChange={handleChange}
                  />
                )}
              />
            </div>
          </div>
        ) : (
          <EmptyContent text="No Test">
            <FaRegSmileWink size={80} color="#392396" />
          </EmptyContent>
        )}
    </>
  );
};

export default Tests;
