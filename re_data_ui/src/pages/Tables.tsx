import React, { ReactElement, useContext, useState } from 'react';
import { BiHappyAlt } from 'react-icons/all';
import { useSearchParams } from 'react-router-dom';
import EmptyContent from '../components/EmptyContent';
import MetricCharts from '../components/MetricCharts';
import SchemaChanges from '../components/SchemaChanges';
import TableSchema from '../components/TableSchema';
import { OverviewData, ReDataModelDetails, RedataOverviewContext } from '../contexts/redataOverviewContext';
import useModel from '../hooks/useModel';

const Tables: React.FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);
  const { aggregated_models: models } = overview;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setURLSearchParams] = useSearchParams();

  const [modelDetails, setModelDetails] = useState<ReDataModelDetails>();

  const { init } = useModel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const option = e.target.value;
    setURLSearchParams({ model: option });

    const details = init(overview, option) as ReDataModelDetails;
    setModelDetails(details);
  };

  return (
    <div className="grid grid-cols-1 overflow-y-scroll">
      <h1 className="mb-3 text-2xl font-semibold">Tables</h1>
      <div>
        <input
          list="tbl_name"
          onChange={handleChange}
          placeholder="Please enter table name to check details"
          className="mb-3 block w-full px-2 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <datalist id="tbl_name">
          <option value="">Select Table Name</option>
          {[...models.keys()].map((model) => (
            <option key={model}>{model}</option>
          ))}
        </datalist>
      </div>
      {modelDetails ? (
        <div className="flex flex-col">
          <section className="bg-white rounded-md px-3 py-4 mb-4">
            <h3 className="mb-3 text-md font-medium">Anomalies</h3>
            <MetricCharts modelDetails={modelDetails} showAnomalies />
          </section>
          <section className="bg-white rounded-md px-3 py-4 mb-4">
            <h3 className="mb-3 text-md font-medium">Metics</h3>
            <MetricCharts modelDetails={modelDetails} showAnomalies={false} />
          </section>
          <section className="bg-white rounded-md px-3 py-4 mb-4">
            <h3 className="mb-3 text-md font-medium">Schema</h3>
            <>
              <TableSchema tableSchemas={modelDetails.tableSchema} />
              <SchemaChanges modelDetails={modelDetails} />
            </>
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
