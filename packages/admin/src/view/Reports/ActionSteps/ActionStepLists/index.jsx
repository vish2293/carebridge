import React, { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetRequest } from "../../../../redux/slices/requestSlice";
import { resetUser } from "../../../../redux/slices/userSlice";
import { DisableSorting, getNumericDate } from "../../../../helpers";
import { viewIcon } from "../../../../assets/icons";
import { useSelector } from "react-redux";

const ActionStepLists = ({
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  actionStepLists,
  actionStepListCount,
  loading,
}) => {
  const { loggedInUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Column = [
    {
      title: "No",
      width: 80,
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
    },
    loggedInUser?.role === "Program_Administrator"
      ? {
          title: "Assigned Community Health Worker",
          dataIndex: "chwName",
          ellipsis: true,
          width: 150,
          sorter: (a, b) => a?.chwName?.localeCompare(b?.chwName),
        }
      : null,
    {
      title: "Assigned To",
      dataIndex: "assign_to",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.assign_to?.localeCompare(b?.assign_to),
    },
    {
      title: "Category",
      dataIndex: "category",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.category?.localeCompare(b?.category),
    },
    {
      title: "Action Step Details",
      dataIndex: "request_details",
      ellipsis: true,
      width: 250,
      sorter: (a, b) => a?.request_details?.localeCompare(b?.request_details),
    },
    {
      title: "Resource Given",
      dataIndex: "resourceGiven",
      ellipsis: true,
      width: 220,
      render: (_, record) => {
        const resources = record?.resourceGiven;

        if (Array.isArray(resources)) {
          const resourceNames = resources.map(
            (item) =>
              `${item.resource_name}${
                item.organization ? ` (${item.organization})` : ""
              }`
          );
          const resourceString = resourceNames.join(", ");
          return resourceNames.length ? (
            <Tooltip title={resourceString}>
              <div>
                {resourceNames.length > 1
                  ? resourceString.substring(0, 20) + "..."
                  : resourceString}
              </div>
            </Tooltip>
          ) : (
            <div>-</div>
          );
        } else {
          return <span>{"-"}</span>;
        }
      },
      sorter: (a, b) => {
        const resourceA = Array.isArray(a.resourceGiven)
          ? a.resourceGiven[0]?.resource_name
          : a.resourceGiven;
        const resourceB = Array.isArray(b.resourceGiven)
          ? b.resourceGiven[0]?.resource_name
          : b.resourceGiven;
        return resourceA?.localeCompare(resourceB);
      },
    },
    // { title: "Reason for Resource Change", dataIndex: "reasonForResourceChange", ellipsis: true, width: 250, sorter: (a, b) => a?.resourceGiven?.localeCompare(b?.resourceGiven) },
    {
      title: "Urgent",
      dataIndex: "urgent",
      width: 100,
      sorter: (a, b) => a?.urgent?.localeCompare(b?.urgent),
      render: (_, record) => (
        <span className={`tag ${record?.urgent}`}>{record?.urgent}</span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
      render: (_, record) => (
        <span className={`task-${record?.status}`}>{record?.status}</span>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.createdAt?.localeCompare(b?.createdAt),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.updatedAt?.localeCompare(b?.updatedAt),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 80,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span onClick={() => onClickView(record)} className="view">
              {viewIcon}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const tempArray = [];
    if (actionStepLists?.length > 0) {
      actionStepLists?.map((requestItems, i) => {
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
    setData([...tempArray]);
  }, [actionStepLists]);

  const onClickView = (record) => {
    navigate(`/app/requests/${record?.key}`);
    dispatch(resetRequest());
    dispatch(resetUser());
  };
  const filterColumn = Column?.filter((colm) => colm !== null);
  return (
    <div className="dashboard_table_wrapper">
      <Table
        loading={loading}
        dataSource={data}
        columns={filterColumn}
        sticky={true}
        showSorterTooltip={false}
        pagination={{
          total: actionStepListCount,
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
      />
    </div>
  );
};

export default ActionStepLists;
