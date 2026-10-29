import { Button, Form, Spin } from "antd";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { pluseIcon } from "../../../assets/icons";
import AdvanceFilter from "../../../components/common/AdvanceFilter";
import ReportFilter from "../../../components/common/ReportFilter";
import { getNumericDate } from "../../../helpers";
import { setActiveHeader } from "../../../redux/slices/headerSlice";
import "../style.scss";
import dayjs from "dayjs";
import PathwaysReportList from "./PathwaysReportList";
import { getPathwaysReport } from "../../../redux/actions/report";
import { getPathwaysExport } from "../../../redux/actions/export";
import { getAllNeedOrCategory } from "../../../redux/actions/visit";
import { getPathwayNameOption } from "../../../redux/actions/pathway";
import { getClientOptions } from "../../../redux/actions/user";

const PathwaysReport = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [exportData, setExportData] = useState([]);
  const { pathwayExportList } = useSelector((state) => state.exportCSV);
  const { clientOptions } = useSelector((state) => state.user);
  const { pathwayList, pathwayReportLoading, pathwayListCount } = useSelector(
    (state) => state.report
  );
  const { listPathwayOptions } = useSelector((state) => state.pathway);
  const { needOrCategoryOptions } = useSelector((state) => state.visit);
  const [byDate, setByDate] = useState([]);
  const [byName, setByName] = useState("");
  const [byNeed, setByNeed] = useState("");
  const [byClient, setByClient] = useState("");
  const [byPathwayStatus, setByPathwayStatus] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [opeFilter, setOpenFilter] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const fileName = `${dayjs().format("Do MMMM YYYY")}- Pathways Report.csv`;

  const handleAPICall = (
    name,
    need,
    client,
    pathwayStatus,
    date,
    pageno,
    pagesize
  ) => {
    let payload = {
      filter: {
        clientId: client !== "None" && client !== "" ? client : "",
        name: name !== "None" && name !== "" ? name : "",
        need: need !== "None" && need !== "" ? need : "",
        status:
          pathwayStatus !== "None" && pathwayStatus !== "" ? pathwayStatus : "",
        fromDate: date && date.length > 0 && date !== "None" ? date[0] : "",
        toDate: date && date.length > 0 && date !== "None" ? date[1] : "",
      },
      pagination: {
        page: pageno,
        limit: pagesize,
      },
    };
    dispatch(getPathwaysExport({ payload: payload.filter }));
    dispatch(getPathwaysReport({ payload }));
    dispatch(
      setActiveHeader({
        name: "pathwayReport",
        heading: "Pathways Report",
      })
    );
    dispatch(getAllNeedOrCategory());
    dispatch(getPathwayNameOption({ search: "" }));
    dispatch(getClientOptions({ search: "" }));
  };

  useEffect(() => {
    handleAPICall(
      byName,
      byNeed,
      byClient,
      byPathwayStatus,
      byDate,
      pageNo,
      pageSize
    );
  }, [pageNo, pageSize]);

  const csvHeaders = [
    { label: "No", key: "no" },
    { label: "Pathway Name", key: "name" },
    { label: "Primary Need", key: "need" },
    { label: "Description", key: "description" },
    { label: "Created Date", key: "createdAt" },
  ];

  useEffect(() => {
    let tempData = [];
    if (pathwayExportList?.length > 0) {
      pathwayExportList?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          name: obj?.name ? obj?.name : "-",
          description: obj?.description ? obj?.description : "-",
          need: obj?.need?.name ? obj?.need?.name : "-",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setExportData([...tempData]);
  }, [pathwayExportList]);

  const handleFilterChange = (filterBy, value) => {
    const newValue = value === "none" ? "" : value;
    if (filterBy === "byName") {
      setByName(newValue);
    } else if (filterBy === "byNeed") {
      setByNeed(newValue);
    } else if (filterBy === "byDate") {
      setByDate(newValue);
    } else if (filterBy === "byClient") {
      setByClient(newValue);
    } else if (filterBy === "byPathwayStatus") {
      setByPathwayStatus(newValue);
    }
  };

  const onFilter = async () => {
    handleAPICall(
      byName,
      byNeed,
      byClient,
      byPathwayStatus,
      byDate,
      pageNo,
      pageSize
    );
    setPageNo(1);
    setPageSize(25);
  };

  const handleSearch = (searchBy, value) => {
    if (searchBy === "byNeed") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getAllNeedOrCategory({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    } else if (searchBy === "byName") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getPathwayNameOption({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    } else if (searchBy === "byClient") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getClientOptions({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    }
  };

  const handleResetFilters = () => {
    setByNeed("");
    setByDate([]);
    setByName("");
    setByClient("");
    setByPathwayStatus("");
    form.resetFields();
    handleAPICall("", "", "", [], 1, 25);
    setPageNo(1);
    setPageSize(25);
  };

  return (
    <>
      {/* <Spin spinning={pathwayReportLoading}> */}
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
                  !byNeed &&
                  (!byDate || byDate.length === 0) &&
                  !byName &&
                  !byClient &&
                  !byPathwayStatus
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

              <ReportFilter
                options={[
                  { label: "None", value: "none" },
                  ...listPathwayOptions,
                ]}
                filterValue={byName}
                filterBy={"byName"}
                placeholder={"Select Pathway Name"}
                label={"Select Pathway Name"}
                handleFilterChange={handleFilterChange}
                handleSearch={handleSearch}
              />
              <ReportFilter
                options={[
                  { label: "None", value: "none" },
                  ...needOrCategoryOptions,
                ]}
                filterValue={byNeed}
                filterBy={"byNeed"}
                placeholder={"Select Primary Need"}
                label={"Select Primary Need"}
                handleFilterChange={handleFilterChange}
                handleSearch={handleSearch}
              />
              <Button icon={pluseIcon} onClick={() => setOpenFilter(true)}>
                Advance filter
              </Button>
              <Button type="primary" className="yellow-btn" onClick={onFilter}>
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
                  disabled={!pathwayExportList.length}
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
                filter={"pathways"}
                byPathwayStatus={byPathwayStatus}
                form={form}
              />
            </div>
          )}
        </div>
        <div className="dashboard_table_wrapper">
          <PathwaysReportList
            pathwayList={pathwayList}
            loading={pathwayReportLoading}
            pageNo={pageNo}
            pageSize={pageSize}
            setPageNo={setPageNo}
            setPageSize={setPageSize}
            pathwayListCount={pathwayListCount}
          />
        </div>
      </div>
      {/* </Spin> */}
    </>
  );
};

export default PathwaysReport;
