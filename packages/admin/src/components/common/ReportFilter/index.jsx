import { Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  getClientOptions,
  getResourceOptions,
  getZipCodeOptions,
} from "../../../redux/actions/user";

const ReportFilter = ({
  options,
  label,
  placeholder,
  filterValue,
  filterBy,
  handleFilterChange,
  handleSearch,
  setZipCode,
  setByClient,
  setCategory,
  setStatus,
  setVisitType,
  setByValue,
  setByType,
  setByResource,
}) => {
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const dispatch = useDispatch();

  // const handleOnSearch = (value) => {
  //     if (setZipCode) {
  //         clearTimeout(debounceTimeout);
  //         const time = setTimeout(() => {
  //             dispatch(getZipCodeOptions({ search: value }))
  //         }, 500);
  //         setDebounceTimeout(time);

  //     } else if (setByClient) {
  //         clearTimeout(debounceTimeout);
  //         const time = setTimeout(() => {
  //             dispatch(getClientOptions({ search: value }))
  //         }, 500);
  //         setDebounceTimeout(time);
  //     } else if (setByResource) {
  //         clearTimeout(debounceTimeout);
  //         const time = setTimeout(() => {
  //             dispatch(getResourceOptions({ payload: { search: value } }))
  //         }, 500);
  //         setDebounceTimeout(time);
  //     }
  // }

  const handleOnChange = (value) => {
    if (setByClient) {
      setByClient(value);
    } else if (setZipCode) {
      setZipCode(value);
    } else if (setCategory) {
      setCategory(value);
    } else if (setStatus) {
      setStatus(value);
    } else if (setVisitType) {
      setVisitType(value);
    } else if (setByValue) {
      setByValue(value);
    } else if (setByType) {
      setByType(value);
    } else if (setByResource) {
      setByResource(value);
    }
  };

  const handleClear = () => {
    if (setByClient) {
      dispatch(getClientOptions({ search: "" }));
    } else if (setZipCode) {
      dispatch(getZipCodeOptions({ search: "" }));
    } else if (setByResource) {
      dispatch(getResourceOptions({ payload: { search: "" } }));
    }
  };

  return (
    <div className="filter-label" style={{ width: "200px" }}>
      <label>{label}</label>
      <Select
        value={filterValue || null}
        options={options}
        onChange={(value) => handleFilterChange(filterBy, value)}
        showSearch
        onSearch={(value) => handleSearch(filterBy, value)}
        filterOption={false}
        placeholder={placeholder}
        popupMatchSelectWidth={false}
        style={{ width: "100%" }}
      />
    </div>
  );
};
export default ReportFilter;
