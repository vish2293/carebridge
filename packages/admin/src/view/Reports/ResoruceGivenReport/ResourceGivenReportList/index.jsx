import { Table } from "antd";
import { useEffect, useState } from "react";
import { DisableSorting, getNumericDate } from "../../../../helpers";

const ResourceGivenReportList = ({
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  loading,
  resourceGivenList,
  resourceGivenListCount,
}) => {
  const [data, setData] = useState([]);

  const resoruceGivenColumn = [
    {
      title: "No",
      width: 80,
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "Organization",
      dataIndex: "organization",
      width: 150,
      sorter: (a, b) => a?.organization?.localeCompare(b?.organization),
    },
    {
      title: "Resource Name",
      dataIndex: "resource_name",
      width: 200,
      sorter: (a, b) => a?.resource_name?.localeCompare(b?.resource_name),
    },
    {
      title: "Resource Details",
      dataIndex: "resource_details",
      width: 250,
      sorter: (a, b) => a?.resource_details?.localeCompare(b?.resource_details),
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 150,
      sorter: (a, b) => a?.category?.localeCompare(b?.category),
    },
    {
      title: "Eligibility",
      dataIndex: "eligibility",
      width: 150,
      sorter: (a, b) => a?.eligibility?.localeCompare(b?.eligibility),
    },
    {
      title: "Website Link",
      dataIndex: "website",
      width: 250,
      sorter: (a, b) => a?.website?.localeCompare(b?.website),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      width: 250,
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      width: 150,
      sorter: (a, b) => a?.phone?.localeCompare(b?.phone),
    },
    {
      title: "Used Count",
      dataIndex: "usageCount",
      width: 200,
      sorter: (a, b) => a?.usageCount?.localeCompare(b?.usageCount),
    },
    {
      title: "Non Worked Time Count",
      dataIndex: "nonWorkedCount",
      width: 200,
      sorter: (a, b) => a?.nonWorkedCount?.localeCompare(b?.nonWorkedCount),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: 150,
      sorter: (a, b) => a?.createdAt?.localeCompare(b?.createdAt),
    },
  ];

  useEffect(() => {
    let tempData = [];
    if (resourceGivenList?.length > 0) {
      resourceGivenList?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          organization: obj?.organization ? obj?.organization : "-",
          resource_name: obj?.resource_name ? obj?.resource_name : "-",
          resource_details: obj?.resource_details ? obj?.resource_details : "-",
          category: obj?.category ? obj?.category?.resource_category : "-",
          eligibility: obj?.eligibility ? obj?.eligibility : "-",
          website: obj?.website ? obj?.website : "-",
          email: obj?.email ? obj?.email : "-",
          phone: obj?.phone ? obj?.phone : "-",
          usageCount: obj?.usageCount ? obj?.usageCount : "0",
          nonWorkedCount: obj?.nonWorkedCount ? obj?.nonWorkedCount : "0",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [resourceGivenList]);

  return (
    <Table
      columns={resoruceGivenColumn}
      dataSource={data}
      loading={loading}
      pagination={{
        total: resourceGivenListCount,
        pageSize,
        current: pageNo,
        onChange: (pageNo, pageSize) => {
          setPageNo(pageNo);
          setPageSize(pageSize);
        },
        pageSizeOptions: [10, 25, 50, 100],
        showSizeChanger: true,
      }}
      sticky={true}
      showSorterTooltip={false}
      scroll={{ x: 1000 }}
    />
  );
};

export default ResourceGivenReportList;
