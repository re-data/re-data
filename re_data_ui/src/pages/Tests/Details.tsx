import EChartsReactCore from 'echarts-for-react/lib/core';
import { ToolboxComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import React, {
  FC, ReactElement, ReactNode, useContext, useEffect, useMemo, useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Select, Table } from '../../components';
import { ColumnsProps } from '../../components/Table';
import {
  ITestSchema,
  OverviewData, RedataOverviewContext, SelectOptionProps,
} from '../../contexts/redataOverviewContext';
import { RightComponent, StatusCell } from '../../partials/Tests';

echarts.use([ToolboxComponent]);

type valuesProps = {
  timelineData?: Record<string, string>;
}
const values = ({ timelineData }: valuesProps) => {
  if (timelineData) {
    const data = Object.values(timelineData);
    const runAt = Object.keys(timelineData);

    return {
      title: {
        left: 'center',
        text: 'Timeline',
      },
      grid: {
        top: '20%', right: '5%', bottom: '12%', left: '15%',
      },
      xAxis: {
        type: 'category',
        data: runAt,
      },
      yAxis: {
        type: 'value',
      // axisLabel: {
      //   formatter: getFormatter(metricName),
      // },
      },
      series: [
        {
          name: 'timeline',
          data,
          type: 'line',
          color: '#8884d8',
          smooth: true,
        // markArea: {
        //   itemStyle: {
        //     color: 'rgba(255, 173, 177, 0.4)',
        //   },
        //   data: generateMarkAreas(anomaliesMap, columnName, metricName),
        // },
        },
      ],
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //     type: 'line',
    //   },
    // },
    // visualMap: {
    //   show: false,
    //   dimension: 0,
    //   pieces,
    //   inRange: {
    //     color: pieces.length ? '#ee2828' : '#8884d8',
    //   },
    //   outOfRange: {
    //     color: '#8884d8',
    //   },
    // },
    };
  }
  return {};
};

type CodeProps = {
  code: ReactNode
  language: string
}

const Code = ({ code, language }: CodeProps): JSX.Element => (
  <SyntaxHighlighter language={language} style={dark}>
    {code}
  </SyntaxHighlighter>
);

type generateDetailsDataProps = {
  modelName?: string | null
  loading: boolean
  testName?: string
  testsObject?: Record<string, ITestSchema[]>;
  modelTestMapping?: Record<string, ITestSchema[]>;
}

const generateDetailsData = (props: generateDetailsDataProps) => {
  const {
    loading, modelName, testName,
    testsObject, modelTestMapping,
  } = props;

  const val = [];
  let result:Record<string, unknown>[] = [];
  const runAts = new Set<string>();
  const testDetailsObject:Record<string, unknown> = {};
  const timelineData:Record<string, string> = {};

  const check = !loading && modelTestMapping && modelName && testsObject && testName;

  if (check) {
    const arr = testsObject[modelName];
    const valSet = new Set();
    result = modelTestMapping?.[testName] as unknown as Record<string, unknown>[];

    console.log('arr', arr, '==================', result);
    for (let index = 0; index < arr?.length; index++) {
      const element = arr[index];

      if (testName?.toLowerCase() === element.test_name?.toLowerCase()) {
        console.log(`${index}`);
        // console.log('here ', index);
        // console.log('here ', element);
        runAts.add(element.run_at); // still do this
        timelineData[element.run_at] = element.failures_count || ''; // still do this
        testDetailsObject[element.run_at] = element;
      }
      if (!valSet.has(element.test_name)) {
        // console.log(`${index}`);
        // console.log(`${element.run_at}`);
        valSet.add(element.test_name);

        // console.log('check -> ', valSet.has(element.test_name), element.test_name);

        val.push({
          label: element.test_name,
          value: element.test_name,
        });
      }
    }
  }

  // console.log('options ', val);
  console.log('timelineData ', timelineData);
  // console.log('result ', result);

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

  const { testName } = useParams();
  const columns: ColumnsProps[] = useMemo(() => [
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
  ], []);

  const [optionValue, setOptionValue] = useState<SelectOptionProps | null>({
    label: testName || '',
    value: testName || '',
  });

  const overview: OverviewData = useContext(RedataOverviewContext);
  const { testsObject, modelTestMapping, loading } = overview;

  const modelName = modelTestMapping?.[testName || '']?.[0]?.model;

  const {
    options, result, timelineData,
    runAtOptions, testDetailsObject,
  } = generateDetailsData({
    modelName,
    loading,
    testsObject,
    modelTestMapping,
    testName,
  });

  useEffect(() => {
    setData(result as [] || []);
    setBackUpData(result as [] || []);
  }, [result]);

  const handleChange = (option: SelectOptionProps | null) => {
    if (option && modelName) {
      console.log('option ', option);
      console.log('result => ', testsObject[option.value], testsObject[modelName]);
      setOptionValue(option);
      // setResult(testsObject[option.value] as never[]);
      navigate(`/tests/${option.value}`);
    }
  };

  const results: ITestSchema = useMemo(() => {
    const key = selectedOption || Array.from(runAtOptions)?.[0];
    return testDetailsObject?.[key] as ITestSchema;
  }, [runAtOptions, testDetailsObject, selectedOption]);

  const handleRunAtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    console.log(option);
    setSelectedOption(option);
    if (option) {
      setData(backUpData.filter((row: ITestSchema) => row.run_at === option));
    } else {
      setData(backUpData);
    }
  };

  console.log('options[0] ', options[0]);
  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">
          {`Test for: ${modelName}`}
        </h1>
        <div className="md:w-1/3 w-full ml-1">
          <Select
            value={optionValue}
            options={options}
            handleChange={handleChange}
            placeholder="Please enter a test name to check details"
          />
        </div>
      </section>

      <section className="mb-6">
        <h4 className="font-bold">Timeline</h4>

        <div className="mt-2 rounded-md h-96 w-full">
          {timelineData && (
            <EChartsReactCore echarts={echarts} option={values({ timelineData })} />
          )}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mt-2">
          <h4 className="font-bold text-xl">By Run</h4>
          <RightComponent
            options={Array.from(runAtOptions) as []}
            value={selectedOption || Array.from(runAtOptions)?.[0]}
            handleChange={handleRunAtChange}
          />
        </div>

        {results?.failures_json && (
          <div className="my-5">
            <h6 className="font-semibold">Failures Json</h6>
            <div className="flex flex-col mt-2">
              <Code code={JSON.stringify(JSON.parse(results.failures_json), null, 2)} language="json" />
            </div>
          </div>
        )}

        {results?.compiled_sql && (
          <div>
            <h6 className="font-semibold">Compiled SQL</h6>
            <div className="flex flex-col mt-2">
              <Code code={results.compiled_sql} language="sql" />
            </div>
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex flex-col mt-2">
          {!loading && testName && (
            <Table
              showSearch={false}
              columns={columns}
              data={data}
            />
          )}
        </div>
      </section>

      <div className="h-10" />
    </>
  );
};

export default TestDetails;
