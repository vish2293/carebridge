import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import { useSelector } from "react-redux";
import DataNotfound from "../../components/common/DataNotFound";
import { listLogs } from "../../redux/actions/auditLogs";
import Loader from "../../components/common/Loader";
import LogsListTable from "./AuditLogsList";
import { Button, Tooltip } from "antd";
import { getAuditLogsExport } from "../../redux/actions/export";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";

const AuditLogs = () => {
  const { loggedInUser } = useSelector((state) => state.user);
  const { auditLogsExportList } = useSelector((state) => state.exportCSV);
  const dispatch = useDispatch();
  const [logsLoading, setLogsLoading] = useState(false);
  const [auditLogsExportLists, setAuditLogsExportLists] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [logsList, setLogsList] = useState([]);
  const [logsListCount, setLogsListCount] = useState(0);

  useEffect(() => {
    setLogsLoading(true);
    let payload = {
      pagination: {
        page: pageNo || 1,
        limit: pageSize || 50,
      },
    };

    dispatch(listLogs(payload))
      .then((response) => {
        setLogsList(response?.payload.data || []);
        setLogsListCount(response?.payload?.count || 0);
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
      })
      .finally(() => {
        setLogsLoading(false);
      });
    localStorage.setItem("prevUrl", window.location.pathname);
    dispatch(setActiveHeader({ name: "logs", heading: "Audit Logs" }));
  }, [pageNo, pageSize]);

  useEffect(() => {
    dispatch(getAuditLogsExport({}));
    if (auditLogsExportList) {
      setAuditLogsExportLists(auditLogsExportList)
    }
  }, [logsList]);

  const csvHeaders = [
    { label: "No", key: "no" },
    { label: "Client Name", key: "accessedData" },
    { label: "Accessed By", key: "accessedBy" },
    { label: "Accessed Role", key: "accessedRole" },
    { label: "ipAddress", key: "routeName" },
    { label: "Access Date & Time", key: "accessedAt" }
  ];

  useEffect(() => {
    const tempArray = [];
    if (auditLogsExportLists?.length > 0) {
      auditLogsExportLists?.map((auditLogs, i) => {
        const formattedAccessedData = auditLogs?.accessedData
          ?.map((entry) => {
            if (entry?.firstName) {
              return `${entry.firstName} ${entry.lastName}`;
            }
            return null;
          })
          .filter(Boolean);

        const uniqueClientName =
          formattedAccessedData.length > 0 ? formattedAccessedData[0] : "N/A";

        let subObj = {
          no: i + 1,
          key: auditLogs?._id,
          routeName: auditLogs?.route,
          accessedAt: dayjs(auditLogs?.accessedAt).format("YYYY-MM-DD HH:mm:ss"),
          accessedBy: `${auditLogs?.accessedBy?.firstName} ${auditLogs?.accessedBy?.lastName}`,
          accessedRole: auditLogs?.accessedRole?.replace("_", " "),
          accessedData: uniqueClientName,
        };
        tempArray.push({ ...subObj });
      });
    }
    setExportData([...tempArray]);
  }, [logsList]);

  const fileName = `${dayjs().format("Do MMMM YYYY")} - Audit Logs.csv`

  return loggedInUser.role === "Super_Admin" ? (
    logsLoading ? (
      <Loader className={"page-loader"} />
    ) : (
      <div className="">
        <div className="status-sec" style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="dashboard-heading">All Audit Logs</div>
          <CSVLink
            data={exportData}
            headers={csvHeaders}
            filename={fileName}
            className="ant-btn ant-btn-primary"
          >
            <Button
              type="primary"
              className="yellow-btn"
              disabled={!auditLogsExportList.length}
            >
              Export CSV
            </Button>
          </CSVLink>
        </div>
        <div className="dashboard_table_wrapper">
          <LogsListTable
            logsList={logsList}
            loading={logsLoading}
            logsListCount={logsListCount}
            pageNo={pageNo}
            pageSize={pageSize}
            setPageNo={setPageNo}
            setPageSize={setPageSize}
          />
        </div>
      </div>
    )
  ) : (
    <DataNotfound />
  );
};

export default AuditLogs;
