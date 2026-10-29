/* eslint-disable react/prop-types */
import { Select } from "antd";

const Filter = ({ placeholder, options, handleOnChange, filterBy, values }) => {

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onFilterChange = (value) => {
    handleOnChange(filterBy, value)
  }
  return (
    <Select
      showSearch
      options={options}
      value={values}
      optionFilterProp="children"
      filterOption={filterOption}
      onChange={(value) => onFilterChange(value)}
      placeholder={placeholder}
    />
  );
};

export default Filter;
