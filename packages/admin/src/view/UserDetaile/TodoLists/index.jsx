import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteIcon, editIcon, viewHistoryIcon } from "../../../assets/icons";
import { DisableSorting, getFullDateTime } from "../../../helpers";

const TodoLists = ({ todoLists, handleClickModal }) => {
  const { userTaskLoading } = useSelector((state) => state.todo);
  const [data, setData] = useState([]);
  const column = [
    {
      title: "No",
      width: 25,
      render: (_, __, index) => {
        return <span>{DisableSorting(index, 1, 25)}</span>;
      },
    },
    // { title: "Category", dataIndex: "category", },
    { title: "Reason", dataIndex: "taskName", ellipsis: true, width: 90 },
    {
      title: "Status",
      dataIndex: "status",
      width: 60,
      render: (_, record) => (
        <span className={`task-${record?.status}`}>{record?.status}</span>
      ),
    },
    { title: "Due Date", dataIndex: "dueDate", width: 80 },
    {
      title: "Action",
      dataIndex: "action",
      width: 60,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="Edit">
            <span
              className="view"
              onClick={() => handleClickModal("editTodo", true, record)}
            >
              {editIcon}
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              className="reject"
              onClick={() => handleClickModal("deleteTodo", true, record)}
            >
              {deleteIcon}
            </span>
          </Tooltip>
          <Tooltip title="History">
            <span
              onClick={() => handleClickModal("NextDateHistory", true, record)}
            >
              {viewHistoryIcon}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];
  useEffect(() => {
    let tempData = [];
    if (todoLists?.length > 0) {
      todoLists?.map((item, i) => {
        let subObj = {
          no: i + 1,
          key: item?._id,
          category: item?.task?.category,
          taskName: item?.task?.task_name,
          taskDescription: item?.task?.task_description,
          dueDate: getFullDateTime(item?.dueDate),
          clientId: item?.clientId,
          status: item?.task?.status,
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [todoLists]);
  return (
    <Table
      columns={column}
      dataSource={data}
      scroll={{ x: 500 }}
      loading={userTaskLoading}
    />
  );
};

export default TodoLists;
