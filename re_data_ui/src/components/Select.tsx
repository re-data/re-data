import React, { memo } from 'react';
import Select from 'react-select';

type optionsProps = {
    value: string;
    label: string;
}

interface selectProps {
    options: optionsProps[];
    placeholder: string;
    handleChange: (option: optionsProps | null) => void;
}

const SelectInput = memo(
  ({ options, placeholder, handleChange }:selectProps) => (
    <Select
      options={options}
      isClearable
      isSearchable
      placeholder={placeholder}
      onChange={handleChange}
    />
  ),
);

export default SelectInput;
