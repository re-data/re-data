import React, {
  FC, ReactElement, useContext, useEffect, useState,
} from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaRegClipboard } from 'react-icons/all';
import { Select } from '../components';
import {
  OverviewData, RedataOverviewContext, SelectOptionProps,
} from '../contexts/redataOverviewContext';
import { CodeFormatter } from '../partials';
import { copyToClipboard } from '../utils';

const Macros: FC = (): ReactElement => {
  const overview: OverviewData = useContext(RedataOverviewContext);

  const [, setURLSearchParams] = useSearchParams();
  const [searchParams] = useSearchParams();

  const {
    loading, macros,
    macrosOptions,
    macroModelDepends,
  } = overview;

  const [macroDetails, setMacroDetails] = useState<Record<string, string>>();
  const [optionValue, setOptionValue] = useState<SelectOptionProps | null>();

  const macro = searchParams.get('macro') as string;

  useEffect(() => {
    if (macro && macros && !overview.loading) {
      setOptionValue({
        value: macro,
        label: macro,
      });
      setMacroDetails(macros[macro] as unknown as Record<string, string>);
    }
  }, [!overview.loading]);

  const handleChange = (option: SelectOptionProps | null) => {
    if (option && macros) {
      const mac = option.value as string;
      setOptionValue({
        value: mac,
        label: mac,
      });
      setMacroDetails(macros[mac] as unknown as Record<string, string>);
      setURLSearchParams({ macro: mac });
    }
  };

  // console.log('macros loaded => ', macros, options);
  // console.log('macroModelDepends => ', macroModelDepends, macroModelDepends?.[macro], macro);

  return (
    <>
      {loading ? <p>Loading...</p> : (
        <>
          <section className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">
              Macro
            </h1>
            <div>
              <div className="md:w-1/3 w-full ml-1">
                <Select
                  value={optionValue}
                  options={macrosOptions || []}
                  handleChange={handleChange}
                  placeholder="Macro Name"
                />
              </div>
            </div>
          </section>

          {macroDetails?.macro_sql && (
            <section className="bg-white rounded-md px-3 pt-4 pb-10 mb-6">
              <ul className="flex justify-between items-center flex-wrap text-sm font-medium border-b border-gray-200">
                <li>
                  <h4 className="font-bold text-xl">Code</h4>
                </li>

                <li className="flex-end">
                  <button
                    onClick={() => copyToClipboard(macroDetails.macro_sql)}
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

              <div className="mt-3">
                <div className="flex flex-col mt-2 rounded-md overflow-hidden">
                  <CodeFormatter
                    code={macroDetails.macro_sql.trim()}
                    language="sql"
                  />
                </div>
              </div>
            </section>
          )}

          {macroModelDepends?.[macro] && (
          <section className="bg-white rounded-md px-3 pt-4 pb-10 mb-6">
            <h4 className="font-bold text-xl">Used in</h4>
            <div className="mt-3">
              <div className="flex flex-col mt-2 rounded-md overflow-hidden">
                <ul
                  className="marker:text-sky-400 space-y-3 text-slate-400"
                >
                  {macroModelDepends?.[macro]?.map((table) => (
                    <li
                      className="text-sm mb-1 font-semibold text-primary"
                      key={table}
                    >
                      {table.includes('re_data') ? (
                        <>
                          {table}
                        </>
                      ) : (
                        <Link to={`/tables?model=${table}`}>{table}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          )}
        </>
      )}
    </>
  );
};

export default Macros;
