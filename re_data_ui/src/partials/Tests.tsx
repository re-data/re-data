import React, {
  ReactElement, useContext, useEffect, useMemo, useState,
} from 'react';
import { FaRegSmileWink } from 'react-icons/all';
import { Link } from 'react-router-dom';
import { EmptyContent, Table } from '../components';
import { CellProps, ColumnsProps } from '../components/Table';
import { ITestSchema, OverviewData, RedataOverviewContext } from '../contexts/redataOverviewContext';

export interface TP {
  showRunAt: boolean;
  showModel: boolean;
  modelName?: string | null;
}

type RightComponentProps = {
  options: string[];
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ModelCell = ({ value }: CellProps) => (
  <Link
    to={`/graph?model=${value.toLowerCase()}`}
    className="text-sm text-blue-700 font-semibold"
  >
    {value}
  </Link>
);

const StatusCell = ({ value }: CellProps) => (
  <div
    className={`${value?.toLowerCase()} text-xs font-medium text-center py-1 rounded-full`}
  >
    {value}
  </div>
);

const RightComponent = ({ options, value, handleChange }: RightComponentProps) => (
  <select
    className="px-2 py-1 rounded-md w-1/4 right-component border border-gray-300"
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

const generateTestsData = (tests: ITestSchema[], modelName?: string | null) => {
  const result = [];
  const runAts = new Set<string>();

  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    runAts.add(test.run_at);

    if (modelName && test.model !== modelName) {
      continue;
    } else {
      result.push({
        column_name: test.column_name,
        status: test.status,
        test_name: test.test_name,
        model: test.model,
        run_at: test.run_at,
      });
    }
  }

  return { result, runAts };
};

const TestsPartial: React.FC<TP> = ({ showModel, showRunAt, modelName = null }): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { tests } = overview;
  const [backUpData, setBackUpData] = useState([]);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [columns, setColumns] = useState<ColumnsProps[]>([]);

  useEffect(() => {
    if (showModel) {
      setColumns([
        {
          Header: 'Test Name',
          accessor: 'test_name',
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
          Header: 'Model',
          accessor: 'model',
          Cell: ModelCell,
          type: 'type',
        },
      ]);
    } else if (showRunAt) {
      setColumns([
        {
          Header: 'Test Name',
          accessor: 'test_name',
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
      ]);
    }
  }, []);

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
    const initialTests = generateTestsData(tests, modelName);
    const { result, runAts } = initialTests;

    setOptions(Array.from(runAts) as []);
    setBackUpData(result as []);
    setData(result as []);
  }, [tests, modelName]);

  return (
    <>
      {(data.length)
        ? (
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
        ) : (
          <EmptyContent text={modelName ? `No test for '${modelName}' model` : 'No Test'}>
            <FaRegSmileWink size={80} color="#392396" />
          </EmptyContent>
        )}
    </>
  );
};

export default TestsPartial;
