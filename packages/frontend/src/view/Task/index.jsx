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
  const [taskPagination, setTaskPagination] = useState({
    pageNo: 1,
    pageSize: 25,
  });
  const [requestPagination, setRequestPagination] = useState({
    pageNo: 1,
    pageSize: 25,
  });

  useEffect(() => {
    const { pageNo, pageSize } =
      activeTab === "1" ? taskPagination : requestPagination;

    let payload = {
      filter: { search: search, status: status },
      pagination: { page: pageNo || 1, limit: pageSize || 25 },
    };

    dispatch(getAllRequest(payload));
    dispatch(calenderTodo(payload));
    dispatch(setActiveHeader({ name: "todo", heading: "All Next steps" }));
    localStorage.setItem("prevUrl", window.location.pathname);
  }, [taskPagination.pageNo, requestPagination.pageNo]);

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
    const { pageNo, pageSize } =
      activeTab === "1" ? taskPagination : requestPagination;
    let pagination = {
      page: pageNo,
      limit: pageSize,
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
      setDebounceTimeout(newTimeout);
    }
  };

  const handleSearch = (value) => {
    const defaultPageSize =
      activeTab === "1" ? taskPagination.pageSize : requestPagination.pageSize;

    let pagination = {
      page: 1,
      limit: defaultPageSize,
    };

    setSearch(value);
    clearTimeout(debounceTimeout);

    const newTimeout = setTimeout(() => {
      let payload = {
        filter: { search: value, status: status },
        pagination: pagination,
      };

      if (Number(activeTab) === 1) {
        setTaskPagination({ pageNo: 1, pageSize: defaultPageSize });
        dispatch(calenderTodo(payload));
      } else if (Number(activeTab) === 2) {
        setRequestPagination({ pageNo: 1, pageSize: defaultPageSize });
        dispatch(getAllRequest(payload));
      }
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  const clearFilter = () => {
    setSearch("");
    setStatus("");
    const { pageNo, pageSize } =
      activeTab === "1" ? taskPagination : requestPagination;
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

  const fetchTasks = (pagination) => {
    const payload = {
      filter: { search, status },
      pagination: { page: pagination.pageNo, limit: pagination.pageSize },
    };
    dispatch(calenderTodo(payload));
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
          pageNo={taskPagination.pageNo}
          pageSize={taskPagination.pageSize}
          setPageNo={(page) => {
            setTaskPagination((prev) => {
              const updated = { ...prev, pageNo: page };
              fetchTasks(updated);
              return updated;
            });
          }}
          setPageSize={(size) => {
            setTaskPagination((prev) => {
              const updated = { ...prev, pageSize: size };
              fetchTasks(updated);
              return updated;
            });
          }}
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
          pageNo={requestPagination.pageNo}
          pageSize={requestPagination.pageSize}
          setPageNo={(page) =>
            setRequestPagination({ ...requestPagination, pageNo: page })
          }
          setPageSize={(size) =>
            setRequestPagination({ ...requestPagination, pageSize: size })
          }
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
            placeholder={"Select status"}
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
