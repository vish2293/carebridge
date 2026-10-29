import { Button, DatePicker, Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import AssignCHWDropdown from "../../../components/common/AssignChwDropdown";
import RangeDateTime from "../../../components/common/RangeDateTime";
import ReportFilter from "../../../components/common/ReportFilter";
import { ClientVisitType } from "../../../constant/array";
import { getVisitReport } from "../../../redux/actions/report";
import { getChwOptions, getClientOptions } from "../../../redux/actions/user";
import { setActiveHeader } from "../../../redux/slices/headerSlice";
import VisitReportLists from "./VisitReportLists";
import dayjs from "dayjs";
import {
  disabledDate,
  getFullDateTime,
  getNumericDate,
} from "../../../helpers";
import "../style.scss";
import AdvanceFilter from "../../../components/common/AdvanceFilter";
import { pluseIcon } from "../../../assets/icons";
import { getVisitExport } from "../../../redux/actions/export";
import { VisitCounter } from "./Counters";

const VisitReport = () => {
  const dispatch = useDispatch();
  const {
    visitReportList,
    phoneCallCount,
    textCount,
    inPersonCount,
    emailCount,
    virtualCount,
    visitReportListCount,
    visitReportLoading,
  } = useSelector((state) => state.report);
  const { visitExportList } = useSelector((state) => state.exportCSV);
  const { clientOptions, loggedInUser, chwOptions } = useSelector(
    (state) => state.user
  );
  const [byVisitType, setByVisitType] = useState("");
  const [byCHW, setByCHW] = useState("");
  const [byClient, setByClient] = useState("");
  const [byVisitDate, setByVisitDate] = useState("");
  const [byDate, setByDate] = useState([]);
  const [byFollowUp, setByFollowUp] = useState("");
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [opeFilter, setOpenFilter] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleAPICall = (
    client,
    chw,
    visitType,
    date,
    visitdate,
    pageno,
    pagesize
  ) => {
    let payload = {
      filter: {
        client: client !== "None" && client !== "" ? client : "",
        assign_to: chw !== "None" && chw !== "" ? chw : "",
        visitType: visitType !== "None" && visitType !== "" ? visitType : "",
        fromDate: date && date.length > 0 && date !== "None" ? date[0] : "",
        toDate: date && date.length > 0 && date !== "None" ? date[1] : "",
        visitDate: visitdate,
      },
      pagination: {
        page: pageno,
        limit: pagesize,
      },
    };
    dispatch(getVisitExport({ payload: payload.filter }));
    dispatch(getVisitReport({ payload }));
    dispatch(getClientOptions({ search: "" }));
    dispatch(getChwOptions({ search: "" }));
    dispatch(setActiveHeader({ name: "visitReport", heading: "Visit Report" }));
  };

  useEffect(() => {
    handleAPICall(
      byClient,
      byCHW,
      byVisitType,
      byDate,
      byVisitDate,
      pageNo,
      pageSize
    );
  }, [pageNo, pageSize]);

  const csvHeaders = [
    { label: "No", key: "no" },
    { label: "Client Name", key: "clientName" },
    { label: "Assigned Community Health Worker", key: "chwName" },
    { label: "Visit Type", key: "visitType" },
    { label: "Visit Date", key: "visitDate" },
    { label: "Length of Visit", key: "lengthOfvisit" },
    { label: "Client Story", key: "clientStory" },
    { label: "Client Goal", key: "client_goal" },
    { label: "Follow up Date", key: "followupDate" },
    { label: "Follow up Reason", key: "followupReason" },
    { label: "Primary Need", key: "primaryNeed" },
    { label: "Pathways", key: "pathway" },
    { label: "Created Date", key: "createdAt" },
    { label: "Updated Date", key: "updatedAt" },
  ];

  useEffect(() => {
    let tempArr = [];
    if (visitExportList?.length > 0) {
      visitExportList?.forEach((item, index) => {
        let obj = { ...item };
        let subObj = {
          no: index + 1,
          key: obj?._id,
          clientId: obj?.clientId?._id,
          clientName: `${obj?.clientId?.firstName} ${obj?.clientId?.lastName}`,
          chwName: `${obj?.assign_to?.firstName} ${obj?.assign_to?.lastName}`,
          visitType: obj?.visitType ? obj?.visitType : "-",
          visitDate: obj?.visitDate ? getNumericDate(obj?.visitDate) : "-",
          lengthOfvisit: obj?.lengthOfvisit
            ? `${obj?.lengthOfvisit} ${obj?.lengthOfvisitUnit}`
            : "-",
          clientStory: obj?.clientStory ? obj?.clientStory : "-",
          client_goal: obj?.clientId?.client_goal
            ? obj?.clientId?.client_goal
            : "-",
          followupDate: obj?.followupDate
            ? getFullDateTime(obj?.followupDate)
            : "-",
          followupReason: obj?.followupReason ? obj?.followupReason : "-",
          pathway: obj?.pathway
            ? obj?.pathway.map((item) => item.name).join(", ")
            : "-",
          primaryNeed: obj?.primaryNeed
            ? obj?.primaryNeed.map((item) => item.name).join(", ")
            : "-",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
          updatedAt: obj?.updatedAt ? getNumericDate(obj?.updatedAt) : "-",
        };
        tempArr.push({ ...subObj });
      });
    }
    setExportData([...tempArr]);
  }, [visitExportList]);

  const handleFilterChange = (filterBy, value) => {
    const newValue = value === "none" ? "" : value;
    if (filterBy === "byCHW") {
      setByCHW(newValue);
    } else if (filterBy === "byDate") {
      setByDate(newValue);
    } else if (filterBy === "byClient") {
      setByClient(newValue);
    } else if (filterBy === "byVisitType") {
      setByVisitType(newValue);
    } else if (filterBy === "byVisitDate") {
      setByVisitDate(newValue);
    } else if (filterBy === "byFollowUp") {
      setByFollowUp(newValue);
    }
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

  const onFilter = async () => {
    handleAPICall(
      byClient,
      byCHW,
      byVisitType,
      byDate,
      byVisitDate,
      pageNo,
      pageSize
    );
    setPageNo(1);
    setPageSize(25);
  };

  const handleResetFilters = () => {
    setByClient("");
    setByCHW("");
    setByDate([]);
    setByVisitDate("");
    setByVisitType("");
    setByFollowUp("");
    form.resetFields();
    handleAPICall("", "", "", [], "", 1, 25);
    setPageNo(1);
    setPageSize(25);
  };

  const [form] = Form.useForm();
  const fileName = `${dayjs().format("Do MMMM YYYY")}- Visit Report.csv`;
  return (
    // <Spin spinning={visitReportLoading}>
    <div className="report_container">
      <div className="status-sec">
        <div className="status-sec-left">
          {/* <div className="dashboard-heading">All Visit Report</div> */}
        </div>
        <div className="status-sec-right">
          <div className="filter-sec">
            <Button
              onClick={handleResetFilters}
              disabled={
                !byClient &&
                !byCHW &&
                (!byDate || byDate.length === 0) &&
                !byFollowUp &&
                !byVisitType &&
                !byVisitDate
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
            <Button icon={pluseIcon} onClick={() => setOpenFilter(true)}>
              Advance filter
            </Button>
            <Button
              type="primary"
              className="yellow-btn"
              onClick={onFilter}
              //   disabled={
              //     !byClient &&
              //     !byCHW &&
              //     (!byDate || byDate.length === 0) &&
              //     !byFollowUp &&
              //     !byVisitType &&
              //     !byVisitDate
              //   }
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
                disabled={!visitExportList.length}
              >
                Export CSV
              </Button>
            </CSVLink>
          </div>
        </div>
        {opeFilter && (
          <div className="advanced_filter_form">
            <AdvanceFilter
              setOpenFilter={setOpenFilter}
              handleFilterChange={handleFilterChange}
              handleResetFilters={handleResetFilters}
              handleSearch={handleSearch}
              onFilter={onFilter}
              byVisitType={byVisitType}
              byVisitDate={byVisitDate}
              clientOptions={clientOptions}
              byFollowUp={byFollowUp}
              chwOptions={chwOptions}
              filter={"visit"}
              form={form}
            />
          </div>
        )}
      </div>
      <VisitCounter
        phoneCallCount={phoneCallCount}
        textCount={textCount}
        inPersonCount={inPersonCount}
        emailCount={emailCount}
        virtualCount={virtualCount}
      />
      <div className="dashboard_table_wrapper">
        <VisitReportLists
          visitReportList={visitReportList}
          loading={visitReportLoading}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
          visitReportListCount={visitReportListCount}
        />
      </div>
    </div>
    // </Spin>
  );
};

export default VisitReport;
