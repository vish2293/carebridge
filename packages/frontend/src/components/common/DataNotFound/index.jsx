import { emptyDataIcon } from "../../../assets/icons";

const DataNotfound = () => {
  return (
    <div className="placehoder">
      <span>{emptyDataIcon}</span>
      <span>No Data </span>
    </div>
  );
};
export default DataNotfound;
