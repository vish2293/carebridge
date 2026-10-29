import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { DisableSorting, getNumericDate } from "../../../helpers";
import { deleteIcon, newEditIcon } from "../../../assets/icons";

const ResourceCategoryLists = ({
  categoryLists,
  loading,
  Action,
  handleClickModal,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
}) => {
  const [data, setData] = useState();

  const Column = [
    {
      title: "No",
      width: 80,
      render: (_, __, index) => {
        return <span>{DisableSorting(index, pageNo, pageSize)}</span>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      ellipsis: true,
      sorter: (a, b) => a?.category?.localeCompare(b?.category),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      ellipsis: true,
      sorter: (a, b) => a?.createdBy?.localeCompare(b?.createdBy),
    },
    {
      title: "Modified By",
      dataIndex: "modifyBy",
      ellipsis: true,
      sorter: (a, b) => a?.modifyBy?.localeCompare(b?.modifyBy),
    },
    {
      title: "Created Date",
      dataIndex: "createAt",
      ellipsis: true,
      width: 130,
      sorter: (a, b) => a?.createAt?.localeCompare(b?.createAt),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="Edit">
            <span
              className="view"
              onClick={() => handleClickModal("editCategory", true, record)}
            >
              {newEditIcon}
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              onClick={() => handleClickModal("deleteCategory", true, record)}
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
    const tempData = [];
    if (categoryLists.length) {
      categoryLists?.map((item, i) => {
        let subObj = {
          no: i + 1,
          key: item?._id,
          category: item?.resource_category ? item?.resource_category : "-",
          createAt: getNumericDate(item?.createdAt),
          createdBy: item?.createdBy
            ? `${item?.createdBy?.firstName} ${item?.createdBy?.lastName}`
            : "-",
          modifyBy: item?.modifiedBy
            ? `${item?.modifiedBy?.firstName} ${item?.modifiedBy?.lastName}`
            : "-",
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [categoryLists]);

  return (
    <Table
      dataSource={data}
      columns={Column}
      sticky={true}
      loading={loading}
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
    />
  );
};

export default ResourceCategoryLists;
