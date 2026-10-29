import { Button, Form, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { pluseIcon } from "../../../assets/icons";
import AdvanceFilter from "../../../components/common/AdvanceFilter";
import ReportFilter from "../../../components/common/ReportFilter";
import { RequestStatus, filterQuestion } from "../../../constant/array";
import { getNumericDate } from "../../../helpers";
import { getActionStepsExport } from "../../../redux/actions/export";
import { getActionStepsReport } from "../../../redux/actions/report";
import {
  getChwOptions,
  getClientOptions,
  getResourceOptions,
} from "../../../redux/actions/user";
import { setActiveHeader } from "../../../redux/slices/headerSlice";
import "../style.scss";
import ActionStepLists from "./ActionStepLists";
import { ActionStepCounter } from "./Counters";
import { getAllNeedOrCategory } from "../../../redux/actions/visit";

const ActionSteps = () => {
  const dispatch = useDispatch();
  const {
    actionStepLoading,
    pendingActionSteps,
    completedActionSteps,
    inprogressActionSteps,
    cancelledActionSteps,
    unsuccessfulActionSteps,
    actionStepList,
    actionStepListCount,
  } = useSelector((state) => state.report);
  const { needOrCategoryOptions } = useSelector((state) => state.visit);
  const { actionStepExportList } = useSelector((state) => state.exportCSV);
  const { clientOptions, loggedInUser, resourceOptions, chwOptions } =
    useSelector((state) => state.user);
  const [actionStepLists, setActionStepLists] = useState([]);
  const [actionStepExportLists, setActionStepExportLists] = useState([]);
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [byCHW, setByCHW] = useState("");
  const [byStatus, setByStatus] = useState("");
  const [byClient, setByClient] = useState("");
  const [byDate, setByDate] = useState([]);
  const [byCategory, setByCategory] = useState("");
  const [byResource, setByResource] = useState("");
  const [byPriority, setByPriority] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [opeFilter, setOpenFilter] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleAPICall = (
    client,
    status,
    category,
    chw,
    priority,
    date,
    resource,
    pageno,
    pagesize
  ) => {
    let payload = {
      filter: {
        client: client !== "None" && client !== "" ? client : "",
        status: status !== "None" && status !== "" ? status : "",
        type: category !== "None" && category !== "" ? category : "",
        assign_to: chw !== "None" && chw !== "" ? chw : "",
        urgent: priority !== "None" && priority !== "" ? priority : "",
        fromDate: date && date.length > 0 && date !== "None" ? date[0] : "",
        toDate: date && date.length > 0 && date !== "None" ? date[1] : "",
        resource_given: resource !== "None" && resource !== "" ? resource : "",
      },
      pagination: {
        page: pageno || 1,
        limit: pagesize || 25,
      },
    };

    dispatch(getActionStepsExport({ payload: payload.filter }));
    dispatch(getActionStepsReport({ payload }));
    dispatch(setActiveHeader({ name: "actionSteps", heading: "Action Steps" }));
    dispatch(getClientOptions({ search: "" }));
    dispatch(getChwOptions({ search: "" }));
    dispatch(getResourceOptions({ payload: { search: "" } }));
  };

  useEffect(() => {
    handleAPICall(
      byClient,
      byStatus,
      byCategory,
      byCHW,
      byPriority,
      byDate,
      byResource,
      pageNo,
      pageSize
    );
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (actionStepList?.length) {
      setActionStepExportLists(actionStepExportList);
      setActionStepLists(actionStepList);
    } else {
      setActionStepLists([]);
      setActionStepExportLists([]);
    }
  }, [actionStepList, actionStepExportLists]);

  const csvHeaders = [
    { label: "No", key: "no" },
    { label: "Client Name", key: "clientName" },
    { label: "Community Health Worker Name", key: "chwName" },
    { label: "Assign_to", key: "assign_to" },
    { label: "Category", key: "category" },
    { label: "Action Step Details", key: "request_details" },
    { label: "Priority", key: "urgent" },
    { label: "Resource Given", key: "resourceGiven" },
    { label: "Status", key: "status" },
    { label: "Created Date", key: "createdAt" },
    { label: "Updated Date", key: "updatedAt" },
  ];

  useEffect(() => {
    const tempArray = [];
    if (actionStepExportLists?.length > 0) {
      actionStepExportLists?.map((requestItems, i) => {
        let subObj = {
          no: i + 1,
          key: requestItems?._id,
          clientName: `${requestItems?.request_by?.firstName} ${requestItems?.request_by?.lastName}`,
          assign_to: `${requestItems?.assign_to?.firstName} ${requestItems?.assign_to?.lastName}`,
          category: requestItems?.request_type
            ? requestItems?.request_type?.name
            : "-",
          request_details: requestItems?.request_details
            ? requestItems?.request_details
            : "-",
          urgent: requestItems?.urgent ? "Yes" : "No",
          chwName: requestItems?.visitId?.assign_to
            ? `${requestItems?.visitId?.assign_to?.firstName} ${requestItems?.visitId?.assign_to?.lastName}`
            : "-",
          resourceGiven: requestItems?.resources_given
            ? requestItems?.resources_given
                ?.map(
                  (resourceItem) =>
                    `${resourceItem?.resource_name}${
                      resourceItem?.organization
                        ? ` (${resourceItem.organization})`
                        : ""
                    }`
                )
                ?.join(", ")
            : "-",
          status: requestItems?.request_status
            ? requestItems?.request_status
            : "-",
          createdAt: requestItems?.createdAt
            ? getNumericDate(requestItems?.createdAt)
            : "-",
          updatedAt: requestItems?.updatedAt
            ? getNumericDate(requestItems?.updatedAt)
            : "-",
        };
        tempArray.push({ ...subObj });
      });
    }
    setExportData([...tempArray]);
  }, [actionStepLists]);

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
    } else if (filterBy === "byResource") {
      setByResource(newValue);
    } else if (filterBy === "byPriority") {
      setByPriority(newValue);
    }
  };

  const onFilter = async () => {
    handleAPICall(
      byClient,
      byStatus,
      byCategory,
      byCHW,
      byPriority,
      byDate,
      byResource,
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
    } else if (searchBy === "byResource") {
      clearTimeout(debounceTimeout);
      const newtime = setTimeout(() => {
        dispatch(getResourceOptions({ payload: { search: value } }));
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
    setByResource("");
    setByPriority("");
    form.resetFields();

    handleAPICall("", "", "", "", "", "", "", 1, 25);

    setPageNo(1);
    setPageSize(25);
  };

  const [form] = Form.useForm();

  const fileName = `${dayjs().format("Do MMMM YYYY")}- Action step.csv`;

  const filteredOptions = RequestStatus?.filter((v) => v.label !== "All");
  const optionsWithNone = [
    { label: "None", value: "none" },
    ...filteredOptions,
  ];

  useEffect(() => {
    dispatch(getAllNeedOrCategory());
  }, []);

  return (
    // <Spin spinning={actionStepLoading}>
    <div className="report_container">
      <div className="status-sec">
        <div className="status-sec-left">
          {/* <div className="dashboard-heading">All Action Steps</div> */}
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
                !byPriority &&
                !byResource &&
                !byCategory
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
              options={optionsWithNone}
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
              //     !byPriority &&
              //     !byResource &&
              //     !byCategory
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
                disabled={!actionStepExportLists.length}
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
              byPriority={byPriority}
              byResource={byResource}
              resourceOptions={resourceOptions}
              statusOption={RequestStatus?.filter((v) => v.label !== "All")}
              clientOptions={clientOptions}
              byCategory={byCategory}
              nextImportantDateCategory={needOrCategoryOptions}
              filter={"actionSteps"}
              form={form}
            />
          </div>
        )}
      </div>
      <ActionStepCounter
        pendingActionSteps={pendingActionSteps}
        completedActionSteps={completedActionSteps}
        inprogressActionSteps={inprogressActionSteps}
        cancelledActionSteps={cancelledActionSteps}
        unsuccessfulActionSteps={unsuccessfulActionSteps}
      />
      <div className="dashboard_table_wrapper">
        <ActionStepLists
          actionStepLists={actionStepLists}
          loading={actionStepLoading}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
          actionStepListCount={actionStepListCount}
        />
      </div>
    </div>
    // {/* </Spin> */}
  );
};
export default ActionSteps;
