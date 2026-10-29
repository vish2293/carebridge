import { Button, Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { pluseIcon } from "../../../assets/icons";
import AdvanceFilter from "../../../components/common/AdvanceFilter";
import ReportFilter from "../../../components/common/ReportFilter";
import { getNumericDate } from "../../../helpers";
import { setActiveHeader } from "../../../redux/slices/headerSlice";
import "../style.scss";
import dayjs from "dayjs";
import { getResourceGivenReport } from "../../../redux/actions/report";
import { getResourceGivemExport } from "../../../redux/actions/export";
import {
  getResourceCategoryOption,
  getResourceNameOption,
  getResourceOrganizationOption,
} from "../../../redux/actions/resource";
import ResourceGivenReportList from "./ResourceGivenReportList";
import { ResourceGivenCounters } from "./Counters";

const ResoruceGivenReport = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [exportData, setExportData] = useState([]);
  const { resourcegivenExportList } = useSelector((state) => state.exportCSV);
  const {
    resourceGivenList,
    resourcegivenReportLoading,
    resourceGivenListCount,
    mostUsedResource,
    leastUsedResource,
  } = useSelector((state) => state.report);
  const { resourceCategoryOptions, resourceNameList, organizationList } =
    useSelector((state) => state?.resource);
  const [byDate, setByDate] = useState([]);
  const [byOrganization, setByOrganization] = useState("");
  const [byName, setByName] = useState("");
  const [byCategory, setByCategory] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [opeFilter, setOpenFilter] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const fileName = `${dayjs().format(
    "Do MMMM YYYY"
  )}- Resoruce Given Report.csv`;

  const handleAPICall = (
    organization,
    name,
    category,
    date,
    pageno,
    pagesize
  ) => {
    let payload = {
      filter: {
        organization:
          organization !== "None" && organization !== "" ? organization : "",
        name: name !== "None" && name !== "" ? name : "",
        category: category !== "None" && category !== "" ? category : "",
        fromDate: date && date.length > 0 && date !== "None" ? date[0] : "",
        toDate: date && date.length > 0 && date !== "None" ? date[1] : "",
      },
      pagination: {
        page: pageno,
        limit: pagesize,
      },
    };
    dispatch(getResourceGivemExport({ payload: payload.filter }));
    dispatch(getResourceGivenReport({ payload }));
    dispatch(
      setActiveHeader({
        name: "resourceGivenReport",
        heading: "Resoruce Given Report",
      })
    );
    dispatch(getResourceCategoryOption({ search: "" }));
    dispatch(getResourceNameOption({ search: "" }));
    dispatch(getResourceOrganizationOption({ search: "" }));
  };

  useEffect(() => {
    handleAPICall(byOrganization, byName, byCategory, byDate, pageNo, pageSize);
  }, [pageNo, pageSize]);

  const csvHeaders = [
    { label: "No", key: "no" },
    { label: "Organization", key: "organization" },
    { label: "Resource Name", key: "name" },
    { label: "Category", key: "catgory" },
    { label: "Resource Details", key: "resource_details" },
    { label: "Eligibility", key: "eligibility" },
    { label: "Website Link", key: "website" },
    { label: "Email Address", key: "email" },
    { label: "Phone No.", key: "phone" },
    { label: "Non Worked Time Count", key: "nonWorkedCount" },
    { label: "Used Time Count", key: "usageCount" },
    { label: "Created Date", key: "createdAt" },
  ];

  useEffect(() => {
    let tempData = [];
    if (resourcegivenExportList?.length > 0) {
      resourcegivenExportList?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          organization: obj?.organization ? obj?.organization : "-",
          name: obj?.resource_name ? obj?.resource_name : "-",
          catgory: obj?.catgory ? obj?.catgory : "-",
          resource_details: obj?.resource_details ? obj?.resource_details : "-",
          eligibility: obj?.eligibility ? obj?.eligibility : "-",
          website: obj?.website ? obj?.website : "-",
          email: obj?.email ? obj?.email : "-",
          phone: obj?.phone ? obj?.phone : "-",
          nonWorkedCount: obj?.nonWorkedCount ? obj?.nonWorkedCount : "0",
          usageCount: obj?.usageCount ? obj?.usageCount : "0",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setExportData([...tempData]);
  }, [resourcegivenExportList]);

  const handleFilterChange = (filterBy, value) => {
    const newValue = value === "none" ? "" : value;
    if (filterBy === "byOrganization") {
      setByOrganization(newValue);
    } else if (filterBy === "byName") {
      setByName(newValue);
    } else if (filterBy === "byCategory") {
      setByCategory(newValue);
    } else if (filterBy === "byDate") {
      setByDate(newValue);
    }
  };

  const onFilter = async () => {
    handleAPICall(byOrganization, byName, byCategory, byDate, pageNo, pageSize);
    setPageNo(1);
    setPageSize(25);
  };

  const handleSearch = (searchBy, value) => {
    if (searchBy === "byCategory") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getResourceCategoryOption({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    } else if (searchBy === "byName") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getResourceNameOption({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    } else if (searchBy === "byOrganization") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getResourceOrganizationOption({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    }
  };

  const handleResetFilters = () => {
    setByCategory("");
    setByDate([]);
    setByOrganization("");
    setByName("");
    form.resetFields();
    handleAPICall("", "", "", [], 1, 25);
    setPageNo(1);
    setPageSize(25);
  };

  return (
    <>
      {/* <Spin spinning={resourcegivenReportLoading}> */}
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
                  !byCategory &&
                  (!byDate || byDate.length === 0) &&
                  !byOrganization &&
                  !byName
                }
              >
                Clear Filter
              </Button>
              <ReportFilter
                options={[
                  { label: "None", value: "none" },
                  ...resourceNameList,
                ]}
                filterValue={byName}
                filterBy={"byName"}
                placeholder={"Select Resource Name"}
                label={"Select Resource Name"}
                handleFilterChange={handleFilterChange}
                handleSearch={handleSearch}
              />
              <ReportFilter
                options={[
                  { label: "None", value: "none" },
                  ...resourceCategoryOptions,
                ]}
                filterValue={byCategory}
                filterBy={"byCategory"}
                placeholder={"Select Category"}
                label={"Select Category"}
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
                // disabled={
                //   !byCategory &&
                //   (!byDate || byDate.length === 0) &&
                //   !byOrganization &&
                //   !byName
                // }
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
                  disabled={!resourcegivenExportList.length}
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
                organizationList={organizationList}
                setOpenFilter={setOpenFilter}
                byOrganization={byOrganization}
                filter={"resourcegiven"}
                form={form}
              />
            </div>
          )}
        </div>
      </div>
      <div className="dashboard_table_wrapper">
        <ResourceGivenReportList
          resourceGivenList={resourceGivenList}
          loading={resourcegivenReportLoading}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
          resourceGivenListCount={resourceGivenListCount}
        />
      </div>
      {/* </Spin> */}
    </>
  );
};

export default ResoruceGivenReport;
