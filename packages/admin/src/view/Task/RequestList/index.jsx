import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DisableSorting } from "../../../helpers";
import { resetRequest } from "../../../redux/slices/requestSlice";
import { resetUser } from "../../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { viewHistoryIcon, viewIcon } from "../../../assets/icons";
import { getActionStepHistory } from "../../../redux/actions/request";
import { ActionStepHistory } from "../../UserDetaile/ActionStepHistory";
import { useSelector } from "react-redux";

const RequestLists = ({
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
  requestLists,
  loading,
  totalRequestCount,
}) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { actionStepHistory } = useSelector((state) => state.request);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalAction, setModalAction] = useState("default");

  const onClickView = (action, record) => {
    switch (action) {
      case "viewData":
        navigate(`/app/requests/${record?.key}`);
        dispatch(resetRequest());
        dispatch(resetUser());
        break;
      case "viewHistory":
        setModalAction(action);
        dispatch(getActionStepHistory({ requestId: record?.key }));
        break;
      default:
        break;
    }
  };

  const modalClose = () => {
    setModalAction("default");
  };

  const Column = [
    {
      title: "No",
      width: 50,
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      ellipsis: true,
      width: 200,
      sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
    },
    {
      title: "Category",
      dataIndex: "category",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.category?.localeCompare(b?.category),
    },
    {
      title: "Resource Given",
      dataIndex: "resoruce_given",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.resoruce_given?.localeCompare(b?.resoruce_given),
    },
    {
      title: "Action Step Details",
      dataIndex: "request_details",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.request_details?.localeCompare(b?.request_details),
    },
    {
      title: "Urgent",
      dataIndex: "urgent",
      width: 90,
      sorter: (a, b) => a?.urgent?.localeCompare(b?.urgent),
      render: (_, record) => (
        <span className={`tag ${record?.urgent}`}>{record?.urgent}</span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
      render: (_, record) => (
        <span className={`task-${record?.status}`}>{record?.status}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 80,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span
              onClick={() => onClickView("viewData", record)}
              className="view"
            >
              {viewIcon}
            </span>
          </Tooltip>
          <Tooltip title="View">
            <span
              onClick={() => onClickView("viewHistory", record)}
              className="view"
            >
              {viewHistoryIcon}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const tempArray = [];
    setTotalData(requestLists.totalRequestCount);
    if (requestLists?.length > 0) {
      requestLists?.map((requestItems, i) => {
        let subObj = {
          no: i + 1,
          key: requestItems?._id,
          clientName: `${requestItems?.request_by?.firstName} ${requestItems?.request_by?.lastName}`,
          category: requestItems?.request_type?.name
            ? requestItems?.request_type?.name
            : "-",
          request_details: requestItems?.request_details
            ? requestItems?.request_details
            : "-",
          resoruce_given: requestItems?.resources_given
            ? requestItems?.resources_given
                ?.map((item) => item.resource_name)
                .join(", ")
            : "-",
          urgent: requestItems?.urgent ? "Yes" : "No",
          status: requestItems?.request_status
            ? requestItems?.request_status
            : "-",
        };
        tempArray.push({ ...subObj });
      });
    }
    setData([...tempArray]);
  }, [requestLists]);

  return (
    <>
      <div className="dashboard_table_wrapper">
        <Table
          loading={loading}
          dataSource={data}
          columns={Column}
          sticky={true}
          pagination={{
            total: totalRequestCount,
            pageSize,
            current: pageNo,
            onChange: (pageNo, pageSize) => {
              // Updated onChange function
              setPageNo(pageNo);
              setPageSize(pageSize);
            },
            pageSizeOptions: [10, 25, 50, 100],
            showSizeChanger: true,
          }}
          scroll={{ x: 1000 }}
          showSorterTooltip={false}
        />
      </div>
      <ActionStepHistory
        isOpen={modalAction === "viewHistory"}
        title="Action Step History"
        modalClose={modalClose}
        data={actionStepHistory}
      />
    </>
  );
};

export default RequestLists;
