import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DisableSorting, getNumericDate } from "../../../helpers";
import { resetRequest } from "../../../redux/slices/requestSlice";
import { useDispatch } from "react-redux";
import { resetUser } from "../../../redux/slices/userSlice";
import { viewIcon } from "../../../assets/icons";

const ChwTable = ({ requestLists, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onClickView = (record) => {
    navigate(`/app/requests/${record?.key}`);
    dispatch(resetRequest());
    dispatch(resetUser());
  };

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
      title: "Action Step Type",
      dataIndex: "requestType",
      ellipsis: true,
      width: 150,
      render: (_, record) => (
        <>
          {" "}
          <span>{record?.requestType?.name}</span>
        </>
      ),
      sorter: (a, b) =>
        a?.requestType?.name?.localeCompare(b?.requestType?.name),
    },
    {
      title: "Action Step Date",
      dataIndex: "requestedDate",
      width: 150,
      sorter: (a, b) => a?.requestedDate?.localeCompare(b?.requestedDate),
    },
    {
      title: "Action Step Details",
      dataIndex: "request_details",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a?.request_details?.localeCompare(b?.request_details),
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
      fixed: "right",
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
    let tempData = [];
    if (requestLists?.length > 0) {
      requestLists?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          clientName: `${obj?.request_by?.firstName} ${obj?.request_by?.lastName}`,
          request_details: obj?.request_details,
          requestedDate: getNumericDate(obj?.createdAt),
          requestType: obj?.request_type,
          status: obj?.request_status,
          visitId: obj?.visitId,
          urgent: obj?.urgent ? "Yes" : "No",
          userId: obj?.request_by?._id,
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [requestLists]);

  return (
    <Table
      loading={loading}
      columns={Column}
      dataSource={data}
      sticky={true}
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
      virtual
      scroll={{ y: 500, x: 500 }}
      className="dash-table"
      showSorterTooltip={false}
    />
  );
};

export default ChwTable;
