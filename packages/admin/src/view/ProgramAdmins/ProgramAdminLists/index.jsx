import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DisableSorting } from "../../../helpers";
import { deleteIcon, viewIcon } from "../../../assets/icons";

const ProgramAdminLists = ({
  PALists,
  loading,
  handleClickModal,
  handleRowClick,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const paColumn = [
    {
      title: "No",
      width: 80,
      fixed: "left",
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "PA Name",
      dataIndex: "paName",
      width: 200,
      sorter: (a, b) => a.paName.localeCompare(b.paName),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      width: 250,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Contact No",
      dataIndex: "contact",
      width: 150,
      sorter: (a, b) => a.contact.localeCompare(b.contact),
    },
    {
      title: "Program",
      dataIndex: "program",
      width: 150,
      sorter: (a, b) => {
        const programA = Array.isArray(a?.program)
          ? a.program.join(", ")
          : a.program || "";
        const programB = Array.isArray(b?.program)
          ? b.program.join(", ")
          : b.program || "";
        return programA.localeCompare(programB);
      },
      render: (text) => {
        if (Array.isArray(text)) {
          return text.join(", ");
        }
        return text || "";
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 200,
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "ZipCode",
      dataIndex: "zipcode",
      width: 120,
      sorter: (a, b) => a.zipcode.localeCompare(b.zipcode),
    },
    {
      title: "No. of CHW",
      dataIndex: "chwCount",
      width: 150,
      sorter: (a, b) => a.chwCount - b.chwCount, // Sorting numerically
    },
    {
      title: "Action",
      fixed: "right",
      dataIndex: "action",
      width: 150,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span
              onClick={() => navigate(`/app/program_admin/${record?.key}`)}
              className="view"
            >
              {viewIcon}
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              onClick={() => handleClickModal("deletePA", true, record)}
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
    let temArray = [];
    if (PALists?.data?.length > 0) {
      PALists?.data?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          paName: obj?.firstName ? `${obj?.firstName} ${obj?.lastName}` : "-",
          email: obj?.email ? obj?.email : "-",
          contact: obj?.Phone ? obj?.Phone : "-",
          address: obj?.address ? obj?.address : "-",
          zipcode: obj?.zipCode ? obj?.zipCode : "-",
          program: obj?.pa_program ? obj?.pa_program : "-",
          chwCount: obj?.chwCount ? obj.chwCount : "0",
          key: obj?._id,
        };
        temArray.push({ ...subObj });
      });
    }
    setData([...temArray]);
  }, [PALists]);

  return (
    <div className="dashboard_table_wrapper">
      <Table
        onRow={(record) => ({
          onClick: (e) => handleRowClick(record, e, "program_admin"),
        })}
        pagination={{
          total: data?.length,
          pageSize,
          current: pageNo,
          onChange: (pageNo, pageSize) => {
            setPageNo(pageNo);
            setPageSize(pageSize);
          },
          pageSizeOptions: [10, 25, 50, 100],
          showSizeChanger: true,
        }}
        loading={loading}
        columns={paColumn}
        dataSource={data}
        sticky={true}
        scroll={{ x: 1000 }}
        className="user-table"
        showSorterTooltip={false}
      />
    </div>
  );
};

export default ProgramAdminLists;
