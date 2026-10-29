import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import Search from "../../components/common/Search";
import { getAllVisit } from "../../redux/actions/visit";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import VisitTable from "./VisitTable";
import { Button } from "antd";

const Visits = () => {
  const { visitList, visitLoading, visitListCount } = useSelector(
    (state) => state.visit
  );
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    let payload = {
      search: search,
      pagination: {
        page: pageNo || 1,
        limit: pageSize || 25,
      },
    };
    dispatch(getAllVisit(payload));
    localStorage.setItem("prevUrl", window.location.pathname);
    dispatch(setActiveHeader({ name: "visits", heading: "Visits" }));
  }, [pageNo, pageSize]);

  const handleSearch = (value) => {
    let payload = {
      search: value,
      pagination: {
        page: 1,
        limit: 25,
      },
    };
    setSearch(value);
    clearTimeout(debounceTimeout);
    const time = setTimeout(() => {
      dispatch(getAllVisit(payload));
    }, 500);
    setPageNo(1);
    setPageSize(25);
    setDebounceTimeout(time);
  };

  const handleResetFilters = () => {
    setSearch("");
    handleSearch("");
    window.history.replaceState({}, "", window.location.pathname);
  };

  return visitLoading ? (
    <Loader className={"page-loader"} />
  ) : (
    <div className="">
      <div className="status-sec">
        <div className="status-sec-left">
          <div className="dashboard-heading">All Visits</div>
        </div>
        <div className="status-sec-right">
          <Button onClick={handleResetFilters} disabled={!search}>
            Clear Search
          </Button>
          <Search
            value={search}
            handleOnChangeSearch={handleSearch}
            placeholder={"Search visits"}
          />
        </div>
      </div>
      <div className="dashboard_table_wrapper">
        <VisitTable
          visitList={visitList}
          loading={visitLoading}
          visitListCount={visitListCount}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
};
export default Visits;
