/* eslint-disable react/prop-types */
import { Input } from "antd";
const Search = ({ handleOnChangeSearch, value, placeholder }) => {

  return (
    <div className='custom-search'>
      <Input.Search
        value={value}
        onChange={(e) => handleOnChangeSearch(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Search;
