/* eslint-disable max-len */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { ToolboxComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'sql-formatter';
import { Select, Table } from '../../components';
import { CellProps, ColumnsProps } from '../../components/Table';
import {
  OverviewData,
  RedataOverviewContext,
  SelectOptionProps,
  TestData,
} from '../../contexts/redataOverviewContext';
import { MetaData, StatusCell } from '../../partials';
import { RightComponent } from '../../partials/Tests';

dayjs.extend(customParseFormat);
echarts.use([ToolboxComponent]);

type valuesProps = {
  timelineData?: Record<string, string>;
};

const values = ({ timelineData }: valuesProps) => {
  if (timelineData) {
    const timelineVal = Object.entries(timelineData)
      .sort(([x]: [string, string], [y]: [string, string]) => dayjs(x).diff(y))
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    const data = Object.values(timelineVal);
    const runAt = Object.keys(timelineVal);

    return {
      grid: {
        top: '20%',
        right: '5%',
        bottom: '12%',
        left: '15%',
      },
      xAxis: {
        type: 'category',
        data: runAt,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'timeline',
          data,
          type: 'line',
          color: '#8884d8',
          smooth: true,
        },
      ],
    };
  }
  return {};
};

type generateDetailsDataProps = {
  modelName?: string | null;
  loading: boolean;
  testName?: string;
  runAt: string;
  testsObject?: Record<string, TestData[]>;
  modelTestMapping?: Record<string, TestData[]>;
};

const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const dateTimeFormat2 = 'YYYY-MM-DDTHH:mm:ss';

const generateDetailsData = (props: generateDetailsDataProps) => {
  const {
    loading, modelName, testName,
    testsObject, modelTestMapping, runAt,
  } = props;

  const val = [];
  let result: Record<string, unknown>[] = [];
  const runAts = new Set<string>();
  const testDetailsObject: Record<string, unknown> = {};
  const timelineData: Record<string, string> = {};

  const check = !loading && modelTestMapping && modelName && testsObject && testName;

  if (modelTestMapping && testName) {
    result = modelTestMapping?.[testName?.toLowerCase()] as unknown as Record<
      string,
      unknown
    >[];
  }

  if (check) {
    const arr = testsObject[modelName];
    const valSet = new Set();

    for (let index = 0; index < arr?.length; index++) {
      const element = arr[index];

      if (testName?.toLowerCase() === element.test_name?.toLowerCase()) {
        runAts.add(element.run_at);
        timelineData[element.run_at] = element.failures_count || '';
        if (element.run_at !== runAt) {
          testDetailsObject[element.run_at] = element;
        }
      }
      if (!valSet.has(element.test_name)) {
        valSet.add(element.test_name);

        val.push({
          label: element.test_name,
          value: `${element.test_name?.toLowerCase()}/${dayjs(element.run_at).valueOf()}`,
        });
      }
    }
  }

  return {
    options: val,
    runAtOptions: runAts,
    result,
    testDetailsObject,
    timelineData,
  };
};

const TestDetails: FC = (): ReactElement => {
  const [selectedOption, setSelectedOption] = useState('');
  const [backUpData, setBackUpData] = useState([]);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  let { testName } = useParams();
  const { runAt: _runAt } = useParams();
  const runAt = dayjs(Number(_runAt)).format(dateTimeFormat);
  const runAt2 = dayjs(Number(_runAt)).format(dateTimeFormat2);

  testName = testName?.toLowerCase();

  const columns: ColumnsProps[] = useMemo(
    () => [
      {
        Header: 'Test Name',
        accessor: 'test_name',
        Cell: ({ value }: CellProps) => <span className="text-x">{value}</span>,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: StatusCell,
      },
      {
        Header: 'Failures Count',
        accessor: 'failures_count',
      },
      {
        Header: 'Column',
        accessor: 'column_name',
      },
      {
        Header: 'Run At',
        accessor: 'run_at',
      },
    ],
    [],
  );

  const [optionValue, setOptionValue] = useState<SelectOptionProps | null>({
    label: testName || '',
    value: testName || '',
  });

  const overview: OverviewData = useContext(RedataOverviewContext);
  const {
    testsObject, modelTestMapping, testNameMapping, loading,
  } = overview;

  const modelName = modelTestMapping?.[testName || '']?.[0]?.table_name;

  const {
    options, result, timelineData, runAtOptions, testDetailsObject,
  } = generateDetailsData({
    modelName,
    loading,
    testsObject,
    modelTestMapping,
    runAt,
    testName,
  });

  useEffect(() => {
    if (!result) return;

    const firstRunAt = runAt2 || Array.from(runAtOptions)?.[0];
    let res = (result as []) || [];
    if (firstRunAt) {
      res = result.filter((row) => row.run_at === firstRunAt) as [];
    }

    setData(res);
    setBackUpData((result as []) || []);
  }, [result, runAt2]);

  const handleChange = (option: SelectOptionProps | null) => {
    if (option && modelName) {
      setOptionValue(option);
      navigate(`/tests/${option.value}`);
    }
  };

  const results: TestData = useMemo(() => {
    const key = selectedOption || runAt2 || Array.from(runAtOptions)?.[0];

    return (testDetailsObject?.[key] as TestData) || {};
  }, [runAtOptions, testDetailsObject, selectedOption]);

  const handleRunAtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;

    setSelectedOption(option);
    setData(
      option
        ? backUpData.filter((row: TestData) => row.run_at === option)
        : backUpData,
    );
  };

  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Test Details</h1>
        <div>
          <div className="md:w-1/3 w-full ml-1">
            <Select
              value={optionValue}
              options={options}
              handleChange={handleChange}
              placeholder="Please enter a test name to check details"
            />
          </div>
        </div>
      </section>

      <section className="mb-6 bg-white rounded-md px-3 py-4">
        <h2 className="text-md font-medium">
          {modelName && `Model: ${modelName}`}
        </h2>
        <p className="text-sm mt-1">
          {testName
            && testNameMapping?.[testName]
            && `Test: ${testNameMapping?.[testName] || ''}`}
        </p>
        <p className="text-sm mt-1">
          {results?.column_name ? `Column: ${results?.column_name || ''} ` : ''}
        </p>
      </section>

      <section className="mb-6 bg-white rounded-md px-3 py-4">
        <h4 className="font-bold text-xl">Failures timeline</h4>

        <div className="mt-2 rounded-md h-96 w-full">
          {timelineData && (
            <EChartsReactCore
              echarts={echarts}
              option={values({ timelineData })}
            />
          )}
        </div>
      </section>

      <section className="mb-6 bg-white rounded-md px-3 py-4">
        <div className="flex items-center justify-between mt-2">
          <h4 className="font-bold text-xl">By Run</h4>
          <RightComponent
            showOptionLabel={false}
            options={Array.from(runAtOptions) as []}
            value={selectedOption || runAt2 || Array.from(runAtOptions)?.[0]}
            handleChange={handleRunAtChange}
          />
        </div>

        {results.status && (
          <MetaData
            tabs={[
              {
                label: 'Failures',
                data: results.failures_json || null,
                language: 'json',
              },
              {
                label: 'Compiled SQL',
                data: results.compiled_sql
                  ? format(results.compiled_sql.trim())
                  : null,
                language: 'sql',
              },
            ]}
          />
        )}

        <div className="flex flex-col mt-5">
          {!loading && testName && (
            <Table showSearch={false} columns={columns} data={data} />
          )}
        </div>
      </section>
      <div className="h-10" />
    </>
  );
};

export default TestDetails;
