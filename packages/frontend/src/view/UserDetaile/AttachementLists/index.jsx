import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { deleteIcon, viewIcon } from "../../../assets/icons";
import FileViewerComponent from "../../../components/common/FileViewerComponent";
import { DisableSorting, getNumericDate } from "../../../helpers";
const AttachmentLists = ({
  attachmentLists,
  loading,
  handleClickModal,
  modalAction,
}) => {
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const Column = [
    {
      title: "No",
      width: 50,
      render: (_, __, index) => (
        <span>{DisableSorting(index, pageNo, pageSize)}</span>
      ),
    },
    { title: "File", dataIndex: "file", ellipsis: true, width: 100 },
    { title: "Name", dataIndex: "name", ellipsis: true, width: 100 },
    { title: "Date", dataIndex: "date", width: 150 },
    {
      title: "Action",
      dataIndex: "action",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span
              onClick={() => handleClickModal("viewAttachment", true, record)}
              className="view"
            >
              {viewIcon}
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              onClick={() => handleClickModal("deleteAttachment", true, record)}
              className="delete-icon"
            >
              {deleteIcon}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];
  useEffect(() => {
    let tempArray = [];
    if (attachmentLists?.length > 0) {
      attachmentLists?.map((attachmentItems, i) => {
        let subObj = {
          key: attachmentItems?._id,
          no: i + 1,
          name: attachmentItems?.name,
          url: attachmentItems?.files,
          file: (
            <FileViewerComponent
              url={attachmentItems?.files}
              i={i}
              view={"attachment-image"}
              renderIcon={false}
            />
          ),
          date: getNumericDate(attachmentItems?.createdAt),
        };
        tempArray.push({ ...subObj });
      });
    }
    setData(tempArray);
  }, [attachmentLists]);

  return (
    <Table
      loading={loading}
      dataSource={data}
      columns={Column}
      sticky={true}
      className="attacment-tbl"
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
      scroll={{ x: 500 }}
    />
  );
};
export default AttachmentLists;
