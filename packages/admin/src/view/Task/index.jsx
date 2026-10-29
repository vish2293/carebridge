import { Button, Tabs } from "antd";
import TaskLists from "./TaskLists";
import RequestLists from "./RequestList";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllRequest } from "../../redux/actions/request";
import { calenderTodo } from "../../redux/actions/todo";
import { useSelector } from "react-redux";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import Search from "../../components/common/Search";
import Filter from "../../components/common/Filter";
import { RequestStatus, TaskStatusOptions } from "../../constant/array";
import Loader from "../../components/common/Loader";

const Task = () => {
  const { calendarTodoList, calendarTaskLoading, calendarTodoListCount } =
    useSelector((state) => state.todo);
  const { requestLoading, requestList, totalRequestCount } = useSelector(
    (state) => state.request
  );
  const dispatch = useDispatch();
  const [taskLists, setTaskLists] = useState([]);
  const [requestLists, setRequestLists] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [placeholder, setPlaceHolder] = useState("Search next step by client");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    let payload = {
      filter: { search: "", status: "" },
      pagination: { page: pageNo || 1, limit: pageSize || 25 },
    };
    dispatch(getAllRequest(payload));
    dispatch(calenderTodo(payload));
    dispatch(setActiveHeader({ name: "todo", heading: "All Next steps" }));
    localStorage.setItem("prevUrl", window.location.pathname);
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (calendarTodoList?.length > 0) {
      setTaskLists(calendarTodoList);
    } else {
      setTaskLists([]);
    }
  }, [calendarTodoList]);

  useEffect(() => {
    if (requestList?.length > 0) {
      setRequestLists(requestList);
    } else {
      setRequestLists(requestList);
    }
  }, [requestList]);

  const handleStatusChange = (filterBy, value) => {
    const newValue = value === "none" ? "" : value;
    let pagination = {
      page: 1,
      limit: 25,
    };
    if (filterBy === "status") {
      setStatus(newValue);

      clearTimeout(debounceTimeout);
      const newTimeout = setTimeout(() => {
        let payload = {
          filter: { search: search, status: newValue },
          pagination: pagination,
        };
        if (Number(activeTab) === 1) {
          dispatch(calenderTodo(payload));
        } else if (Number(activeTab) === 2) {
          dispatch(getAllRequest(payload));
        }
      }, 500); // 500ms delay
      setPageNo(1);
      setPageSize(25);
      setDebounceTimeout(newTimeout);
    }
  };

  const handleSearch = (value) => {
    let pagination = {
      page: 1,
      limit: 25,
    };
    setSearch(value);
    clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(() => {
      let payload = {
        filter: { search: search, status: status },
        pagination: pagination,
      };
      if (Number(activeTab) === 1) {
        dispatch(calenderTodo(payload));
      } else if (Number(activeTab) === 2) {
        dispatch(getAllRequest(payload));
      }
    }, 500);
    setPageNo(1);
    setPageSize(25); // 500ms delay
    setDebounceTimeout(newTimeout);
  };

  const clearFilter = () => {
    setSearch("");
    setStatus("");
    let payload = {
      filter: { search: "", status: "" },
      pagination: { page: pageNo || 1, limit: pageSize || 25 },
    };
    if (Number(activeTab) === 1) {
      dispatch(calenderTodo(payload));
    } else if (Number(activeTab) === 2) {
      dispatch(getAllRequest(payload));
    }
  };

  const items = [
    {
      key: "1",
      label: "Important Dates",
      children: (
        <TaskLists
          loading={calendarTaskLoading}
          taskLists={taskLists}
          calendarTodoListCount={calendarTodoListCount}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
        />
      ),
    },
    {
      key: "2",
      label: "Action Steps",
      children: (
        <RequestLists
          loading={requestLoading}
          requestLists={requestLists}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
          totalRequestCount={totalRequestCount}
        />
      ),
    },
  ];

  const handleTabChange = (key) => {
    setPageNo(1);
    clearFilter();
    setActiveTab(key);
    if (Number(key) === 1) {
      setPlaceHolder("Search next step by client");
      // dispatch(calenderTodo())
    } else if (Number(key) === 2) {
      setPlaceHolder("Search request by client");
      // dispatch(getAllRequest())
    }
  };

  return calendarTaskLoading || requestLoading ? (
    <Loader className={"page-loader"} />
  ) : (
    <div className="user_wrapper">
      <div className="status-sec next-steps">
        <div className="status-sec-left"></div>
        <div className="status-sec-right">
          <Button onClick={clearFilter} disabled={!search && !status}>
            Clear Filter
          </Button>
          <Search
            value={search}
            placeholder={placeholder}
            handleOnChangeSearch={handleSearch}
          />
          <Filter
            values={status || null}
            placeholder={"Please select status"}
            options={[
              { label: "None", value: "none" },
              ...(+activeTab === 1 ? TaskStatusOptions : RequestStatus),
            ]}
            handleOnChange={handleStatusChange}
            filterBy={"status"}
          />
        </div>
      </div>
      <div className="user_table_wrapper">
        <Tabs items={items} onChange={handleTabChange} activeKey={activeTab} />
      </div>
    </div>
  );
};
export default Task;
