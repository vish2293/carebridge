import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { viewIcon } from "../../../assets/icons";
import { DisableSorting, getNumericDate } from "../../../helpers";
import { resetVisit } from "../../../redux/slices/visitSlice";

const VisitTable = ({
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  visitList,
  loading,
  visitListCount,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //For user list
  const [data, setData] = useState([]);

  const visitorColumn = [
    {
      title: "No",
      width: 60,
      fixed: "left",
      render: (_, __, index) => (
        <span>{DisableSorting(index, pageNo, pageSize)}</span>
      ),
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
      render: (_, record) => (
        <span onClick={() => navigate(`/app/users/${record?.clientId}`)}>
          {record?.clientName}
        </span>
      ),
    },
    {
      title: "Visit Type",
      dataIndex: "visitType",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Length of Visit",
      dataIndex: "lengthVisit",
      ellipsis: true,
      width: 130,
    },
    {
      title: "Primary Need",
      dataIndex: "primaryNeed",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Pathway",
      dataIndex: "pathway",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Client Story",
      dataIndex: "clientStory",
      ellipsis: true,
      width: 200,
      sorter: (a, b) => a?.clientStory?.localeCompare(b?.clientStory),
    },
    {
      title: "Visit Date",
      dataIndex: "visitDate",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a?.visitDate?.localeCompare(b?.visitDate),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span
              className="view"
              onClick={() => {
                navigate(`/app/visits/${record?.key}`);
                dispatch(resetVisit());
              }}
            >
              {viewIcon}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let tempArr = [];
    if (visitList?.length > 0) {
      visitList?.forEach((item, index) => {
        let obj = { ...item };
        let subObj = {
          no: index + 1,
          key: obj?._id,
          clientId: obj?.clientId?._id,
          clientName: `${obj?.clientId?.firstName} ${obj?.clientId?.lastName}`,
          clientStory: obj?.clientStory,
          visitDate: obj?.visitDate ? getNumericDate(obj?.visitDate) : "-",
          nextSteps: obj?.nextSteps,
          visitType: obj?.visitType,
          primaryNeed: obj?.primaryNeed.length > 0 ? obj?.primaryNeed?.map((item) => item.name).join(", ") : "-",
          pathway: obj?.pathway.length > 0 ? obj?.pathway?.map((item) => item.name).join(", ") : "-",
          lengthVisit: obj?.lengthOfvisit + " " + obj?.lengthOfvisitUnit,
        };
        tempArr.push({ ...subObj });
      });
    }
    setData([...tempArr]);
  }, [visitList]);

  return (
    <Table
      loading={loading}
      dataSource={data}
      pagination={{
        total: visitListCount,
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
      columns={visitorColumn}
      scroll={{ x: 1000 }}
      sticky={true}
      className="visit-table"
      showSorterTooltip={false}
    />
  );
};
export default VisitTable;
