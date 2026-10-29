import { Table, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteIcon, exclamationIcon, viewIcon } from "../../../assets/icons";
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "../../../components/modal/DeleteModal";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../../redux/actions/user";
import { getPAwiseCHW } from "../../../redux/actions/programAdmin";
import { DisableSorting } from "../../../helpers";

const PACHWList = ({
  chwClientLists,
  handleClickModal,
  isOpen,
  setIsOpen,
  modalAction,
}) => {
  const { chwClientLoading } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [chwId, setChwId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { id } = useParams();

  const handleDispatchAction = () => {
    dispatch(deleteUser({ id: chwId })).then((res) => {
      if (res?.payload?.status === true) {
        setIsOpen(false);
        message.success("Community Health Worker deleted successfully!");
        const payload = {
          search: "",
          id,
        };
        dispatch(getPAwiseCHW(payload));
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  const chwListsColumn = [
    {
      title: "No",
      width: 80,
      render: (_, __, index) => (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      title: "Community Health Worker Name",
      dataIndex: "chwName",
      sorter: (a, b) => a?.chwName?.localeCompare(b?.chwName),
    },
    {
      title: "No. of Users",
      dataIndex: "usersCount",
      sorter: (a, b) => b?.usersCount - a?.usersCount,
    },
    {
      title: "No. of Action Steps",
      dataIndex: "requestCount",
      sorter: (a, b) => b?.requestCount - a?.requestCount,
    },
    {
      title: "No. of Next steps",
      dataIndex: "taskCount",
      sorter: (a, b) => b?.taskCount - a?.taskCount,
    },
    {
      title: "Action",
      fixed: "right",
      dataIndex: "action",
      width: 120,
      render: (_, record) => (
        <div className="accept-reject">
          <Tooltip title="View">
            <span
              onClick={() => navigate(`/app/chw/${record?.key}`)}
              className="view"
            >
              {viewIcon}
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              onClick={() => {
                setChwId(record.key);
                handleClickModal("deleteCHW", true, record);
              }}
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
    let tempData = [];
    if (chwClientLists?.length > 0) {
      chwClientLists?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?.user?._id,
          chwName: obj?.user?.firstName + " " + obj?.user?.lastName,
          usersCount: obj?.usersCount,
          requestCount: obj?.requestCount,
          taskCount: obj?.taskCount,
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [chwClientLists]);

  return (
    <>
      <Table
        columns={chwListsColumn}
        dataSource={data}
        sticky={true}
        pagination={{
          total: data.length,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: 1000 }}
        loading={chwClientLoading}
      />
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`Are you sure you want to delete this Community Health Worker?`}
        description={`This Community Health Worker and its details will be deleted permanently!`}
        icon={exclamationIcon}
        modalAction={modalAction === "deleteCHW"}
        handleDispatchAction={handleDispatchAction}
      />
    </>
  );
};

export default PACHWList;
