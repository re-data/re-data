import React, {
  FC,
  ReactElement,
  useCallback,
  useContext,
  useState,
} from 'react';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/all';
import {
  OverviewData,
  RedataOverviewContext,
} from '../contexts/redataOverviewContext';

const Settings: FC = (): ReactElement => {
  const [toggleAccordion, setToggleAccordion] = useState<number | null>(0);

  const overview: OverviewData = useContext(RedataOverviewContext);
  const { monitoredData } = overview;

  const toggleThisAccordion = useCallback(
    (index: number) => {
      setToggleAccordion(toggleAccordion === index ? null : index);
    },
    [toggleAccordion],
  );

  const renderReDataInformation = () => {
    const result = [];

    for (let index = 0; index < monitoredData.length; index++) {
      const {
        anomalyDetector, columns, metrics, model, owners, timeFilter,
      } = monitoredData[index];

      result.push(
        <div
          className={`py-4 ${
            monitoredData.length !== index + 1 ? 'border-b' : 'border-b-0'
          }`}
          key={index}
        >
          <div className="flex justify-between bg-white accordion-head">
            <h3 className="font-bold text-lg">{model}</h3>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => toggleThisAccordion(index)}
            >
              {toggleAccordion === index ? (
                <BsArrowUpCircle size="1.25em" />
              ) : (
                <BsArrowDownCircle size="1.25em" />
              )}
            </button>
          </div>
          <div
            className={`pr-10 pt-5 accordion-content text-sm ${
              toggleAccordion === index ? 'active' : ''
            }`}
          >
            <div className="mb-4">
              <p className="font-semibold">Anomaly detectors: </p>
              <ul className="list-disc ml-4 mt-2">
                {Object.keys(anomalyDetector).map((key) => (
                  <li key={key}>
                    {key}
                    {anomalyDetector[key] ? ` (${anomalyDetector[key]})` : ''}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Metrics: </p>
              <ul className="list-disc ml-4 mt-2">
                {Object.keys(metrics).map((key) => (
                  <li key={key}>
                    {key}
                    {metrics[key] ? ` (${metrics[key]})` : ''}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Owners: </p>
              <ul className="list-disc ml-4 mt-2">
                {Object.keys(owners).map((key) => {
                  const { notify_channel: notifyChannel, owner, name } = owners?.[key];
                  return (
                    <li key={key} className="mb-4">
                      {name}
                      <ul className="list-square ml-4 mt-2">
                        <li>{`channel: ${notifyChannel}`}</li>
                        <li>{`channel id: ${key}`}</li>
                        <li>{`position: ${owner}`}</li>
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Columns: </p>
              {columns?.join(', ')}
            </div>
            <div className="mb-4">
              <p className="font-semibold">Time filter: </p>
              {timeFilter}
            </div>
          </div>
        </div>,
      );
    }
    return result;
  };

  return (
    <section className="h-min-full w-full">
      <h2 className="mb-8 text-2xl font-bold">Settings</h2>
      <div className="grid grid-cols-6 gap-4 ">
        <aside className="rounded-md bg-white shadow-lg">
          <ul className="my-4">
            <li className="text-sm font-medium p-3 mb-5 bg-gray-300">
              Monitored
            </li>
            <li className="text-sm font-medium p-3 mb-5">
              DBT
            </li>
          </ul>
        </aside>
        <div className="col-span-5  bg-white rounded-md p-4 shadow-lg">
          <div className="accordion px-2 mb-20">
            {renderReDataInformation()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
