import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { changeDateTime } from "../../../helpers";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RequestTable = ({
  requestLists,
  loading,
  handleModalClickAction,
  status = "all",
}) => {
  const { loggedInUser } = useSelector((state) => state.user);
  //For user list
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  //For dynamic action
  const requestAction = (role, record) => {
    switch (role) {
      case "Program_Administrator":
        return (
          <>
            {record?.status === "Submitted" ? (
              <span
                className="accept"
                onClick={() =>
                  handleModalClickAction("acceptRequest", true, record)
                }
              >
                Accept
              </span>
            ) : (
              <span
                className="view"
                onClick={() => navigate(`/app/users/${record?.userId}`)}
              >
                View
              </span>
            )}
            {record?.status === "Submitted" ? (
              <span
                className="reject"
                onClick={() =>
                  handleModalClickAction("rejectRequest", true, record)
                }
              >
                Resolve
              </span>
            ) : (
              ""
            )}
          </>
        );

      case "CHW":
        return (
          <>
            <span
              className="view"
              onClick={() => navigate(`/app/requests/${record?.key}`)}
            >
              View
            </span>
          </>
        );

      case "Client":
        return (
          <>
            <span
              className="view"
              onClick={() =>
                handleModalClickAction("viewRequest", true, record)
              }
            >
              View
            </span>
          </>
        );
      default:
        break;
    }
  };

  const requestColumn = [
    { title: "No", width: 80 },
    loggedInUser?.role !== "Client"
      ? {
          title: "Client Name",
          dataIndex: "clientName",
          ellipsis: true,
          sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
          render: (_, record) => (
            <>
              <span>{record?.clientName}</span>
              {record?.status === "Submitted" && <Tag color="#f50">New</Tag>}
            </>
          ),
        }
      : null,
    {
      title: "Request Type",
      dataIndex: "request_type",
      width: 150,
      sorter: (a, b) => a?.request_type?.localeCompare(b?.request_type),
      render: (_, record) => (
        <div>
          <span>{record?.request_type}</span>
        </div>
      ),
    },
    {
      title: "Request Detail",
      width: 200,
      dataIndex: "request_details",
      ellipsis: true,
      sorter: (a, b) => a?.request_details?.localeCompare(b?.request_details),
    },
    {
      title: "Request  Date",
      dataIndex: "createdAt",
      width: 150,
      sorter: (a, b) => a?.createdAt?.localeCompare(b?.createdAt),
      render: (_, record) => <div>{changeDateTime(record?.createdAt)}</div>,
    },
    loggedInUser?.role !== "Program_Administrator"
      ? null
      : {
          title: "Community Health Worker Assign",
          dataIndex: "assign_to",
          width: 150,
          sorter: (a, b) => a?.createdAt?.localeCompare(b?.createdAt),
          render: (_, record) => (
            <div>{record?.assign_to ? record?.assign_to : "-"}</div>
          ),
        },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
      render: (_, record) => (
        <>
          <span className={`tag ${record?.status}`}>{record?.status}</span>
        </>
      ),
    },

    loggedInUser?.role !== "Client"
      ? {
          title: "Action",
          width: 150,
          dataIndex: "action",
          render: (_, record) => (
            <div className="accept-reject">
              {requestAction(loggedInUser?.role, record)}
            </div>
          ),
        }
      : {
          title: "View",
          width: 150,
          dataIndex: "action",
          render: (_, record) => (
            <div className="accept-reject">
              {requestAction(loggedInUser?.role, record)}
            </div>
          ),
        },
  ];

  if (loggedInUser?.role === "CHW") {
    requestColumn?.splice(4, 1);
  }
  if (loggedInUser?.role === "Client") {
    requestColumn?.splice(0, 1);
  }
  useEffect(() => {
    let tempArr = [];

    if (requestLists?.length > 0) {
      requestLists?.forEach((item, index) => {
        let obj = { ...item };
        if (status === "all") {
          let subObj = {
            no: index + 1,
            key: obj?._id,
            clientName: obj?.request_by?.firstName,
            request_type: obj?.request_type,
            request_details: obj?.request_details,
            status: obj?.request_status,
            userId: obj?.request_by?._id,
            createdAt: obj?.createdAt,
            updatedAt: obj?.updatedAt,
            assign_to: obj?.assign_to?.firstName,
            is_answer_given: obj?.is_answer_given,
            visitType: obj?.visit_type,
            request_status: obj?.request_status,
          };
          tempArr.push({ ...subObj });
        } else if (status === obj?.request_status) {
          let subObj = {
            no: index + 1,
            key: obj?._id,
            clientName: obj?.request_by?.firstName,
            request_type: obj?.request_type,
            request_details: obj?.request_details,
            status: obj?.request_status,
            userId: obj?.request_by?._id,
            createdAt: obj?.createdAt,
            updatedAt: obj?.updatedAt,
            assign_to: obj?.assign_to?.firstName,
            is_answer_given: obj?.is_answer_given,
            visitType: obj?.visit_type,
            request_status: obj?.request_status,
          };
          tempArr.push({ ...subObj });
        }
      });
    }
    setData([...tempArr]);
  }, [requestLists]);

  const filteredColumns = requestColumn.filter((column) => column !== null);
  return (
    <Table
      loading={loading}
      dataSource={data}
      pagination={data?.length > 10 ? true : false}
      columns={filteredColumns}
      scroll={{ x: 1000 }}
      sticky={true}
    />
  );
};
export default RequestTable;
