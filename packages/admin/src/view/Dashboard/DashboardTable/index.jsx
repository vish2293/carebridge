/* eslint-disable react/prop-types */
import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DisableSorting, getNumericDate } from "../../../helpers";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetRequest } from "../../../redux/slices/requestSlice";
import { resetUser } from "../../../redux/slices/userSlice";
import { viewIcon } from "../../../assets/icons";

const DashboardTable = ({ requestLists, loading, handleTableActions }) => {
  const { loggedInUser } = useSelector((state) => state.user);
  //For store user data
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickView = (record) => {
    navigate(`/app/requests/${record?.key}`);
    dispatch(resetRequest());
    dispatch(resetUser());
  };

  //column of dashboard column
  const dashboardColumn = [
    {
      title: "No",
      width: 80,
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    loggedInUser?.role !== "Client"
      ? {
          title: "Client Name",
          dataIndex: "clientName",
          width: 140,
          ellipsis: true,
          sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
        }
      : null,
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
      title: "Action Step Type",
      dataIndex: "requestType",
      ellipsis: true,
      width: 150,
      render: (_, record) => (
        <>
          <span>{record?.requestType?.name}</span>
        </>
      ),
      sorter: (a, b) => a?.requestType?.localeCompare(b?.requestType),
    },
    {
      title: "Action Step Detail",
      dataIndex: "requestDetail",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a?.requestDetail?.localeCompare(b?.requestDetail),
    },

    {
      title: "Action Step Date",
      dataIndex: "requestedDate",
      width: 150,
      render: (_, record) => <div>{record?.requestedDate}</div>,
      sorter: (a, b) => a?.requestedDate?.localeCompare(b?.requestedDate),
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

    loggedInUser?.role !== "Client"
      ? {
          title: "Action",
          dataIndex: "action",
          fixed: "right",
          width: 100,
          render: (_, record) => (
            <div className="accept-reject">
              <Tooltip title="View">
                <span onClick={() => onClickView(record)} className="view">
                  {viewIcon}
                </span>
              </Tooltip>
            </div>
          ),
        }
      : null,
  ];

  useEffect(() => {
    let tempArray = [];
    if (requestLists?.length > 0) {
      requestLists?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          clientName: `${obj?.request_by?.firstName} ${obj?.request_by?.lastName}`,
          requestType: obj?.request_type,
          requestDetail: obj?.request_details,
          requestedDate: getNumericDate(obj?.createdAt),
          chwAssign: obj?.assign_to?.firstName,
          status: obj?.request_status,
          urgent: obj?.urgent ? "Yes" : "No",
          visitType: obj?.visit_type,
          visitId: obj?.visitId,
          userId: obj?.request_by?._id,
        };
        tempArray.push({ ...subObj });
      });
    }
    setData([...tempArray]);
  }, [requestLists]);

  const filteredColumns = dashboardColumn.filter((column) => column !== null);
  return (
    <Table
      columns={filteredColumns}
      dataSource={data}
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
      loading={loading}
      sticky={true}
      // virtual
      scroll={{ x: 500, y: 300 }}
      className="dash-table"
      showSorterTooltip={false}
    />
  );
};

export default DashboardTable;
