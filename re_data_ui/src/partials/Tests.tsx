import dayjs from 'dayjs';
import React, {
  ReactElement, useContext, useMemo, useState,
} from 'react';
import { FaRegSmileWink } from 'react-icons/all';
import { Link } from 'react-router-dom';
import utc from 'dayjs/plugin/utc';
import { EmptyContent, Table } from '../components';
import { CellProps, ColumnsProps } from '../components/Table';
import {
  OverviewData,
  RedataOverviewContext,
  TestData,
} from '../contexts/redataOverviewContext';
import colors from '../utils/colors.js';
import ModelCell from './ModelCell';
import StatusCell from './StatusCell';

export interface TP {
  showRunAt: boolean;
  showModel: boolean;
  modelName?: string | null;
  showFilter?: boolean;
  showSearch?: boolean;
}

export type RightComponentProps = {
  options: string[];
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  showOptionLabel?: boolean;
};

dayjs.extend(utc);

const LinkCell = ({ value, row }: CellProps) => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { testNameMapping } = overview;
  const testName = testNameMapping[value?.toLowerCase()];

  const runAt = dayjs(row.original.run_at).valueOf();
  const decode = dayjs(Number(runAt)).format('YYYY-MM-DD HH:mm:ss');

  console.log('runAt', decode, row.original.run_at, runAt);

  return (
    <Link
      to={`/tests/${value.toLowerCase()}/${runAt}`}
      className="text-sm text-blue-700 font-semibold inline-flex flex-col"
    >
      {testName}
    </Link>
  );
};

export const RightComponent = ({
  options,
  value,
  handleChange,
  showOptionLabel = true,
}: RightComponentProps): JSX.Element => (
  <select
    className="px-2 py-1 rounded-md w-1/4 right-component border border-gray-300"
    onChange={handleChange}
    value={value}
  >
    {showOptionLabel && (
      <option value="">All sorted by run time (new firsts)</option>
    )}
    {options.map((option: string) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

type generateTestsDataProps = {
  tests: TestData[];
  modelName?: string | null;
  runAtsData?: Record<string, TestData[]>;
};

const generateTestsData = (props: generateTestsDataProps) => {
  const { tests, runAtsData, modelName } = props;
  const result: Array<TestData> = [];
  const runAts = new Set<string>();

  if (modelName && runAtsData) {
    const dateTime = Object.keys(runAtsData).sort().pop();

    if (dateTime) {
      const data = runAtsData[dateTime];
      for (let index = 0; index < data.length; index++) {
        const test = data[index];

        if (test.table_name === modelName) {
          result.push({ ...test });
        }
      }
    }
  } else {
    for (let index = 0; index < tests.length; index++) {
      const test = tests[index];
      runAts.add(test.run_at);

      result.push({ ...test });
    }
  }

  return { result: result.sort((a, b) => dayjs(b.run_at).diff(a.run_at)), runAts };
};

function TestsPartial(params: TP): ReactElement {
  const {
    showModel,
    showFilter = true,
    showRunAt,
    modelName = null,
    showSearch = true,
  } = params;
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { tests, runAts: runAtsData } = overview;
  const [backUpData, setBackUpData] = useState([]);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const columns = useMemo(() => {
    const cols: ColumnsProps[] = [
      {
        Header: 'Test Name',
        accessor: 'test_name',
        Cell: LinkCell,
      },
      {
        Header: 'Column',
        accessor: 'column_name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: StatusCell,
      },
    ];
    if (showModel) {
      cols.splice(1, 0, {
        Header: 'Model',
        accessor: 'table_name',
        Cell: ModelCell,
        type: 'test',
      });
    }
    if (showRunAt) {
      cols.push({
        Header: 'Run At',
        accessor: 'run_at',
      });
    }

    return cols;
  }, [showModel, showModel]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSelectedOption(option);
    if (option) {
      setData(backUpData.filter((row: TestData) => row.run_at === option));
    } else {
      setData(backUpData);
    }
  };

  useMemo(() => {
    const { result, runAts } = generateTestsData({
      tests,
      modelName,
      runAtsData,
    });

    setOptions(Array.from(runAts).sort((a, b) => dayjs(b).diff(a)) as []);
    setBackUpData(result as []);
    setData(result as []);
  }, [tests, modelName]);

  const check = !showFilter
    ? null
    : () => (
      <RightComponent
        options={options}
        value={selectedOption}
        handleChange={handleChange}
      />
    );

  return (
    <>
      {data.length ? (
        <Table
          columns={columns}
          data={data}
          showSearch={showSearch}
          RightComponent={check}
        />
      ) : (
        <EmptyContent
          text={modelName ? `No test for '${modelName}' model` : 'No Test'}
        >
          <FaRegSmileWink size={80} color={colors.primary} />
        </EmptyContent>
      )}
    </>
  );
}

export default TestsPartial;
