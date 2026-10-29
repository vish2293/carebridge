import { Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  DisableSorting,
  changeDateTime,
  getNumericDate,
} from "../../../../helpers";
import { useSelector } from "react-redux";

const NextImportantLists = ({
  importantLists,
  importantListCount,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  loading,
}) => {
  const { loggedInUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);

  const todoColumn = [
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
      sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
    },
    loggedInUser?.role === "Program_Administrator"
      ? {
          title: "Assigned Community Health Worker",
          dataIndex: "chwAssigned",
          sorter: (a, b) => a?.chwAssigned?.localeCompare(b?.chwAssigned),
        }
      : null,
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a?.category?.localeCompare(b?.category),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      sorter: (a, b) => a?.reason?.localeCompare(b?.reason),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
      render: (_, record) => {
        return (
          <span className={`task-${record?.status}`}>{record?.status}</span>
        );
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => a?.dueDate?.localeCompare(b?.dueDate),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      sorter: (a, b) => a?.createdAt?.localeCompare(b?.createdAt),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      sorter: (a, b) => a?.updatedAt?.localeCompare(b?.updatedAt),
    },
  ];

  useEffect(() => {
    let tempData = [];
    if (importantLists?.length > 0) {
      importantLists?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          clientName: `${obj?.clientId?.firstName} ${obj?.clientId?.lastName}`,
          chwAssigned: `${obj?.visitId?.assign_to?.firstName} ${obj?.visitId?.assign_to?.lastName}`,
          category: obj?.task?.category[0]?.name,
          reason: obj?.task?.task_name,
          status: obj?.task?.status,
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
          updatedAt: obj?.updatedAt ? getNumericDate(obj?.updatedAt) : "-",
          dueDate: obj?.dueDate ? getNumericDate(obj?.dueDate) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [importantLists]);
  const filteredColumns = todoColumn?.filter((colm) => colm !== null);

  return (
    <Table
      columns={filteredColumns}
      dataSource={data}
      loading={loading}
      pagination={{
        total: importantListCount,
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
      sticky={true}
      showSorterTooltip={false}
      scroll={{ x: 1000 }}
    />
  );
};

export default NextImportantLists;
