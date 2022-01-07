import React, {
  ReactElement, useContext, useMemo, useState,
} from 'react';
import { BiHappyAlt } from 'react-icons/all';
import { useSearchParams } from 'react-router-dom';
import {
  TableSchema, SchemaChanges, Select, EmptyContent, MetricCharts,
} from '../components';
import { OverviewData, ReDataModelDetails, RedataOverviewContext } from '../contexts/redataOverviewContext';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setURLSearchParams] = useSearchParams();

  const [modelDetails, setModelDetails] = useState<ReDataModelDetails>();

  const { init } = useModel();

  const handleChange = (option: optionsProps | null) => {
    console.log(option);
    if (option) {
      const details = init(overview, option?.value);
      setModelDetails(details);
      setURLSearchParams({ model: option.value });
    }
  };

  const options = useMemo(() => generateOptions(models), [models]) || [];

  return (
    <div className="grid grid-cols-1 overflow-y-scroll">
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
          <section className="bg-white rounded-md px-3 py-4 mb-4">
            <h3 className="mb-3 text-md font-medium">Anomalies</h3>
            <div className="outlet">
              <MetricCharts
                modelDetails={modelDetails}
                showAnomalies
                showTitle={false}
                fullWidth={false}
              />
            </div>
          </section>
          <section className="bg-white rounded-md px-3 py-4 mb-4">
            <h3 className="mb-3 text-md font-medium">Metics</h3>
            <div className="outlet">
              <MetricCharts
                modelDetails={modelDetails}
                showAnomalies={false}
                showTitle={false}
                fullWidth={false}
              />
            </div>
          </section>
          <section className="bg-white rounded-md px-3 py-4 mb-4">
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
