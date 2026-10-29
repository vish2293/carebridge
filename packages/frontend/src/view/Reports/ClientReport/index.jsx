import { Button, Form, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import AssignCHWDropdown from "../../../components/common/AssignChwDropdown";
import Loader from "../../../components/common/Loader";
import RangeDateTime from "../../../components/common/RangeDateTime";
import ReportFilter from "../../../components/common/ReportFilter";
import {
  filterClientStatus,
} from "../../../constant/array";
import { getNumericDate } from "../../../helpers";
import { getUserReport } from "../../../redux/actions/report";
import {
  getChwOptions,
  getClientOptions,
  getEthnicityOptions,
  getLanguageOptions,
  getPronounceOptions,
  getZipCodeOptions,
} from "../../../redux/actions/user";
import { setActiveHeader } from "../../../redux/slices/headerSlice";
import ClientList from "./ClientList";
import AdvanceFilter from "../../../components/common/AdvanceFilter";
import { peopeleIcon, pluseIcon } from "../../../assets/icons";
import "../style.scss";
import { getUserExport } from "../../../redux/actions/export";
import { UserCounters } from "./Counters";

const ClientReport = () => {
  const {
    clientLoading,
    loggedInUser,
    chwOptions,
    zipOptions,
    clientOptions,
    ethnicityOptions,
    languageOptions,
    pronounceOptions,
  } = useSelector((state) => state.user);
  const {
    userReportLoading,
    userReportLists,
    userReportListsCount,
    pendingUserCount,
    openUserCount,
    closedInactiveUserCount,
    closedSuccessUserCount,
  } = useSelector((state) => state.report);
  const { userExportLists } = useSelector((state) => state.exportCSV);
  const dispatch = useDispatch();
  const [clientLists, setClientLists] = useState([]);
  const [userExportList, setUserExportList] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [clientZipLists, setClientZipLists] = useState([]);
  const [data, setData] = useState([]);
  const [byZipcode, setByZipcode] = useState("");
  const [byStatus, setByStatus] = useState("");
  const [byCHW, setByCHW] = useState("");
  const [byClient, setByClient] = useState("");
  const [byDate, setByDate] = useState([]);
  const [byAge, setByAge] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [byProgram, setByProgram] = useState("");
  const [byLanguage, setByLanguage] = useState("");
  const [byPrononuce, setByPrononuce] = useState("");
  const [byEthnicity, setByEthnicity] = useState("");
  const [opeFilter, setOpenFilter] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleAPICall = (
    client,
    status,
    zipcode,
    chw,
    date,
    program,
    language,
    prononuce,
    ethnicity,
    pageno,
    pagesize
  ) => {
    let payload = {
      filter: {
        clientId: client !== "None" && client !== "" ? client : "",
        role: "Client",
        status: status !== "None" && status !== "" ? status : "",
        zipCode: zipcode !== "None" && zipcode !== "" ? zipcode : "",
        assign_to: chw !== "None" && chw !== "" ? chw : "",
        fromDate: date && date.length > 0 && date !== "None" ? date[0] : "",
        toDate: date && date.length > 0 && date !== "None" ? date[1] : "",
        program: program !== "None" && program !== "" ? program : "",
        age: "",
        language: language !== "None" && language !== "" ? language : "",
        prononuce: prononuce !== "None" && prononuce !== "" ? prononuce : "",
        ethnicity: ethnicity !== "None" && ethnicity !== "" ? ethnicity : "",
      },
      pagination: {
        page: pageno,
        limit: pagesize,
      },
    };

    dispatch(getUserExport({ payload: payload.filter }));
    dispatch(getUserReport({ payload }));
    dispatch(getChwOptions({ search: "" }));
    dispatch(getClientOptions({ search: "" }));
    dispatch(getZipCodeOptions({ search: "" }));
    dispatch(getLanguageOptions());
    dispatch(getEthnicityOptions());
    dispatch(getPronounceOptions());
  };

  useEffect(() => {
    handleAPICall(
      byClient,
      byStatus,
      byZipcode,
      byCHW,
      byDate,
      byProgram,
      byLanguage,
      byProgram,
      byEthnicity,
      pageNo,
      pageSize
    );
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (userReportLists?.length > 0) {
      setClientLists(userReportLists);
      setUserExportList(userExportLists);
    } else {
      setClientLists([]);
      setUserExportList([]);
    }
  }, [userReportLists, userExportList]);

  // const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      setActiveHeader({ name: "clientReport", heading: "Clients Report" })
    );
  }, []);

  // useEffect(() => {
  //     handleFilter();
  // }, [byCHW, status, zipcode, byClient, fromDate, toDate]);

  //For handle filter
  const onFilter = async () => {
    handleAPICall(
      byClient,
      byStatus,
      byZipcode,
      byCHW,
      byDate,
      byProgram,
      byLanguage,
      byProgram,
      byEthnicity,
      pageNo,
      pageSize
    );
    setPageNo(1);
    setPageSize(25);
  };

  const csvHeaders = [
    { label: "No", key: "no" },
    { label: "Client Name", key: "clientName" },
    { label: "Phone", key: "Phone" },
    { label: "Email", key: "email" },
    { label: "Birth Date", key: "birthDate" },
    { label: "Address", key: "address" },
    { label: "Zip Code", key: "zipCode" },
    { label: "Assigned Community Health Worker", key: "chwName" },
    { label: "Status", key: "status" },
    { label: "Created Date", key: "createdAt" },
    { label: "Updated Date", key: "updatedAt" },
  ];

  useEffect(() => {
    const tempData = [];
    if (userExportList?.length > 0) {
      userExportList?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          clientName: `${obj?.firstName} ${obj?.lastName}`,
          Phone: obj?.Phone,
          email: obj?.email,
          birthDate: obj?.birthDate ? getNumericDate(obj?.birthDate) : "-",
          address: obj?.address ? obj?.address : "-",
          zipCode: obj?.zipCode ? obj?.zipCode : "-",
          chwName: obj?.assign_to?.firstName
            ? `${obj?.assign_to?.firstName} ${obj?.assign_to?.lastName}`
            : "-",
          status: obj?.status,
          createdAt: getNumericDate(obj?.createdAt),
          updatedAt: getNumericDate(obj?.updatedAt),
        };
        tempData.push({ ...subObj });
      });
    }
    setExportData([...tempData]);
  }, [clientLists]);

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
    } else if (filterBy === "byAge") {
      setByAge(newValue);
    } else if (filterBy === "byProgram") {
      setByProgram(newValue);
    } else if (filterBy === "byEthnicity") {
      setByEthnicity(newValue);
    } else if (filterBy === "byLanguage") {
      setByLanguage(newValue);
    } else if (filterBy === "byPrononuce") {
      setByPrononuce(newValue);
    }
  };

  const handleResetFilters = () => {
    setByStatus("");
    setByCHW("");
    setByZipcode("");
    setByDate([]);
    setByClient("");
    setByProgram("");
    setByAge("");
    setByLanguage("");
    setByPrononuce("");
    setByEthnicity("");
    form.resetFields();
    handleAPICall("", "", "", "", [], "", "", "", "", 1, 25);
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
    } else if (searchBy === "byZipcode") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getZipCodeOptions({ search: value }));
      }, 500);
      setDebounceTimeout(newtime);
    }
  };

  const [form] = Form.useForm();

  const fileName = `${dayjs().format("Do MMMM YYYY")}- Client Report.csv`;

  return (
    <div className="report_container">
      <div className="status-sec">
        <div className="status-sec-left">
          {/* <div className='dashboard-heading'>All Client Report</div> */}
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
                !byZipcode &&
                !byAge &&
                !byEthnicity &&
                !byLanguage &&
                !byProgram &&
                !byPrononuce
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
              options={[
                { label: "None", value: "none" },
                ...filterClientStatus,
              ]}
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
              //   disabled={
              //     !byClient &&
              //     !byCHW &&
              //     !byStatus &&
              //     (!byDate || byDate.length === 0) &&
              //     !byZipcode &&
              //     !byAge &&
              //     !byEthnicity &&
              //     !byLanguage &&
              //     !byProgram &&
              //     !byPrononuce
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
                disabled={!userExportList.length}
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
              zipOptions={zipOptions}
              setOpenFilter={setOpenFilter}
              statusOption={filterClientStatus}
              byClient={byClient}
              clientOptions={clientOptions}
              ethnicityOptions={ethnicityOptions}
              languageOptions={languageOptions}
              pronounceOptions={pronounceOptions}
              byEthnicity={byEthnicity}
              byLanguage={byLanguage}
              byPrononuce={byPrononuce}
              byProgram={byProgram}
              byAge={byAge}
              filter={"client"}
              form={form}
            />
          </div>
        )}
      </div>
      <UserCounters
        pendingUserCount={pendingUserCount}
        openUserCount={openUserCount}
        closedInactiveUserCount={closedInactiveUserCount}
        closedSuccessUserCount={closedSuccessUserCount}
      />
      <div className="dashboard_table_wrapper">
        <ClientList
          loading={userReportLoading}
          clientLists={clientLists}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
          userReportListsCount={userReportListsCount}
        />
      </div>
    </div>
  );
};

export default ClientReport;
