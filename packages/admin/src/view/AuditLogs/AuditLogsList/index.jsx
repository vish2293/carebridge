import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { viewIcon } from "../../../assets/icons";
import { DisableSorting, getNumericDate } from "../../../helpers";
import { resetVisit } from "../../../redux/slices/visitSlice";
import dayjs from "dayjs";

const LogsListTable = ({
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  logsList,
  loading,
  logsListCount,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //For user list
  const [data, setData] = useState([]);

  const visitorColumn = [
    {
      title: "No",
      width: 70,
      render: (_, __, index) => (
        <span>{DisableSorting(index, pageNo, pageSize)}</span>
      ),
    },
    {
      title: "Client Name",
      dataIndex: "accessedData",
      ellipsis: true,
      width: 220,
      sorter: (a, b) => a?.accessedData?.localeCompare(b?.accessedData),
      render: (_, record) => record?.accessedData,
    },
    {
      title: "Accessed By",
      dataIndex: "accessedBy",
      ellipsis: true,
      width: 190,
      sorter: (a, b) => a?.accessedBy?.localeCompare(b?.accessedBy),
      render: (_, record) => record?.accessedBy,
    },
    {
      title: "Accessed Role",
      dataIndex: "accessedRole",
      ellipsis: true,
      width: 190,
      sorter: (a, b) => a?.accessedRole?.localeCompare(b?.accessedRole),
      render: (_, record) => record?.accessedRole,
    },
    {
      title: "ipAddress",
      dataIndex: "routeName",
      ellipsis: true,
      width: 190,
      sorter: (a, b) => a?.routeName?.localeCompare(b?.routeName),
    },
    {
      title: "Access Date & Time",
      dataIndex: "accessedAt",
      width: 190,
      sorter: (a, b) => a?.accessedAt?.localeCompare(b?.accessedAt),
    },
  ];

  useEffect(() => {
    let tempArr = [];

    if (logsList?.length > 0) {
      logsList.forEach((item, index) => {
        let obj = { ...item };

        const formattedAccessedData = obj?.accessedData
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
          no: index + 1,
          key: obj?._id,
          routeName: obj?.route,
          accessedAt: dayjs(obj?.accessedAt).format("YYYY-MM-DD HH:mm:ss"),
          accessedBy: `${obj?.accessedBy?.firstName} ${obj?.accessedBy?.lastName}`,
          accessedRole: obj?.accessedRole?.replace("_", " "),
          accessedData: uniqueClientName,
        };

        tempArr.push(subObj);
      });
    }

    setData(tempArr);
  }, [logsList]);

  return (
    <Table
      loading={loading}
      dataSource={data}
      pagination={{
        total: logsListCount,
        pageSize,
        current: pageNo,
        onChange: (pageNo, pageSize) => {
          setPageNo(pageNo);
          setPageSize(pageSize);
        },
        pageSizeOptions: [10, 25, 50, 100],
        showSizeChanger: true,
      }}
      columns={visitorColumn}
      scroll={{ x: 1000 }}
      sticky={true}
      className="visit-table"
      showSorterTooltip={false}
    />
  );
};
export default LogsListTable;
