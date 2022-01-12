import React, { memo } from 'react';
import Select from 'react-select';

export type optionsProps = {
  value: string;
  label: string;
}

export interface selectProps {
    value?: optionsProps | null;
    options: optionsProps[];
    placeholder: string;
    handleChange: (option: optionsProps | null) => void;
}

const SelectInput = memo(
  ({
    options, placeholder, handleChange, value,
  }: selectProps) => (
    <Select
      options={options}
      isClearable
      isSearchable
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
    />
  ),
);

export default SelectInput;
