/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  FC, ReactElement,
} from 'react';
import { Select } from '../components';

const Macros: FC = (): ReactElement => {
  const handleChange = (e: any) => console.log(e);

  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">
          Macro
        </h1>
        <div>
          <div className="md:w-1/3 w-full ml-1">
            <Select
            //   value={optionValue}
              options={[]}
              handleChange={handleChange}
              placeholder="Macro Name"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-md px-3 pt-4 pb-10">
        <div className="flex items-center justify-between mt-2">
          <h4 className="font-bold text-xl">Code</h4>

        </div>

      </section>
    </>
  );
};

export default Macros;
