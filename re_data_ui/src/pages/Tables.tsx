import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaRegSmileWink } from 'react-icons/all';
import { Link, useSearchParams } from 'react-router-dom';
import {
  DynamicTable,
  EmptyContent,
  MetricCharts,
  SchemaChanges,
  Select,
  TableSchema,
} from '../components';
import {
  OverviewData,
  ReDataModelDetails,
  RedataOverviewContext,
  SelectOptionProps,
} from '../contexts/redataOverviewContext';
import useModel from '../hooks/useModel';
import { GraphPartial, MetaData, TestsPartial } from '../partials';
import colors from '../utils/colors.js';

const showA = true;

const Tables: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const {
    loading, modelNodes, dbtMapping, graph, modelNodesDepends, tableSamples,
  } = overview;
  const [activeTab, setActiveTab] = useState('');
  const [callApi, setCallApi] = useState(true);
  const [optionValue, setOptionValue] = useState<SelectOptionProps | null>();
  const [, setURLSearchParams] = useSearchParams();

  const [searchParams] = useSearchParams();
  const model = searchParams.get('model') as string;
  const tab = searchParams.get('tab') as string;

  const [modelDetails, setModelDetails] = useState<ReDataModelDetails>();

  const [rawSql, compiledSql] = useMemo(() => {
    const res = graph?.nodes?.[dbtMapping?.[model]];

    const result = res?.raw_sql || '';
    const result2 = res?.compiled_sql || '';

    return [result, result2];
  }, [graph, dbtMapping, model]);

  const { init } = useModel();

  const handleChange = (option: SelectOptionProps | null) => {
    if (option) {
      setOptionValue(option);
      const details = init(overview, option?.value) as ReDataModelDetails;
      setModelDetails(details);
      setURLSearchParams({ model: option.value });
    }
  };

  const handleScroll = (idName: string) => {
    setActiveTab(idName);
    setURLSearchParams({
      model,
      tab: idName,
    });
    document?.getElementById(idName)?.scrollIntoView();
  };

  useEffect(() => {
    if (model && !loading && callApi) {
      setCallApi(false);
      const details = init(overview, model) as ReDataModelDetails;
      setOptionValue({
        value: model,
        label: model,
      });
      setModelDetails(details);
    }
  }, [loading]);

  useEffect(() => {
    if (tab && !callApi) {
      setActiveTab(tab);
      document?.getElementById(tab)?.scrollIntoView();
    }
  }, [callApi]);

  return (
    <div className="grid grid-cols-1">
      <h1 className="mb-3 text-2xl font-semibold">Tables</h1>
      <div className="md:w-1/3 w-full ml-1 mb-4">
        <Select
          value={optionValue}
          options={modelNodes}
          handleChange={handleChange}
          placeholder="Please enter a table name to check details"
        />
      </div>

      {modelDetails ? (
        <div className="flex flex-col w-full">
          <nav className="sticky-nav">
            <ul className="flex items-center">
              <li
                className={`mr-4 ${activeTab === 'anomalies' && 'active-tab'}`}
              >
                <button type="button" onClick={() => handleScroll('anomalies')}>
                  Anomalies
                </button>
              </li>
              <li className={`mr-4 ${activeTab === 'metrics' && 'active-tab'}`}>
                <button type="button" onClick={() => handleScroll('metrics')}>
                  Metrics
                </button>
              </li>
              <li className={`mr-4 ${activeTab === 'schema' && 'active-tab'}`}>
                <button type="button" onClick={() => handleScroll('schema')}>
                  Schemas
                </button>
              </li>
              <li className={`mr-4 ${activeTab === 'graph' && 'active-tab'}`}>
                <button type="button" onClick={() => handleScroll('graph')}>
                  Lineage
                </button>
              </li>
              <li className={`mr-4 ${activeTab === 'tests' && 'active-tab'}`}>
                <button type="button" onClick={() => handleScroll('tests')}>
                  Tests
                </button>
              </li>
              <li className={`mr-4 ${activeTab === 'codes' && 'active-tab'}`}>
                <button type="button" onClick={() => handleScroll('codes')}>
                  Code
                </button>
              </li>
              <li className={`mr-4 ${activeTab === 'sample' && 'active-tab'}`}>
                <button type="button" onClick={() => handleScroll('sample')}>
                  Sample
                </button>
              </li>
            </ul>
          </nav>
          <section id="anomalies" className="pb-4 pt-16 -mt-12">
            <div className="bg-white rounded-md px-3 py-4">
              <h3 className="mb-3 text-md font-medium">Anomalies</h3>
              <div className="outlet">
                <MetricCharts
                  modelDetails={modelDetails}
                  showAnomalies={showA}
                  showTitle={false}
                  fullWidth={false}
                />
              </div>
            </div>
          </section>
          <section id="metrics" className="pb-4 pt-16 -mt-16">
            <div className="bg-white rounded-md px-3 py-4">
              <h3 className="mb-3 text-md font-medium">All metrics</h3>
              <div className="outlet">
                <MetricCharts
                  modelDetails={modelDetails}
                  showAnomalies={false}
                  showTitle={false}
                  fullWidth={false}
                />
              </div>
            </div>
          </section>
          <section id="schema" className="pb-4 pt-4">
            <div className="bg-white rounded-md px-3 py-4">
              <h3 className="mb-3 text-md font-medium">Schema</h3>
              <div className="grid grid-cols-2 gap-4">
                <TableSchema
                  tableSchemas={modelDetails.tableSchema}
                  showTitle={false}
                />
                <SchemaChanges modelDetails={modelDetails} showTitle={false} />
              </div>
            </div>
          </section>
          <section id="graph" className="pb-4 pt-4">
            <div className="bg-white rounded-md px-3 py-4">
              <h3 className="mb-3 text-md font-medium">Lineage</h3>
              <div className="relative graph-view h-96">
                <GraphPartial
                  modelName={model}
                  showModelDetails={false}
                  showFilter={false}
                />
              </div>
            </div>
          </section>
          <section id="tests" className="pb-4 pt-4">
            <div className="bg-white rounded-md px-3 py-4">
              <h3 className="mb-3 text-md font-medium">Tests</h3>
              <div className="grid grid-cols-1 gap-4">
                <TestsPartial showRunAt showModel={false} modelName={model} />
              </div>
            </div>
          </section>
          <section id="codes" className="pb-4 pt-4">
            <div className="bg-white rounded-md px-3 py-4">
              <MetaData
                tabs={[
                  {
                    label: 'SQL',
                    data: rawSql ? rawSql.trim() : null,
                    language: 'sql',
                  },
                  {
                    label: 'Compiled SQL',
                    data: compiledSql ? compiledSql.toString().trim() : null,
                    language: 'sql',
                  },
                ]}
              />

              <div>
                <h3 className="mt-4 mb-2 text-md font-medium">Macros</h3>
                <ul className="marker:text-sky-400 space-y-3 text-slate-400">
                  {modelNodesDepends?.[model]?.map((macro) => (
                    <li
                      className="text-sm mb-1 font-semibold text-primary"
                      key={macro}
                    >
                      <Link to={`/macros?macro=${macro}`}>{macro}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section id="sample" className="pb-4 pt-4">
            <div className="bg-white rounded-md px-3 py-4">
              <h3 className="mb-3 text-md font-medium">Recent Rows</h3>
              <div className="grid grid-cols-1 gap-4">
                <DynamicTable
                  values={
                    (((tableSamples.get(model)?.sample_data as string)
                      ? JSON.parse(
                          tableSamples.get(model)?.sample_data as string,
                      )
                      : null) || null) as unknown as Record<string, string>[]
                  }
                />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-white my-4 py-6 rounded-md">
          <EmptyContent text="Please type a table name in the input above">
            <FaRegSmileWink size={80} color={colors.primary} />
          </EmptyContent>
        </div>
      )}
    </div>
  );
};

export default Tables;
