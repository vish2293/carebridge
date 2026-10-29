import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DisableSorting } from "../../../helpers";
import { deleteIcon, viewIcon } from "../../../assets/icons";

const ChwLists = ({
  chwLists,
  chwLoading,
  handleClickModal,
  handleRowClick,
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  //Column for chwTable
  const chwColumn = [
    {
      title: "No.",
      width: 80,
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
      title: "Assigned Program Admin",
      width: 220,
      dataIndex: "paName",
      sorter: (a, b) => a?.paName?.localeCompare(b?.paName),
    },
    {
      title: "No. of Clients",
      dataIndex: "clientCount",
      sorter: (a, b) => b?.clientCount - a?.clientCount,
    },
    {
      title: "No. of Action Steps",
      dataIndex: "requestCount",
      sorter: (a, b) => b?.requestCount - a?.requestCount,
    },
    {
      title: "No. of Important Dates",
      dataIndex: "taskCount",
      sorter: (a, b) => b?.taskCount - a?.taskCount,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
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
    let temArray = [];
    if (chwLists?.length > 0) {
      chwLists?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          chwName: obj?.label ? obj?.label : "-",
          paName:
            obj?.assignedPA !== "undefined undefined" ? obj?.assignedPA : "-",
          clientCount: obj?.userCount ? obj?.userCount : 0,
          requestCount: obj?.requestCount ? obj?.requestCount : 0,
          taskCount: obj?.taskCount ? obj?.taskCount : 0,
          key: obj?.value,
        };
        temArray.push({ ...subObj });
      });
    }
    setData([...temArray]);
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
