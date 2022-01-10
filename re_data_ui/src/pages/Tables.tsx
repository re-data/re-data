/* eslint-disable comma-dangle */
import React, {
  ReactElement, useContext, useMemo, useState
} from 'react';
import { BiHappyAlt } from 'react-icons/all';
import { useSearchParams } from 'react-router-dom';
import {
  EmptyContent, MetricCharts, SchemaChanges, Select, TableSchema
} from '../components';
import {
  OverviewData, ReDataModelDetails, RedataOverviewContext
} from '../contexts/redataOverviewContext';
import useModel from '../hooks/useModel';

type optionsProps = {
  value: string;
  label: string;
}

const generateOptions = (models: Map<string, ReDataModelDetails>) => {
  const result: optionsProps[] = [];
  [...models.keys()].map((model) => {
    result.push({
      value: model,
      label: model,
    });
    return true;
  });
  return result;
};

const Tables: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { aggregated_models: models } = overview;
  const [activeTab, setActiveTab] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setURLSearchParams] = useSearchParams();

  const [modelDetails, setModelDetails] = useState<ReDataModelDetails>();

  const { init } = useModel();

  const handleChange = (option: optionsProps | null) => {
    console.log(option);
    if (option) {
      const details = init(overview, option?.value);
      setModelDetails(details);
      // setURLSearchParams({ model: option.value });
    }
  };

  const options = useMemo(() => generateOptions(models), [models]) || [];

  const handleScroll = (idName: string) => {
    setActiveTab(idName);
    document?.getElementById(idName)?.scrollIntoView();
  };

  return (
    <div className="grid grid-cols-1">
      <h1 className="mb-3 text-2xl font-semibold">Tables</h1>
      <div className="w-1/3 ml-1 mb-4">
        <Select
          options={options}
          handleChange={handleChange}
          placeholder="Please enter a table name to check details"
        />
      </div>

      {modelDetails ? (
        <div className="flex flex-col w-full">
          <nav className="top-0 sticky bg-gray-100 py-1 mb-1">
            <ul className="flex align-items">
              <li
                className={`mr-4 ${activeTab === 'anomalies' && 'active-tab'}`}
              >
                <a
                  href="./#/tables/#anomalies"
                  onClick={() => handleScroll('anomalies')}
                >
                  Anomalies
                </a>
              </li>
              <li
                className={`mr-4 ${activeTab === 'metrics' && 'active-tab'}`}
              >
                <a
                  href="./#/tables/#metrics"
                  onClick={() => handleScroll('metrics')}
                >
                  Metrics
                </a>
              </li>
              <li
                className={`mr-4 ${activeTab === 'schema' && 'active-tab'}`}
              >
                <a
                  href="./#/tables/#schema"
                  onClick={() => handleScroll('schema')}
                >
                  Schema
                </a>
              </li>
            </ul>
          </nav>
          <section id="anomalies" className="pb-4 pt-16 -mt-12">
            <div className="bg-white rounded-md px-3 py-4">
              <h3 className="mb-3 text-md font-medium">Anomalies</h3>
              <div className="outlet">
                <MetricCharts
                  modelDetails={modelDetails}
                  showAnomalies
                  showTitle={false}
                  fullWidth={false}
                />
              </div>
            </div>
          </section>
          <section id="metrics" className="pb-4 pt-16 -mt-16">
            <div className="bg-white rounded-md px-3 py-4">
              <h3 className="mb-3 text-md font-medium">Metics</h3>
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
                <SchemaChanges
                  modelDetails={modelDetails}
                  showTitle={false}
                />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-white my-4 py-6 rounded-md">
          <EmptyContent text="Please type a table name in the input above!">
            <BiHappyAlt size={80} color="#392396" />
          </EmptyContent>
        </div>
      )}
    </div>
  );
};

export default Tables;
