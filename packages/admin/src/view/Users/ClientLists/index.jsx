import { Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteIcon,
  mergeIcon,
  redExlcaimationIcon,
  viewIcon,
} from "../../../assets/icons";
import reassessment from "../../../assets/images/reassessment.svg";
import AssignCHWDropdown from "../../../components/common/AssignChwDropdown";
import { DisableSorting } from "../../../helpers";
import { getHeardAboutUse } from "../../../helpers/getHeardAboutUse";
import { getTalkedWithCHW } from "../../../helpers/getTalkedWithCHW";

const ClientLists = ({
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
  clientLists,
  clientLoading,
  handleClickModal,
  handleRowClick,
  setSelectedUsers,
  selectedUsers,
  chwName,
  setChwName,
  totalClient,
}) => {
  const { loggedInUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const clientColumn = [
    {
      title: "No",
      width: 80,
      fixed: "left",
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      ellipsis: true,
      width: 230,
      sorter: (a, b) => a?.firstName?.localeCompare(b?.firstName),
      render: (_, record) => (
        <div className="user-name">
          <div>
            <Tooltip title={record?.firstName}>
              <span>
                {record?.firstName?.length > 6
                  ? record.firstName.substring(0, 6) + "..."
                  : record?.firstName}
              </span>
            </Tooltip>
            {!record?.isDetailCompleted && <>{redExlcaimationIcon}</>}
          </div>
          <div style={{ display: "flex" }}>
            {record?.status === "Pending" && <Tag color="#f50">New</Tag>}
            {record?.isDuplicate && <Tag color="green">Duplicate</Tag>}
            {record?.isReassessment && (
              <Tooltip title="Reassessment recommended">
                {" "}
                <img
                  src={reassessment}
                  style={{
                    height: "15px",
                    margin: "auto",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                />{" "}
              </Tooltip>
            )}
          </div>
          {/* <div>
          </div> */}
        </div>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      ellipsis: true,
      width: 120,
      sorter: (a, b) => a?.lastName?.localeCompare(b?.lastName),
    },
    {
      title: "Program",
      dataIndex: "program",
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a?.program?.localeCompare(b?.program),
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
      width: 100,
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      ellipsis: true,
      width: 100,
      sorter: (a, b) => b?.phone - a?.phone,
    },
    {
      title: "Zip Code",
      dataIndex: "zipCode",
      ellipsis: true,
      width: 120,
      sorter: (a, b) => a?.zipCode?.localeCompare(b?.zipCode),
    },
    {
      title: "Address",
      dataIndex: "address",
      ellipsis: true,
      width: 120,
      sorter: (a, b) => a?.address?.localeCompare(b?.address),
    },
    loggedInUser.role === "CHW"
      ? null
      : {
          title: "Community Health Worker Assigned",
          dataIndex: "chwAssigned",
          width: 180,
          ellipsis: true,
          sorter: (a, b) => a?.chwAssigned?.localeCompare(b?.chwAssigned),
          render: (text, record) => {
            return text ? (
              text
            ) : (
              <div className="chw-option">
                <AssignCHWDropdown
                  value={record?.chwNames || null}
                  handleClickModal={handleClickModal}
                  setChwName={setChwName}
                  record={record}
                />
              </div>
            );
          },
        },
    {
      title: "Status",
      dataIndex: "status",
      width: 115,
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
      render: (_, record) => (
        <span className={`task-${record?.status}`}>{record?.status}</span>
      ),
    },
    {
      title: "Talked with Community Health Worker?",
      width: 150,
      dataIndex: "talkedWithCHW",
    },
    {
      title: "How did you hear about us?",
      width: 320,
      dataIndex: "heardAboutUs",
    },
    {
      title: "Created Date",
      width: 150,
      dataIndex: "createdAt",
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <Link to={`/app/users/${record?.key}`} className="view">
              {viewIcon}
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              onClick={() => handleClickModal("deleteClient", true, record)}
              className="reject"
            >
              {deleteIcon}
            </span>
          </Tooltip>
          {record?.isDuplicate && (
            <Tooltip title="Merge">
              <a onClick={(e) => e.preventDefault()} aria-hidden="true">
                <span
                  onClick={() => handleClickModal("mergeClient", true, record)}
                  className="merge"
                >
                  {mergeIcon}
                </span>
              </a>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    let tempArray = [];
    if (clientLists?.length > 0) {
      setTotalData(clientLists.totalUsersCount);
      clientLists?.forEach((item, index) => {
        let obj = { ...item };
        let subObj = {
          // no: index + 1,
          key: obj?._id,
          firstName: obj?.firstName ? obj.firstName : "-",
          lastName: obj?.lastName,
          request_details: obj?.request_details,
          startDate: obj?.createdAt?.slice(0, 10),
          email: obj?.email ? obj?.email : "-",
          zipCode: obj?.zipCode,
          chwNames: obj?.chwNames,
          phone: obj?.Phone,
          status: obj?.status,
          program: obj?.program ? obj?.program : "-",
          isDetailCompleted: obj?.isDetailCompleted,
          isDuplicate: obj?.isDuplicate,
          isReassessment: obj?.isReassessment,
          talkedWithCHW: obj?.profileQuestion
            ? getTalkedWithCHW(obj?.profileQuestion)
            : "-",
          heardAboutUs: obj?.profileQuestion
            ? getHeardAboutUse(obj?.profileQuestion)
            : "-",
          createdAt: obj?.createdAt
            ? dayjs(obj?.createdAt).format("MM/DD/YYYY")
            : "-",
          address: obj?.address ? obj?.address : "-",
          chwId: obj?.assign_to?._id,
          chwAssigned: obj?.assign_to
            ? `${obj?.assign_to?.firstName} ${obj?.assign_to?.lastName}`
            : null,
        };
        tempArray.push({ ...subObj });
      });
    }
    setData([...tempArray]);
  }, [clientLists]);

  const rowSelection = {
    selectedRowKeys: selectedUsers,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUsers(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      checked: selectedUsers?.length,
      style: !record?.chwAssigned ? {} : { display: "none" },
    }),
  };

  //For filter column
  //data?.every(user => user?.assign_to)
  const filteredColumns = clientColumn.filter((column) => column !== null);

  return (
    <div className="dashboard_table_wrapper">
      <Table
        rootClassName={`user_table`}
        onRow={(record) => {
          return {
            onClick: (e) => handleRowClick(record, e, "users"),
          };
        }}
        rowSelection={{ type: "checkbox", ...rowSelection }}
        loading={clientLoading}
        columns={filteredColumns}
        dataSource={data}
        sticky={true}
        pagination={{
          total: totalClient,
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
        showSorterTooltip={false}
        // className='user-table'
      />
    </div>
  );
};
export default ClientLists;
