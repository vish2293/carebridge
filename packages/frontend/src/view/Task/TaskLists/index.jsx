import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { viewIcon } from "../../../assets/icons";
import { DisableSorting, getFullDateTime } from "../../../helpers";

const TaskLists = ({
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
  taskLists,
  loading,
  calendarTodoListCount,
}) => {
  //For reducer
  const { loggedInUser } = useSelector((state) => state.user);
  //For store data
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const onClickView = (record) => {
    navigate(`/app/users/${record.userId}?todoId=${record.key}`);
  };
  const taskColumn = [
    {
      title: "No",
      width: 40,
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      width: 120,
      ellipsis: true,
      sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
    },
    {
      title: "Reason",
      dataIndex: "task_name",
      ellipsis: true,
      width: 200,
      sorter: (a, b) => a?.task_name?.localeCompare(b?.task_name),
    },
    {
      title: "Category",
      dataIndex: "category",
      ellipsis: true,
      width: 130,
      sorter: (a, b) => a?.category?.localeCompare(b?.category),
      render: (category) => category || "N/A",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      width: 110,
      sorter: (a, b) => a?.dueDate?.localeCompare(b?.dueDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 80,
      sorter: (a, b) => a?.status?.localeCompare(b?.clientName),
      render: (_, record) => (
        <div>
          <span className={`task-${record?.status}`}>{record?.status}</span>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 50,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span className="view" onClick={() => onClickView(record)}>
              {viewIcon}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const tempArray = [];
    if (taskLists?.length > 0) {
      taskLists?.map((taskItems, i) => {
        let subObj = {
          no: i + 1,
          key: taskItems?._id,
          clientName: `${taskItems?.clientId?.firstName} ${taskItems?.clientId?.lastName}`,
          userId: taskItems?.clientId?._id,
          category: taskItems?.task?.category
            ? taskItems?.task?.category?.map((item) => item.name).join(", ")
            : "-",
          task_name: taskItems?.task?.task_name
            ? taskItems?.task?.task_name
            : "-",
          task_description: taskItems?.task?.task_description
            ? taskItems?.task?.task_description
            : "-",
          status: taskItems?.task?.status ? taskItems?.task?.status : "-",
          dueDate: taskItems?.dueDate
            ? getFullDateTime(taskItems?.dueDate)
            : "-",
        };
        tempArray.push({ ...subObj });
      });
    }
    setData([...tempArray]);
  }, [taskLists]);

  return (
    <div className="dashboard_table_wrapper">
      <Table
        loading={loading}
        dataSource={data}
        columns={taskColumn}
        sticky={true}
        pagination={{
          total: calendarTodoListCount,
          pageSize,
          current: pageNo,
          onChange: (pageNo, pageSize) => {
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
  );
};

export default TaskLists;
