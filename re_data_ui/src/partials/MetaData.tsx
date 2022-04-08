import React, { useState } from 'react';
import { format } from 'sql-formatter';
import { FaRegClipboard } from 'react-icons/all';
import CodeFormatter from './CodeFormatter';

type MetaDataType = {
    failuresJson: string | undefined;
    compiledSql: string | undefined;
}

const MetaData = ({ failuresJson, compiledSql }: MetaDataType): JSX.Element => {
  const [activeTab, setActiveTab] = useState(failuresJson ? 'failures_json' : 'compiled_sql');

  const failuresJsonCode = failuresJson && JSON.stringify(JSON.parse(failuresJson.trim()), null, 2);
  const compiledSqlCode = compiledSql && format(compiledSql.trim());

  const copyToClipboard = (text?: string) => navigator.clipboard.writeText(text || '');

  return (
    <section>
      {(failuresJson || compiledSql) && (
        <>
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 mt-4">
            {failuresJson && (
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('failures_json')}
                type="button"
                className={`inline-block pl-0 p-4 rounded-t-lg ${activeTab === 'failures_json' ? 'text-primary font-semibold' : ''}`}
              >
                Failure Json
              </button>
            </li>
            )}

            {compiledSql && (
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('compiled_sql')}
                type="button"
                className={`inline-block pl-0 p-4 rounded-t-lg ${activeTab === 'compiled_sql' ? 'text-primary font-semibold' : ''}`}
              >
                Compiled SQL
              </button>
            </li>
            )}

          </ul>
          {activeTab === 'failures_json' && failuresJson && (
          <div className="mt-5">
            <h6 className="font-semibold">Failures Json</h6>
            <div className="flex flex-col mt-2 rounded-md overflow-hidden">
              <CodeFormatter
                code={failuresJsonCode}
                language="json"
              />

              <FaRegClipboard
                size={16}
                color="white"
                onClick={() => copyToClipboard(failuresJsonCode)}
                className="absolute right-2 bottom-2 cursor-pointer copy-icon"
              />
            </div>
          </div>
          )}

          {activeTab === 'compiled_sql' && compiledSql && (
          <div className="mt-5">
            <h6 className="font-semibold">Compiled SQL</h6>
            <div className="flex flex-col mt-2 rounded-md overflow-hidden relative">
              <CodeFormatter
                code={compiledSqlCode}
                language="sql"
              />
              <FaRegClipboard
                size={16}
                color="white"
                onClick={() => copyToClipboard(compiledSqlCode)}
                className="absolute right-2 bottom-2 cursor-pointer copy-icon"
              />
            </div>
          </div>
          )}
        </>
      )}
    </section>
  );
};

export default MetaData;
