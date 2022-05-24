import React, {
  FC,
  ReactElement,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from 'react-icons/all';
import {
  OverviewData,
  RedataOverviewContext,
} from '../contexts/redataOverviewContext';

const Settings: FC = (): ReactElement => {
  const [toggleAccordion, setToggleAccordion] = useState<number | null>(0);

  const overview: OverviewData = useContext(RedataOverviewContext);
  const { monitoredData } = overview;
  // console.log('settings screen ', monitoredData, loading);

  const toggleThisAccordion = useCallback((index: number) => {
    if (toggleAccordion === index) {
      setToggleAccordion(null);
    } else {
      setToggleAccordion(index);
    }
  }, []);

  const renderReDataInformation = () => {
    const result = [];

    for (let index = 0; index < monitoredData.length; index++) {
      const {
        anomalyDetector, columns, metrics, model, owners, timeFilter,
      } = monitoredData[index];

      console.log('element ', index, monitoredData[index]);

      result.push(
        <div
          className={`py-5 ${
            monitoredData.length !== index + 1 ? 'border-b-2' : 'border-b-0'
          }`}
          key={index}
        >
          <div className="flex justify-between bg-white accordion-head">
            <h3 className="font-bold">{model}</h3>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => toggleThisAccordion(index)}
            >
              {toggleAccordion === index ? (
                <BsFillArrowUpCircleFill size="1.25em" />
              ) : (
                <BsFillArrowDownCircleFill size="1.25em" />
              )}
            </button>
          </div>
          <div
            className={`pr-10 pt-5 accordion-content text-sm ${
              toggleAccordion === index ? 'active' : ''
            }`}
          >
            <p className="mb-4">
              <span className="font-semibold">Anomaly detectors: </span>
              <ul className="list-disc ml-4  mt-2">
                {Object.keys(anomalyDetector).map((key) => (
                  <li key={key}>
                    {key}
                    {anomalyDetector[key]
                      ? ` (${anomalyDetector[key]})`
                      : ''}
                  </li>
                ))}
              </ul>
            </p>
            <p className="mb-4">
              <span className="font-semibold">Metrics: </span>
              <ul className="list-disc ml-4  mt-2">
                {Object.keys(metrics).map((key) => (
                  <li key={key}>
                    {key}
                    {metrics[key]
                      ? ` (${metrics[key]})`
                      : ''}
                  </li>
                ))}
              </ul>
            </p>
            <p className="mb-4">
              <span className="font-semibold">Owners: </span>
              <ul className="list-disc ml-4  mt-2">
                {Object.keys(owners).map((key) => (
                  <li key={key}>
                    {key}
                    {owners[key]
                      ? ` (${owners[key]})`
                      : ''}
                  </li>
                ))}
              </ul>
            </p>
            <p className="mb-4">
              <span className="font-semibold">Columns: </span>
              {columns?.join(', ')}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Time filter: </span>
              {timeFilter}
            </p>
          </div>
        </div>,
      );
    }
    return result;
  };

  return (
    <section className="border border-red-500 h-full w-full">
      <h2 className="mb-8 text-2xl font-bold">Settings</h2>
      <div className="grid grid-cols-6 gap-4 border border-red-500">
        <aside className="border border-red-500 p-4 pl-0 rounded-md bg-white shadow-lg">
          <ul>
            <li className="text-sm font-medium p-1 pl-0 mb-2">
              <a href="./id">Monitored</a>
            </li>
            <li className="text-sm font-medium p-1 pl-0 mb-2">
              <a href="./id">DBT</a>
            </li>
          </ul>
        </aside>
        <div className="col-span-5 border border-red-500 bg-white rounded-md p-4 shadow-lg">
          <div className="accordion border-2 border-[#F3F3F7] mt-5 px-5 mb-20">
            {renderReDataInformation()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
