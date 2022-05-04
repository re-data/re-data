import React from 'react';

type ToggleProps = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label1: string;
    label2: string;
}

function Toggle({ onChange, label1, label2 }: ToggleProps): JSX.Element {
  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="toggleB" className="flex items-center cursor-pointer">
        <div className="mr-3 text-gray-700 text-sm font-medium">{label1}</div>
        <div className="relative">
          <input
            type="checkbox"
            id="toggleB"
            className="sr-only sd"
            onChange={onChange}
          />
          <div className="block bg-gray-300 w-10 h-6 rounded-full" />
          <div className="dot absolute left-1 top-1 bg-primary w-4 h-4 rounded-full transition" />
        </div>
        <div className="ml-3 text-gray-700 text-sm font-medium">{label2}</div>
      </label>
    </div>
  );
}

export default Toggle;
