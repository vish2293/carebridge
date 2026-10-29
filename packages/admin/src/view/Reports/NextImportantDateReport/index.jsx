import { Button, DatePicker, Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import RangeDateTime from "../../../components/common/RangeDateTime";
import { requestTaskByCHW } from "../../../redux/actions/todo";
import { setActiveHeader } from "../../../redux/slices/headerSlice";
import { getImportantDateReport } from "../../../redux/actions/report";
import { disabledDate, getNumericDate } from "../../../helpers";
import ReportFilter from "../../../components/common/ReportFilter";
import { TaskStatusOptions, filterQuestion } from "../../../constant/array";
import { getChwOptions, getClientOptions } from "../../../redux/actions/user";
import AssignCHWDropdown from "../../../components/common/AssignChwDropdown";
import dayjs from "dayjs";
import NextImportantLists from "./NextImportantLists";
import { pluseIcon } from "../../../assets/icons";
import AdvanceFilter from "../../../components/common/AdvanceFilter";
import "../style.scss";
import { getImportantDateExport } from "../../../redux/actions/export";
import { NextImportantDatesCounters } from "./Counters";
import { getAllNeedOrCategory } from "../../../redux/actions/visit";

const NextImportantDateReport = () => {
  const {
    importantList,
    pendingTodoCount,
    overdueTodoCount,
    completedTodoCount,
    inProgressTodoCount,
    importantLoading,
    importantListCount,
  } = useSelector((state) => state.report);
  const { importantDateExportList } = useSelector((state) => state.exportCSV);
  const { clientOptions, loggedInUser, chwOptions } = useSelector(
    (state) => state.user
  );
  const { needOrCategoryOptions } = useSelector((state) => state.visit);
  const [importantLists, setImportantLits] = useState([]);
  const [importantExportLists, setImportantExportLits] = useState([]);
  const [exportData, setExportData] = useState([]);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [byStatus, setByStatus] = useState("");
  const [byCHW, setByCHW] = useState("");
  const [byClient, setByClient] = useState("");
  const [byDueDate, setByDueDate] = useState("");
  const [byCategory, setByCategory] = useState("");
  const [byDate, setByDate] = useState([]);
  const [opeFilter, setOpenFilter] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleAPICall = (
    client,
    chw,
    category,
    duedate,
    date,
    status,
    pageno,
    pagesize
  ) => {
    let payload = {
      filter: {
        client: client !== "" && client !== "None" ? client : "",
        assign_to: chw !== "None" && chw !== "" ? chw : "",
        category: category !== "None" && category !== "" ? category : "",
        fromDate: date && date.length > 0 && date !== "None" ? date[0] : "",
        toDate: date && date.length > 0 && date !== "None" ? date[1] : "",
        dueDate: duedate,
        status: status !== "None" && status !== "" ? status : "",
      },
      pagination: {
        page: pageno,
        limit: pagesize,
      },
    };
    dispatch(getImportantDateExport({ payload: payload.filter }));
    dispatch(getImportantDateReport({ payload }));
    dispatch(getClientOptions({ search: "" }));
    dispatch(getChwOptions({ search: "" }));
    dispatch(
      setActiveHeader({
        name: "nextImportantDateReport",
        heading: "Next Important Date Report",
      })
    );
  };

  useEffect(() => {
    handleAPICall(
      byClient,
      byCHW,
      byCategory,
      byDueDate,
      byDate,
      byStatus,
      pageNo,
      pageSize
    );
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (importantList) {
      setImportantExportLits(importantDateExportList);
      setImportantLits(importantList);
    } else {
      setImportantLits([]);
      setImportantExportLits([]);
    }
  }, [importantList]);

  const csvHeaders = [
    { label: "No", key: "no" },
    { label: "Client Name", key: "clientName" },
    { label: "Assigned Community Health Worker", key: "chwAssigned" },
    { label: "Category", key: "category" },
    { label: "Reason", key: "reason" },
    { label: "Status", key: "status" },
    { label: "Due Date", key: "dueDate" },
    { label: "Created Date", key: "createdAt" },
    { label: "Updated Date", key: "updatedAt" },
  ];

  useEffect(() => {
    let tempData = [];
    if (importantExportLists?.length > 0) {
      importantExportLists?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          clientName: `${obj?.clientId?.firstName} ${obj?.clientId?.lastName}`,
          chwAssigned: `${obj?.visitId?.assign_to?.firstName} ${obj?.visitId?.assign_to?.lastName}`,
          category: obj?.task?.category[0]?.name,
          reason: obj?.task?.task_name,
          status: obj?.task?.status,
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
          updatedAt: obj?.updatedAt ? getNumericDate(obj?.updatedAt) : "-",
          dueDate: obj?.dueDate ? getNumericDate(obj?.dueDate) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setExportData([...tempData]);
  }, [importantExportLists]);

  useEffect(() => {
    dispatch(getAllNeedOrCategory());
  }, []);

  const handleFilterChange = (filterBy, value) => {
    const newValue = value === "none" ? "" : value;
    if (filterBy === "byStatus") {
      setByStatus(newValue);
    } else if (filterBy === "byCHW") {
      setByCHW(newValue);
    } else if (filterBy === "byZipcode") {
      setByZipcode(newValue);
    } else if (filterBy === "byDate") {
      setByDate(newValue);
    } else if (filterBy === "byClient") {
      setByClient(newValue);
    } else if (filterBy === "byCategory") {
      setByCategory(newValue);
    } else if (filterBy === "byDueDate") {
      setByDueDate(newValue);
    }
  };

  const onFilter = async () => {
    handleAPICall(
      byClient,
      byCHW,
      byCategory,
      byDueDate,
      byDate,
      byStatus,
      pageNo,
      pageSize
    );
    setPageNo(1);
    setPageSize(25);
  };

  const handleSearch = (searchBy, value) => {
    if (searchBy === "byClient") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getClientOptions({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    } else if (searchBy === "byCHW") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getChwOptions({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    }
  };

  const handleResetFilters = () => {
    setByClient("");
    setByStatus("");
    setByCHW("");
    setByDate([]);
    setByCategory("");
    form.resetFields();
    handleAPICall("", "", "", "", [], "", 1, 25);
    setPageNo(1);
    setPageSize(25);
  };

  const [form] = Form.useForm();
  const fileName = `${dayjs().format(
    "Do MMMM YYYY"
  )}- Next Important Date Report.csv`;

  return (
    // <Spin spinning={importantLoading}>
    <div className="report_container">
      <div className="status-sec">
        <div className="status-sec-left">
          {/* <div className="dashboard-heading">All Next Important Date</div> */}
        </div>
        <div className="status-sec-right">
          <div className="filter-sec">
            <Button
              onClick={handleResetFilters}
              disabled={
                !byClient &&
                !byCHW &&
                !byStatus &&
                (!byDate || byDate.length === 0) &&
                !byCategory &&
                !byDueDate
              }
            >
              Clear Filter
            </Button>

            <ReportFilter
              options={[{ label: "None", value: "none" }, ...clientOptions]}
              filterValue={byClient}
              filterBy={"byClient"}
              placeholder={"Select client"}
              label={"Select client"}
              handleFilterChange={handleFilterChange}
              handleSearch={handleSearch}
            />
            {loggedInUser?.role === "Program_Administrator" && (
              <ReportFilter
                options={[{ label: "None", value: "none" }, ...chwOptions]}
                filterValue={byCHW}
                filterBy={"byCHW"}
                placeholder={"Select Community Health Worker"}
                label={"Select Community Health Worker"}
                handleFilterChange={handleFilterChange}
                handleSearch={handleSearch}
              />
            )}
            <ReportFilter
              options={[{ label: "None", value: "none" }, ...TaskStatusOptions]}
              filterValue={byStatus}
              filterBy={"byStatus"}
              placeholder={"Select status"}
              label={"Select status"}
              handleFilterChange={handleFilterChange}
              handleSearch={handleSearch}
            />
            <Button icon={pluseIcon} onClick={() => setOpenFilter(true)}>
              Advance filter
            </Button>
            <Button
              type="primary"
              className="yellow-btn"
              onClick={onFilter}
            >
              {" "}
              Filter
            </Button>
            <CSVLink
              data={exportData}
              headers={csvHeaders}
              filename={fileName}
              className="ant-btn ant-btn-primary"
            >
              <Button
                type="primary"
                className="yellow-btn"
                disabled={!importantDateExportList.length}
              >
                Export CSV
              </Button>
            </CSVLink>
          </div>
        </div>
        {opeFilter && (
          <div className="advanced_filter_form">
            <AdvanceFilter
              handleFilterChange={handleFilterChange}
              handleResetFilters={handleResetFilters}
              handleSearch={handleSearch}
              onFilter={onFilter}
              chwOptions={chwOptions}
              setOpenFilter={setOpenFilter}
              byClient={byClient}
              statusOption={TaskStatusOptions}
              clientOptions={clientOptions}
              byCategory={byCategory}
              byDueDate={byDueDate}
              nextImportantDateCategory={needOrCategoryOptions}
              filter={"nextImportant"}
              form={form}
            />
          </div>
        )}
      </div>
      <NextImportantDatesCounters
        pendingTodoCount={pendingTodoCount}
        inProgressTodoCount={inProgressTodoCount}
        completedTodoCount={completedTodoCount}
        overdueTodoCount={overdueTodoCount}
      />
      <div className="dashboard_table_wrapper">
        <NextImportantLists
          importantLists={importantLists}
          loading={importantLoading}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
          importantListCount={importantListCount}
        />
      </div>
    </div>
    // </Spin>
  );
};

export default NextImportantDateReport;
