/* eslint-disable react/prop-types */
import { Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DisableSorting, getNumericDate } from "../../../../helpers";

const ClientList = ({
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  clientLists,
  loading,
  userReportListsCount,
}) => {
  const { loggedInUser } = useSelector((state) => state.user);
  //For table data
  const [data, setData] = useState([]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
      width: 120,
      sorter: (a, b) => a?.firstName?.localeCompare(b?.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      width: 120,
      sorter: (a, b) => a?.lastName?.localeCompare(b?.lastName),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
    },
    {
      title: "Phone",
      dataIndex: "Phone",
      width: 150,
      sorter: (a, b) => b?.Phone - a?.Phone,
    },
    {
      title: "Date of Birth",
      dataIndex: "birthDate",
      width: 130,
      sorter: (a, b) => {
        return new Date(a?.birthDate) - new Date(b?.birthDate);
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 120,
      ellipsis: true,
      sorter: (a, b) => a?.address?.localeCompare(b?.address),
    },
    {
      title: "Language",
      dataIndex: "language",
      width: 120,
      ellipsis: true,
      sorter: (a, b) => a?.language?.localeCompare(b?.language),
    },
    {
      title: "Describes",
      dataIndex: "describes",
      width: 120,
      ellipsis: true,
      sorter: (a, b) => a?.describes?.localeCompare(b?.describes),
    },
    {
      title: "Pronounce",
      dataIndex: "pronounce",
      width: 120,
      ellipsis: true,
      sorter: (a, b) => a?.pronounce?.localeCompare(b?.pronounce),
    },
    {
      title: "Zip Code",
      dataIndex: "zipCode",
      width: 120,
      ellipsis: true,
      sorter: (a, b) => a?.zipCode?.localeCompare(b?.zipCode),
    },

    loggedInUser?.role === "Program_Administrator"
      ? {
          title: "Assigned Community Health Worker",
          dataIndex: "chwName",
          width: 150,
          sorter: (a, b) => a?.chwName?.localeCompare(b?.chwName),
          render: (_, record) => (
            <div>
              <span>{record?.chwName ? record?.chwName : "-"}</span>
            </div>
          ),
        }
      : null,
    {
      title: "Program",
      dataIndex: "program",
      width: 140,
      ellipsis: true,
      sorter: (a, b) => a?.program?.localeCompare(b?.program),
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
      render: (_, record) => (
        <div>
          <span className={`task-${record?.status}`}>{record?.status}</span>
        </div>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => a?.createdAt?.localeCompare(b?.createdAt),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => a?.updatedAt?.localeCompare(b?.updatedAt),
    },
  ];

  useEffect(() => {
    const tempData = [];
    if (clientLists?.length > 0) {
      clientLists?.forEach((item, i) => {
        const preferred_language = item?.profileQuestion?.find(
          (item) => item?.question?.question === "preferred_language"
        );
        const best_describes_you = item?.profileQuestion?.find(
          (item) => item?.question?.question === "best_describes_you"
        );
        const pronouns_prefer = item?.profileQuestion?.find(
          (item) => item?.question?.question === "pronouns_prefer"
        );
        const language = preferred_language?.answer
          ?.map((ansers) => ansers?.answer)
          ?.join("/");
        const pronounce = pronouns_prefer?.answer
          ?.map((ansers) => ansers?.answer)
          ?.join("/");
        const describes = best_describes_you?.answer
          ?.map((ansers) => ansers?.answer)
          ?.join("/");

        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          firstName: obj?.firstName ? obj?.firstName : "-",
          lastName: obj?.lastName ? obj?.lastName : "-",
          Phone: obj?.Phone,
          email: obj?.email,
          birthDate: obj?.birthDate ? getNumericDate(obj?.birthDate) : "-",
          address: obj?.address ? obj?.address : "-",
          zipCode: obj?.zipCode ? obj?.zipCode : "-",
          chwName: obj?.assign_to?.firstName
            ? `${obj?.assign_to?.firstName} ${obj?.assign_to?.lastName}`
            : "-",
          status: obj?.status,
          language: language ? language : "-",
          pronounce: pronounce ? pronounce : "-",
          describes: describes ? describes : "-",
          program: obj?.program ? obj?.program : "-",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
          updatedAt: obj?.updatedAt ? getNumericDate(obj?.updatedAt) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [clientLists]);
  const filteredColumns = clientColumn?.filter((colm) => colm !== null);
  return (
    <div className="dashboard_table_wrapper">
      <Table
        columns={filteredColumns}
        dataSource={data}
        loading={loading}
        pagination={{
          total: userReportListsCount,
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
        scroll={{ x: 1400 }}
        showSorterTooltip={false}
      />
    </div>
  );
};
export default ClientList;
