import React, {
  ReactElement, useContext, useMemo, useState,
} from 'react';
import { FaRegSmileWink } from 'react-icons/all';
import { Link } from 'react-router-dom';
import { EmptyContent, Table } from '../components';
import { CellProps, ColumnsProps } from '../components/Table';
import {
  ITestSchema, OverviewData,
  ReDataModelDetails, RedataOverviewContext,
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
}

const LinkCell = ({ value }: CellProps) => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { testNameMapping } = overview;
  const testName = testNameMapping[value];

  return (
    <Link
      to={`/tests/${value.toLowerCase()}`}
      className="text-sm text-blue-700 font-semibold inline-flex flex-col"
    >
      {testName}
    </Link>
  );
};

export const RightComponent = (
  {
    options, value, handleChange,
    showOptionLabel = true,
  }: RightComponentProps,
): JSX.Element => (
  <select
    className="px-2 py-1 rounded-md w-1/4 right-component border border-gray-300"
    onChange={handleChange}
    value={value}
  >
    {showOptionLabel && <option value="">All sorted by run time (new firsts)</option>}
    {options.map((option: string) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

type generateTestsDataProps = {
  tests: ITestSchema[]
  modelName?: string | null
  aggregatedModels: Map<string, ReDataModelDetails>;
  runAtsData?: Record<string, ITestSchema[]>;
}

const generateTestsData = (props: generateTestsDataProps) => {
  const {
    tests, aggregatedModels, runAtsData, modelName,
  } = props;
  const result: Array<ITestSchema> = [];
  const runAts = new Set<string>();

  if (modelName) {
    if (aggregatedModels.has(modelName) && runAtsData) {
      const aggregate = aggregatedModels.get(modelName);
      const x = Object.keys(runAtsData).sort().pop();

      const aggregateTests = aggregate?.tests || [];
      if (x) {
        for (let index = 0; index < aggregateTests.length; index++) {
          const test = aggregateTests[index];
          if (x === test.run_at) {
            result.push({ ...test });
          }
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

  return { result, runAts };
};

function TestsPartial(params: TP): ReactElement {
  const {
    showModel, showFilter = true,
    showRunAt, modelName = null,
    showSearch = true,
  } = params;
  const overview: OverviewData = useContext(RedataOverviewContext);
  const {
    tests,
    aggregated_models: aggregatedModels,
    runAts: runAtsData,
  } = overview;
  const [backUpData, setBackUpData] = useState([]);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const columns = useMemo(() => {
    const cols: ColumnsProps[] = [{
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
    }];
    if (showModel) {
      cols.unshift({
        Header: 'Model',
        accessor: 'model',
        Cell: ModelCell,
        type: 'type',
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
      setData(backUpData.filter((row: ITestSchema) => row.run_at === option));
    } else {
      setData(backUpData);
    }
  };

  useMemo(() => {
    const initialTests = generateTestsData({
      tests,
      modelName,
      aggregatedModels,
      runAtsData,
    });
    const { result, runAts } = initialTests;

    setOptions(Array.from(runAts) as []);
    setBackUpData(result as []);
    setData(result as []);
  }, [tests, modelName]);

  const check = !showFilter ? null : () => (
    <RightComponent
      options={options}
      value={selectedOption}
      handleChange={handleChange}
    />
  );

  return (
    <>
      {(data.length)
        ? (
          <Table
            columns={columns}
            data={data}
            showSearch={showSearch}
            RightComponent={check}
          />
        ) : (
          <EmptyContent text={modelName ? `No test for '${modelName}' model` : 'No Test'}>
            <FaRegSmileWink size={80} color={colors.primary} />
          </EmptyContent>
        )}
    </>
  );
}

export default TestsPartial;
