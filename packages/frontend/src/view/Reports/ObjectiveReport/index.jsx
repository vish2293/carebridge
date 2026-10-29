import { Button, Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { pluseIcon } from "../../../assets/icons";
import AdvanceFilter from "../../../components/common/AdvanceFilter";
import ReportFilter from "../../../components/common/ReportFilter";
import { getNumericDate } from "../../../helpers";
import { getObjectiveValues } from "../../../helpers/objectiveValue";
import { getObjectiveReport } from "../../../redux/actions/report";
import { getClientOptions } from "../../../redux/actions/user";
import { setActiveHeader } from "../../../redux/slices/headerSlice";
import "../style.scss";
import ObjectiveReportList from "./ObjectiveReportList";
import dayjs from "dayjs";
import { getObjectiveExport } from "../../../redux/actions/export";
import { ObjectiveCounters } from "./Counters";

const ObjectiveReport = () => {
  const dispatch = useDispatch();
  const { clientOptions, loggedInUser } = useSelector((state) => state.user);
  const {
    objectiveReportList,
    mostunstable,
    moststable,
    objectiveReportLoading,
    objectiveReportListCount,
  } = useSelector((state) => state.report);
  const { objectiveExportList } = useSelector((state) => state.exportCSV);
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [byClient, setByClient] = useState("");
  const [byType, setByType] = useState("");
  const [byValue, setByValue] = useState("");
  const [byDate, setByDate] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [opeFilter, setOpenFilter] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleAPICall = (client, type, value, date, pageno, pagesize) => {
    let payload = {
      filter: {
        client: client !== "None" && client !== "" ? client : "",
        label: type !== "None" && type !== "" ? type : "",
        value: value !== "None" && value !== "" ? value : "",
        fromDate: date && date.length > 0 && date !== "None" ? date[0] : "",
        toDate: date && date.length > 0 && date !== "None" ? date[1] : "",
      },
      pagination: {
        page: pageno,
        limit: pagesize,
      },
    };

    dispatch(getObjectiveExport({ payload: payload.filter }));
    dispatch(getObjectiveReport({ payload }));
    dispatch(
      setActiveHeader({ name: "objectiveReport", heading: "Objective Report" })
    );
    dispatch(getClientOptions({ search: "" }));
  };

  useEffect(() => {
    handleAPICall(byClient, byType, byValue, byDate, pageNo, pageSize);
  }, [pageNo, pageSize]);

  const csvHeaders = [
    { label: "No", key: "no" },
    { label: "Client Name", key: "clientName" },
    { label: "Type", key: "label" },
    { label: "From", key: "fromValue" },
    { label: "To", key: "toValue" },
    { label: "Created Date", key: "createdAt" },
    { label: "Updated Date", key: "updatedAt" },
  ];

  useEffect(() => {
    let tempData = [];
    if (objectiveExportList?.length > 0) {
      objectiveExportList?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          clientName: `${obj?.clientId?.firstName} ${obj?.clientId?.lastName}`,
          // chwAssigned: `${obj?.visitId?.assign_to?.firstName} ${obj?.visitId?.assign_to?.lastName}`,
          label: obj?.label ? getObjectiveValues(obj?.label) : "-",
          fromValue: obj?.fromValue ? obj?.fromValue : "-",
          toValue: obj?.value ? obj?.value : "-",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
          updatedAt: obj?.updatedAt ? getNumericDate(obj?.updatedAt) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setExportData([...tempData]);
  }, [objectiveExportList]);

  const handleFilterChange = (filterBy, value) => {
    const newValue = value === "none" ? "" : value;
    if (filterBy === "byClient") {
      setByClient(newValue);
    } else if (filterBy === "byType") {
      setByType(newValue);
    } else if (filterBy === "byValue") {
      setByValue(newValue);
    } else if (filterBy === "byDate") {
      setByDate(newValue);
    }
  };

  const onFilter = async () => {
    handleAPICall(byClient, byType, byValue, byDate, pageNo, pageSize);
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
    }
  };

  const handleResetFilters = () => {
    setByClient("");
    setByDate([]);
    setByValue("");
    setByType("");
    form.resetFields();
    handleAPICall("", "", "", [], 1, 25);
    setPageNo(1);
    setPageSize(25);
  };

  const [form] = Form.useForm();
  const fileName = `${dayjs().format("Do MMMM YYYY")}- Objective Report.csv`;
  return (
    // <Spin spinning={objectiveReportLoading}>
    <div className="report_container">
      <div className="status-sec">
        <div className="status-sec-left">
          {/* <div className="dashboard-heading">All Objective Report</div> */}
        </div>
        <div className="status-sec-right">
          <div className="filter-sec">
            <Button
              onClick={handleResetFilters}
              disabled={
                !byClient &&
                (!byDate || byDate.length === 0) &&
                !byType &&
                !byValue
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
            <Button icon={pluseIcon} onClick={() => setOpenFilter(true)}>
              Advance filter
            </Button>
            <Button
              type="primary"
              className="yellow-btn"
              onClick={onFilter}
              //   disabled={
              //     !byClient &&
              //     (!byDate || byDate.length === 0) &&
              //     !byType &&
              //     !byValue
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
                disabled={!objectiveExportList.length}
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
              onFilter={onFilter}
              handleResetFilters={handleResetFilters}
              handleSearch={handleSearch}
              setOpenFilter={setOpenFilter}
              clientOptions={clientOptions}
              byType={byType}
              byValue={byValue}
              filter={"objective"}
              form={form}
            />
          </div>
        )}
      </div>
      <ObjectiveCounters
        moststable={moststable}
        mostunstable={mostunstable}
        // loading={objectiveReportLoading}
      />
      <div className="dashboard_table_wrapper">
        <ObjectiveReportList
          objectiveReportList={objectiveReportList}
          // loading={objectiveReportLoading}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
          objectiveReportListCount={objectiveReportListCount}
        />
      </div>
    </div>
    // </Spin>
  );
};

export default ObjectiveReport;
