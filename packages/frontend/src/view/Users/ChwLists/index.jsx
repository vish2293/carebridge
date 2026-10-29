import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DisableSorting } from "../../../helpers";
import { deleteIcon, viewIcon } from "../../../assets/icons";

const ChwLists = ({
  chwLists,
  userRequestTodoList,
  requestList,
  clientList,
  chwLoading,
  handleClickModal,
  handleRowClick,
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
}) => {
  //For navigate
  const navigate = useNavigate();
  //For data
  const [data, setData] = useState([]);

  //For get count
  const getCount = (action, id) => {
    switch (action) {
      case "clientCount":
        return clientList?.filter((v) => v?.assign_to?._id === id)?.length;
      case "requestCount":
        return requestList?.filter((v) => v?.assign_to?._id === id)?.length;
      case "taskCount":
        return userRequestTodoList?.filter((v) => v?.chwid === id)?.length;
      default:
        return;
    }
  };

  //Column for chwTable
  const chwColumn = [
    {
      title: "No",
      width: 80,
      fixed: "left",
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "Community Health Worker Name",
      dataIndex: "chwName",
      sorter: (a, b) => a?.chwName?.localeCompare(b?.chwName),
    },
    {
      title: "No. of Users",
      dataIndex: "usersCount",
      sorter: (a, b) => b?.usersCount - a?.usersCount,
    },
    {
      title: "No. of Action Steps",
      dataIndex: "requestCount",
      sorter: (a, b) => b?.requestCount - a?.requestCount,
    },
    {
      title: "No. of Next steps",
      dataIndex: "taskCount",
      sorter: (a, b) => b?.taskCount - a?.taskCount,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 150,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span
              onClick={() => navigate(`/app/chw/${record?.key}`)}
              className="view"
            >
              {viewIcon}
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              onClick={() => handleClickModal("deleteChw", true, record)}
              className="reject"
            >
              {deleteIcon}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  //For store chw lists
  useEffect(() => {
    let tempData = [];
    if (chwLists?.length > 0) {
      chwLists?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?.user?._id,
          chwName: obj?.user?.firstName + " " + obj?.user?.lastName,
          usersCount: obj?.usersCount,
          requestCount: obj?.requestCount,
          taskCount: obj?.taskCount,
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [chwLists]);

  return (
    <div className="dashboard_table_wrapper">
      <Table
        onRow={(record) => ({
          onClick: (e) => handleRowClick(record, e, "chw"),
        })}
        pagination={{
          total: data?.length,
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
        loading={chwLoading}
        columns={chwColumn}
        dataSource={data}
        sticky={true}
        scroll={{ x: 1000 }}
        className="user-table"
        showSorterTooltip={false}
      />
    </div>
  );
};

export default ChwLists;
