import React, { ReactElement } from 'react';
import Select from 'react-select';

interface optionsProps {
  value: string;
  label: string;
}

export interface selectProps {
    value?: optionsProps | null;
    options: optionsProps[];
    placeholder: string;
    handleChange: (option: optionsProps | null) => void;
}

function SelectInput(params: selectProps): ReactElement {
  const {
    options, placeholder, handleChange, value,
  } = params;
  return (
    <Select
      options={options}
      isClearable
      isSearchable
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
    />
  );
}

export default SelectInput;
