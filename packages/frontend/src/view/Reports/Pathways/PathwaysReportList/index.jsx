import { Table } from "antd";
import { useEffect, useState } from "react";
import { DisableSorting, getNumericDate } from "../../../../helpers";

const PathwaysReportList = ({
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  loading,
  pathwayList,
  pathwayListCount,
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
      title: "Client Name",
      dataIndex: "clientName",
      width: 150,
      sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
    },
    {
      title: "Pathway Name",
      dataIndex: "name",
      width: 150,
      sorter: (a, b) => a?.name?.localeCompare(b?.name),
    },
    {
      title: "Primary Need",
      dataIndex: "need",
      width: 200,
      sorter: (a, b) => a?.need?.localeCompare(b?.need),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 200,
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
    },
    {
      title: "Outcomes",
      dataIndex: "outcomes",
      width: 250,
      sorter: (a, b) => a?.description?.localeCompare(b?.description),
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
    if (pathwayList?.length > 0) {
      pathwayList?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          name: obj?.pathwayId?.name ? obj?.pathwayId?.name : "-",
          outcomes:
            Array.isArray(obj?.outcomes) && (obj?.outcomes).length > 0
              ? obj.outcomes.join(", ")
              : "-",
          need: obj?.pathwayId?.need?.name ? obj?.pathwayId?.need?.name : "-",
          clientName: obj?.userId
            ? obj?.userId.firstName + " " + obj?.userId.lastName
            : "-",
          status: obj?.status ? obj?.status : "-",
          requestCount: obj?.requestCount ? obj?.requestCount : "0",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [pathwayList]);

  return (
    <Table
      columns={resoruceGivenColumn}
      dataSource={data}
      loading={loading}
      pagination={{
        total: pathwayListCount,
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

export default PathwaysReportList;
