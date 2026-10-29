import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DisableSorting } from "../../../helpers";
import { deleteIcon, viewIcon } from "../../../assets/icons";

const ImportedClientList = ({
  clientList,
  importLoading,
  handleClickModal,
}) => {
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const clientColumn = [
    {
      title: "No",

      width: 80,
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      ellipsis: true,
      sorter: (a, b) => a?.firstName?.localeCompare(b?.firstName),
      render: (_, record) => (
        <div>
          <span>{record?.firstName}</span>
          {record?.status === "Pending" && <Tag color="#f50">New</Tag>}
        </div>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => a?.lastName?.localeCompare(b?.lastName),
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => b?.phone - a?.phone,
    },
    {
      title: "Address",
      dataIndex: "address",
      ellipsis: true,
      sorter: (a, b) => a?.address?.localeCompare(b?.address),
    },

    {
      title: "Community Health Worker Assigned",
      dataIndex: "chwAssigned",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a?.chwAssigned?.localeCompare(b?.chwAssigned),
      render: (_, record) => (
        <div>
          <span>{record?.chwAssigned ? record?.chwAssigned : "-"}</span>
        </div>
      ),
    },
    // { title: "Status", dataIndex: "status", sorter: (a, b) => a?.status?.localeCompare(b?.status) },
    {
      title: "Action",
      dataIndex: "action",
      width: 150,
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
        </div>
      ),
    },
  ];

  useEffect(() => {
    let tempData = [];
    if (clientList?.length > 0) {
      clientList?.map((clientData, i) => {
        let subObj = {
          key: clientData?._id,
          no: i + 1,
          firstName: clientData?.firstName ? clientData?.firstName : "-",
          lastName: clientData?.lastName ? clientData?.lastName : "-",
          email: clientData?.email ? clientData?.email : "-",
          phone: clientData?.Phone ? clientData?.Phone : "-",
          address: clientData?.address ? clientData?.address : "-",
          chwAssigned: clientData?.assign_to
            ? `${clientData?.assign_to?.firstName} ${clientData?.assign_to?.lastName}`
            : "-",
        };
        tempData.push(subObj);
      });
      setData(tempData);
    }
  }, [clientList]);

  return (
    <Table
      dataSource={data}
      columns={clientColumn}
      loading={importLoading}
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
      showSorterTooltip={false}
      sticky={true}
      scroll={{ x: 1000 }}
      // className="user-table"
    />
  );
};
export default ImportedClientList;
