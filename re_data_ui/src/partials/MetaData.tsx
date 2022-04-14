import React, { Fragment, useState } from 'react';
import { format } from 'sql-formatter';
import { FaRegClipboard } from 'react-icons/all';
import CodeFormatter from './CodeFormatter';
import { copyToClipboard } from '../utils';

type MetaDataType = {
    failuresJson: string | undefined;
    compiledSql: string | undefined;
}

const MetaData = ({ failuresJson, compiledSql }: MetaDataType): JSX.Element => {
  const [activeTab, setActiveTab] = useState(failuresJson ? 'failures_json' : 'compiled_sql');

  const failuresJsonCode = failuresJson && JSON.stringify(JSON.parse(failuresJson.trim()), null, 2);
  const compiledSqlCode = compiledSql && format(compiledSql.trim());

  return (
    <section>
      {(failuresJson || compiledSql) && (
        <>
          <ul className="flex justify-between items-center flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 mt-4">
            <Fragment key="left">
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
            </Fragment>

            <li className="flex-end">
              <button
                onClick={() => copyToClipboard(
                  activeTab === 'failures_json' ? failuresJsonCode : compiledSqlCode,
                )}
                type="button"
                className="inline-flex items-center p-4 rounded-t-lg text-black copy-icon font-semibold"
              >
                <FaRegClipboard
                  size={16}
                  className="mr-2 text-black "
                />
                Copy to clipboard
              </button>
            </li>
          </ul>

          {activeTab === 'failures_json' && failuresJson && (
          <div className="mt-3">
            <div className="flex flex-col mt-2 rounded-md overflow-hidden">
              <CodeFormatter
                code={failuresJsonCode}
                language="json"
              />
            </div>
          </div>
          )}

          {activeTab === 'compiled_sql' && compiledSql && (
          <div className="mt-3">
            <div className="flex flex-col rounded-md overflow-hidden relative">
              <CodeFormatter
                code={compiledSqlCode}
                language="sql"
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
