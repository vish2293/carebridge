import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { DisableSorting, getNumericDate } from "../../../../helpers";
import { getObjectiveValues } from "../../../../helpers/objectiveValue";
import { objectiveOptions, typeValueOption } from "../../../../constant/array";

const ObjectiveReportList = ({
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  objectiveReportList,
  objectiveReportListCount,
}) => {
  const [data, setData] = useState([]);

  const objectiveColumn = [
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
      title: "Type",
      dataIndex: "label",
      width: 150,
      sorter: (a, b) => a?.label?.localeCompare(b?.label),
      render: (_, record) => <div>{getObjectiveValues(record?.label)}</div>,
    },
    {
      title: "From",
      dataIndex: "fromValue",
      width: 100,
      sorter: (a, b) => a?.fromValue?.localeCompare(b?.fromValue),
      render: (_, record) => (
        <div>
          {typeValueOption.find((v) => v?.value === record?.fromValue)?.label}
        </div>
      ),
    },
    {
      title: "To",
      dataIndex: "toValue",
      width: 100,
      sorter: (a, b) => a?.toValue?.localeCompare(b?.toValue),
      render: (_, record) => (
        <div>
          {objectiveOptions?.find((v) => v?.value === record?.toValue)?.label}
        </div>
      ),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      width: 120,
      sorter: (a, b) => a?.updatedAt?.localeCompare(b?.updatedAt),
    },
  ];

  useEffect(() => {
    let tempData = [];
    if (objectiveReportList?.length > 0) {
      objectiveReportList?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          clientName: `${obj?.clientId?.firstName} ${obj?.clientId?.lastName}`,
          // chwAssigned: `${obj?.visitId?.assign_to?.firstName} ${obj?.visitId?.assign_to?.lastName}`,
          label: obj?.label ? obj?.label : "-",
          fromValue: obj?.fromValue ? obj?.fromValue : "-",
          toValue: obj?.value ? obj?.value : "-",
          createdAt: obj?.createdAt ? getNumericDate(obj?.createdAt) : "-",
          updatedAt: obj?.updatedAt ? getNumericDate(obj?.updatedAt) : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [objectiveReportList]);

  return (
    <Table
      columns={objectiveColumn}
      dataSource={data}
      pagination={{
        total: objectiveReportListCount,
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
      showSorterTooltip={false}
      scroll={{ x: 1000 }}
    />
  );
};

export default ObjectiveReportList;
