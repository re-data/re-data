import React from 'react';

export type TableSelectProps = {
    options: string[];
    placeholder: string;
    value?: string;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    showOptionLabel?: boolean;
  };

function TableSelect({
  options,
  placeholder,
  value,
  handleChange,
  showOptionLabel = true,
}: TableSelectProps): JSX.Element {
  return (
    <select
      className="form-select block w-1/4 px-2 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:shadow-none focus:primary focus:outline-none"
      aria-label="Upload options"
      onChange={handleChange}
      value={value}
    >
      {showOptionLabel && <option value="" selected disabled>{placeholder}</option>}
      {options.map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default TableSelect;
