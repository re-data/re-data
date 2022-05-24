import React, { FC, ReactElement } from 'react';

const Settings: FC = (): ReactElement => {
  console.log('settings screen');
  return (
    <section className="border border-red-500 h-full w-full">
      <h2 className="mb-8 text-2xl font-bold">Settings</h2>
      <div className="grid grid-cols-6 gap-4 border border-red-500">
        <aside className="border border-red-500 p-4 pl-0 rounded-md bg-white shadow-lg">
          <ul>
            <li className="text-sm font-medium p-1 pl-0 mb-2">
              <a href="./id">Re_data</a>
            </li>
            <li className="text-sm font-medium p-1 pl-0 mb-2">
              <a href="./id">DBT</a>
            </li>
          </ul>
        </aside>
        <div className="col-span-5 border border-red-500 bg-white rounded-md p-4 shadow-lg">
          <p>Settings screen</p>
        </div>
      </div>
    </section>
  );
};

export default Settings;
