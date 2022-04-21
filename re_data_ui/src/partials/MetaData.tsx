import React, { Fragment, useState } from 'react';
import { FaRegClipboard } from 'react-icons/all';
import { copyToClipboard } from '../utils';
import CodeFormatter from './CodeFormatter';

type TabType = {
  label: string;
  data: string;
  language: string;
};

interface MetaDataType {
  tabs: TabType[];
}

type generateHeaderProps = {
  tabs: TabType[];
  activeTab: number;
  setActiveTab: (x: number) => void;
};

const generateHeader = ({
  tabs,
  activeTab,
  setActiveTab,
}: generateHeaderProps) => {
  const result = [];

  for (let index = 0; index < tabs.length; index++) {
    const element = tabs[index];

    result.push(
      <li className="mr-2" key={element.label}>
        <button
          onClick={() => setActiveTab(index)}
          type="button"
          className={`inline-block pl-0 p-4 rounded-t-lg ${
            activeTab === index ? 'text-primary font-semibold' : ''
          }`}
        >
          {element.label}
        </button>
      </li>,
    );
  }

  return result;
};

const MetaData = ({ tabs }: MetaDataType): JSX.Element => {
  console.log('tabs ', tabs);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section>
      <ul className="flex justify-start items-center flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 mt-4">
        <Fragment key="left">
          {generateHeader({ tabs, activeTab, setActiveTab })}
        </Fragment>

        <li className="ml-auto">
          <button
            onClick={() => copyToClipboard(tabs[activeTab].data)}
            type="button"
            className="inline-flex items-center p-4 rounded-t-lg text-black copy-icon font-semibold"
          >
            <FaRegClipboard size={16} className="mr-2 text-black " />
            Copy to clipboard
          </button>
        </li>
      </ul>

      <div className="mt-3">
        <div className="flex flex-col mt-2 rounded-md overflow-hidden">
          <CodeFormatter
            code={tabs[activeTab].data}
            language={tabs[activeTab].language}
          />
        </div>
      </div>
    </section>
  );
};

export default MetaData;
