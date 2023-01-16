/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CodeFormatter } from '../partials';
import { isObj } from '../utils';

type activeViewTypes = 'monitored' | 'dbt' | 'timeline';

const Settings: FC = (): ReactElement => {
  const [toggleAccordion, setToggleAccordion] = useState<number | null>(0);

  const [activeView, setActiveView] = useState<activeViewTypes>('monitored');

  const overview: OverviewData = useContext(RedataOverviewContext);
  const { monitoredData, metaData } = overview;

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

      const splitModel = model.split('.');
      const modelName = splitModel.pop();
      const modelPath = splitModel.join('.');

      result.push(
        <div
          className={`py-4 ${
            monitoredData.length !== index + 1 ? 'border-b' : 'border-b-0'
          }`}
          key={index}
        >
          <div
            role="presentation"
            className="flex cursor-pointer justify-between bg-white accordion-head"
            onClick={toggleThisAccordion.bind(null, index)}
          >
            <div>
              <h3 className="font-bold text-lg">{modelName}</h3>
              <p className="italic text-xs">{modelPath}</p>
            </div>

            {toggleAccordion === index ? (
              <BsArrowUpCircle size="1.25em" />
            ) : (
              <BsArrowDownCircle size="1.25em" />
            )}
          </div>
          <div
            className={`pr-10 pt-5 accordion-content text-sm ${
              toggleAccordion === index ? 'active' : ''
            }`}
          >
            <div className="mb-4">
              <p className="font-semibold">Anomaly detector: </p>
              <ul className="list-disc ml-4 mt-2">
                {Object.keys(anomalyDetector).map((key) => (
                  <li key={key}>
                    {key}
                    {anomalyDetector[key] ? `: ${anomalyDetector[key]}` : ''}
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
                    {metrics[key] && Array.isArray(metrics[key]) ? `: ${metrics[key]}` : ''}
                    {metrics[key] && !Array.isArray(metrics[key]) ? (
                      <ul className="list-square ml-4 mt-2">
                        {/* {console.log(metrics[key])} */}
                        {Object.keys(metrics[key]).map((k: any) => {
                          const val = metrics[key]?.[k];
                          let res = ': ';

                          if (Array.isArray(val)) {
                            res += val.join(', ');
                          }

                          if (isObj(val)) {
                            console.log('is an object', val, isObj(val));
                          }
                          return (
                            <li key={k}>
                              {console.log(k, metrics[key]?.[k])}

                              {k}
                              {res}
                            </li>
                          );
                        })}
                      </ul>
                    ) : ''}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Owners: </p>
              <ul className="list-disc ml-4 mt-2">
                {Object.keys(owners).map((key) => {
                  const {
                    notify_channel: notifyChannel,
                    owner,
                    name,
                  } = owners?.[key];
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

  const renderDBTInformation = () => {
    const result = [];
    if (metaData) {
      let index = 0;
      for (const [key, value] of Object.entries(metaData.project_dict?.vars)) {
        if (!key.includes('re_data')) continue;

        result.push(
          <div
            className={`py-4 ${monitoredData.length !== index + 1 ? 'border-b' : 'border-b-0'
            }`}
            key={index}
          >
            <div
              role="presentation"
              className="flex cursor-pointer justify-between bg-white accordion-head"
              onClick={toggleThisAccordion.bind(null, index)}
            >
              <h3 className="font-bold text-lg">{key}</h3>

              {toggleAccordion === index ? (
                <BsArrowUpCircle size="1.25em" />
              ) : (
                <BsArrowDownCircle size="1.25em" />
              )}
            </div>
            <div
              className={`pr-10 pt-5 accordion-content text-sm ${toggleAccordion === index ? 'active' : ''
              }`}
            >
              <CodeFormatter
                code={(JSON.stringify(value, null, 3))}
                language="json"
                mode="light"
              />
            </div>
          </div>,
        );
        index += 1;
      }
    }
    return result.length ? result : null;
  };

  const renderTimelineInformation = () => {
    const result = [];
    if (metaData && metaData.re_data_args) {
      let index = 0;
      for (const [key, value] of Object.entries(metaData.re_data_args)) {
        result.push(
          <div
            className={`py-4 ${monitoredData.length !== index + 1 ? 'border-b' : 'border-b-0'
            }`}
            key={index}
          >
            <div
              role="presentation"
              className="flex cursor-pointer justify-between bg-white accordion-head"
              onClick={toggleThisAccordion.bind(null, index)}
            >
              <h3 className="font-bold text-lg">{key}</h3>

              {toggleAccordion === index ? (
                <BsArrowUpCircle size="1.25em" />
              ) : (
                <BsArrowDownCircle size="1.25em" />
              )}
            </div>
            <div
              className={`pr-10 pt-5 accordion-content text-sm ${toggleAccordion === index ? 'active' : ''
              }`}
            >
              <CodeFormatter
                code={(JSON.stringify(value, null, 3))}
                language="json"
                mode="light"
              />
            </div>
          </div>,
        );
        index += 1;
      }
    }
    return result.length ? result : null;
  };

  const toggleActiveView = useCallback(
    (view) => {
      setActiveView(view);
    },
    [activeView],
  );

  const view = {
    monitored: renderReDataInformation(),
    dbt: renderDBTInformation(),
    timeline: renderTimelineInformation(),
  };

  return (
    <div>
      <section className="min-h-full w-full">
        <h2 className="mb-8 text-2xl font-bold">Settings</h2>
        <div className="flex gap-1 justify-between h-inherit">
          <aside className=" settings-sidebar w-32">
            <ul className="my-4">
              <li
                className={`text-sm font-medium py-2 pl-0 mb-2 w-max cursor-pointer ${
                  activeView === 'monitored' ? 'active' : ''
                }`}
                onClick={toggleActiveView.bind(null, 'monitored')}
                role="presentation"
              >
                Tables
              </li>
              <li
                className={`text-sm font-medium py-2 pl-0 mb-2 w-max cursor-pointer ${
                  activeView === 'dbt' ? 'active' : ''
                }`}
                onClick={toggleActiveView.bind(null, 'dbt')}
                role="presentation"
              >
                Vars
              </li>
              <li
                className={`text-sm font-medium py-2 pl-0 mb-2 w-max cursor-pointer ${
                  activeView === 'timeline' ? 'active' : ''
                }`}
                onClick={toggleActiveView.bind(null, 'timeline')}
                role="presentation"
              >
                Timeline
              </li>
            </ul>
          </aside>
          <div className="col-span-5  bg-white rounded-md p-4 shadow-lg w-full">
            <div className="accordion px-2 mb-20">
              {view[activeView]}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
