import { Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { deleteIcon, editIcon, viewIcon } from "../../../assets/icons";
import { DisableSorting } from "../../../helpers";

const PathwayLists = ({
  PALists,
  PALoading,
  handleClickModal,
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
}) => {
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
      title: "Pathway Name",
      dataIndex: "name",
      ellipsis: true,
      width: 180,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Need",
      dataIndex: "need",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.need?.name.localeCompare(b.need?.name),
      render: (need) => need?.name || "-",
    },
    {
      title: "Outcomes",
      dataIndex: "description",
      ellipsis: true,
      width: 300,
      render: (text) => {
        const displayText = Array.isArray(text) ? text.join(", ") : text;
        const truncatedText =
          displayText.length > 40
            ? displayText.slice(0, 40) + "..."
            : displayText;

        return <span title={displayText}>{truncatedText}</span>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      ellipsis: true,
      width: 150,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: "Action",
      fixed: "right",
      dataIndex: "action",
      width: 80,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span
              onClick={() => handleClickModal("viewPathway", true, record)}
              className="view"
            >
              {viewIcon}
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
          name: obj?.name ? obj?.name : "-",
          need: obj?.need ? obj?.need : "-",
          description: obj?.description ? obj?.description : "-",
          createdAt: obj?.createdAt
            ? dayjs(obj?.createdAt).format("YYYY-MM-DD")
            : "-",
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
        loading={PALoading}
        columns={paColumn}
        dataSource={data}
        sticky={true}
        scroll={{ x: 1000 }}
        showSorterTooltip={false}
      />
    </div>
  );
};

export default PathwayLists;
