import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  DisableSorting,
  getFullDateTime,
  getNumericDate,
} from "../../../../helpers";

const VisitReportLists = ({
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  visitReportList,
  loading,
  visitReportListCount,
}) => {
  const [data, setData] = useState([]);

  const visitColumn = [
    {
      title: "No",
      width: 80,
      render: (_, __, index) => (
        <span>{DisableSorting(index, pageNo, pageSize)}</span>
      ),
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
    },
    {
      title: "Assigned Community Health Worker",
      dataIndex: "chwName",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a?.chwName?.localeCompare(b?.chwName),
    },
    {
      title: "Visit Type",
      dataIndex: "visitType",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => a?.visitType?.localeCompare(b?.visitType),
    },
    {
      title: "Visit Date",
      dataIndex: "visitDate",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => a?.visitDate?.localeCompare(b?.visitDate),
    },
    {
      title: "Length of Visit",
      dataIndex: "lengthOfvisit",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a?.lengthOfvisit?.localeCompare(b?.lengthOfvisit),
    },
    {
      title: "Client Story",
      dataIndex: "clientStory",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a?.clientStory?.localeCompare(b?.clientStory),
    },
    {
      title: "Client Goal",
      dataIndex: "client_goal",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a?.client_goal?.localeCompare(b?.client_goal),
    },
    {
      title: "Follow up Date",
      dataIndex: "followupDate",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a?.followupDate?.localeCompare(b?.followupDate),
    },
    {
      title: "Follow up Reason",
      dataIndex: "followupReason",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a?.followupReason?.localeCompare(b?.followupReason),
    },
    {
      title: "Primary Need",
      dataIndex: "primaryNeed",
      width: 150,
      ellipsis: true,
      render: (_, record) => {
        const primaryNeeds = record?.primaryNeed;
        if (Array.isArray(primaryNeeds)) {
          if (primaryNeeds.length) {
            const needs = primaryNeeds[0]?.name
              ? primaryNeeds.map((need) => need.name)
              : primaryNeeds;

            return (
              <Tooltip title={needs.join(", ")}>
                <div>
                  {needs.length > 1
                    ? needs.join(", ").substring(0, 15) + "..."
                    : needs.join(", ")}
                </div>
              </Tooltip>
            );
          } else {
            return <div>-</div>;
          }
        } else if (typeof primaryNeeds === "string") {
          return <span>{primaryNeeds}</span>;
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      title: "Pathway",
      dataIndex: "pathway",
      width: 150,
      ellipsis: true,
      render: (_, record) => {
        const pathways = record?.pathway;
        if (Array.isArray(pathways)) {
          if (pathways.length) {
            const names = pathways.map((pathway) => pathway.name);
            return (
              <Tooltip title={names.join(", ")}>
                <div>
                  {names.length > 1
                    ? names.join(", ").substring(0, 15) + "..."
                    : names.join(", ")}
                </div>
              </Tooltip>
            );
          } else {
            return <div>-</div>;
          }
        } else if (pathways?.name) {
          return <span>{pathways.name}</span>;
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: 130,
      ellipsis: true,
      sorter: (a, b) => a?.createdAt?.localeCompare(b?.createdAt),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      width: 130,
      ellipsis: true,
      sorter: (a, b) => a?.updatedAt?.localeCompare(b?.updatedAt),
    },
  ];

  useEffect(() => {
    let tempArr = [];
    if (visitReportList?.length > 0) {
      visitReportList?.forEach((item, index) => {
        let obj = { ...item };
        let subObj = {
          no: index + 1,
          key: obj?._id,
          clientId: obj?.clientId?._id,
          clientName: `${obj?.clientId?.firstName} ${obj?.clientId?.lastName}`,
          chwName: `${obj?.assign_to?.firstName} ${obj?.assign_to?.lastName}`,
          visitType: obj?.visitType ? obj?.visitType : "-",
          visitDate: obj?.visitDate ? getNumericDate(obj?.visitDate) : "-",
          lengthOfvisit: obj?.lengthOfvisit
            ? `${obj?.lengthOfvisit} ${obj?.lengthOfvisitUnit}`
            : "-",
          clientStory: obj?.clientStory ? obj?.clientStory : "-",
          client_goal: obj?.clientId?.client_goal
            ? obj?.clientId?.client_goal
            : "-",
          followupDate: obj?.followupDate
            ? getFullDateTime(obj?.followupDate)
            : "-",
          followupReason: obj?.followupReason ? obj?.followupReason : "-",
          pathway: obj?.pathway ? obj?.pathway : "-",
          primaryNeed: obj?.primaryNeed ? obj?.primaryNeed : "-",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
          updatedAt: obj?.updatedAt ? getNumericDate(obj?.updatedAt) : "-",
        };
        tempArr.push({ ...subObj });
      });
    }
    setData([...tempArr]);
  }, [visitReportList]);

  return (
    <Table
      loading={loading}
      dataSource={data}
      pagination={{
        total: visitReportListCount,
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
      columns={visitColumn}
      scroll={{ x: 1000 }}
      sticky={true}
    />
  );
};

export default VisitReportLists;
