import { Image, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteIcon,
  editIcon,
  newEditIcon,
  viewIcon,
} from "../../../assets/icons";
import { DisableSorting, getNumericDate } from "../../../helpers";
import pdf from "../../../assets/images/pdf.svg";
import FileViewerComponent from "../../../components/common/FileViewerComponent";

const ResourceLists = ({
  handleClickModal,
  resourceLists,
  loading,
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
      title: "Organization",
      dataIndex: "organization",
      ellipsis: true,
      width: 250,
      sorter: (a, b) => a?.organization?.localeCompare(b?.organization),
    },
    {
      title: "Resource",
      dataIndex: "resource_name",
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a?.resource_name?.localeCompare(b?.resource_name),
    },
    {
      title: "Resource Details",
      dataIndex: "resource_details",
      ellipsis: true,
      width: 250,
      sorter: (a, b) => a?.resource_details?.localeCompare(b?.resource_details),
    },
    {
      title: "Category",
      dataIndex: "category",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.category?.localeCompare(b?.category),
    },
    {
      title: "Eligibility",
      dataIndex: "eligibility",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a?.eligibility?.localeCompare(b?.eligibility),
    },
    {
      title: "Website",
      dataIndex: "website",
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a?.website?.localeCompare(b?.website),
      render: (text) =>
        text ? (
          <a
            href={text.startsWith("http") ? text : `http://${text}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {text}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
      render: (text) =>
        text ? (
          <a
            href={`mailto:${text}`}
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {text}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a?.phone?.localeCompare(b?.phone),
    },
    {
      title: "Attachment Name",
      dataIndex: "attachment_name",
      ellipsis: true,
      width: 140,
    },
    {
      title: "Attachment Files",
      dataIndex: "attachment_files",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Used Count",
      dataIndex: "usageCount",
      width: 200,
      sorter: (a, b) => a?.usageCount - b?.usageCount,
    },
    {
      title: "Non Worked Time Count",
      dataIndex: "nonWorkedCount",
      width: 200,
      sorter: (a, b) => a?.nonWorkedCount - b?.nonWorkedCount,
    },
    {
      title: "Created Date",
      dataIndex: "createAt",
      ellipsis: true,
      width: 140,
      sorter: (a, b) => a?.createAt?.localeCompare(b?.createAt),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span
              className="view"
              onClick={() => handleClickModal("viewResource", true, record)}
            >
              {viewIcon}
            </span>
          </Tooltip>
          <Tooltip title="Edit">
            <span
              className="view"
              onClick={() => handleClickModal("editResource", true, record)}
              style={{ color: "black" }}
            >
              {React.cloneElement(editIcon, { style: { color: "black" } })}
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              onClick={() => handleClickModal("deleteResource", true, record)}
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
    if (resourceLists.length) {
      resourceLists?.map((item, i) => {
        let subObj = {
          no: i + 1,
          key: item?._doc?._id,
          createAt: getNumericDate(item?._doc?.createdAt),
          organization: item?._doc?.organization
            ? item?._doc?.organization
            : "-",
          resource_details: item?._doc?.resource_details
            ? item?._doc?.resource_details
            : "-",
          website: item?._doc?.website ? item?._doc?.website : "-",
          email: item?._doc?.email ? item?._doc?.email : "-",
          phone: item?._doc?.phone ? item?._doc?.phone : "-",
          category: item?._doc?.category
            ? item?._doc?.category?.resource_category
            : "-",
          categoryId: item?._doc?.category?._id,
          eligibility: item?._doc?.eligibility ? item?._doc?.eligibility : "-",
          resource_name: item?._doc?.resource_name
            ? item?._doc?.resource_name
            : "-",
          attachment_name: item?._doc?.attachments?.name
            ? item?._doc?.attachments?.name
            : "-",
          attachment_files:
            item?._doc?.attachments?.files &&
            Array.isArray(item?._doc?.attachments?.files) &&
            (item?._doc?.attachments?.files).length > 0 ? (
              <FileViewerComponent
                url={item?._doc?.attachments?.files}
                i={i}
                view={"attachment-image"}
                renderIcon={false}
              />
            ) : (
              "-"
            ),
          usageCount: item?.usageCount ? item?.usageCount : "0",
          nonWorkedCount: item?.nonWorkedCount ? item?.nonWorkedCount : "0",
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [resourceLists]);

  return (
    <Table
      dataSource={data}
      columns={Column}
      loading={loading}
      sticky={true}
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
      scroll={{ x: 1400 }}
      showSorterTooltip={false}
    />
  );
};

export default ResourceLists;
