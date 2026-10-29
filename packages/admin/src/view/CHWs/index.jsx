/* eslint-disable no-case-declarations */
import { Badge, Button, Space, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { exclamationIcon, pluseIcon, viewIcon } from "../../assets/icons";
import Loader from "../../components/common/Loader";
import Search from "../../components/common/Search";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import DeleteChwAndClientModal from "../../components/modal/DeleteModal";
import AssignCHWDropdown from "../../components/common/AssignChwDropdown";
import {
  allChw,
  createChwAndClient,
  deleteUser,
} from "../../redux/actions/user";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ChwLists from "../CHWs/ChwLists";
import "./style.scss";

const CHWs = () => {
  const {
    chwList,
    clientList,
    loggedInUser,
    chwLoading,
    totalClient,
    totalChw,
    clientLoading,
  } = useSelector((state) => state.user);
  const { requestList } = useSelector((state) => state.request);
  const navigate = useNavigate();
  const { userRequestTodoList } = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Client");
  const [clientLists, setClientLists] = useState([]);
  const [chwLists, setChwLists] = useState([]);
  const [clientId, setClientId] = useState("");
  const [chwId, setChwId] = useState("");
  const [chwCount, setChwCount] = useState(0);
  const [initialValues, setInitialValues] = useState({});
  const [opeDeleteModal, setOpenDeleteModal] = useState(false);
  const [modalAction, setModalAction] = useState("default");
  const [placeholder, setPlaceHolder] = useState("Search Users");
  const [status, setStatus] = useState("");
  const [byCHW, setByCHW] = useState("");
  const [search, setSearch] = useState("");
  const [chwName, setChwName] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const [multipleChw, setMultipleChw] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [addClientLoading, setAddClientLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const urlParams = new URLSearchParams(window.location.search);
  const statusFromDashboard = urlParams.get("status");

  let prevUrl;
  if (statusFromDashboard) {
    prevUrl = localStorage.getItem("prevUrl");
  }

  useEffect(() => {
    dispatch(
      setActiveHeader({
        name: prevUrl == "/app" ? "dashboard" : "chw",
        heading: prevUrl == "/app" ? "Go back" : "CHWs",
      })
    );
  }, [pageNo, pageSize]);

  useEffect(() => {
    setChwCount(totalChw);
  }, [totalChw]);

  useEffect(() => {
    if (
      loggedInUser?.role === "Super_Admin" ||
      loggedInUser?.role === "Program_Administrator"
    ) {
      dispatch(allChw());
    }
  }, [loggedInUser?.role]);

  useEffect(() => {
    setChwLists(chwList || []);
  }, [chwList]);

  const handleOnChangeSearch = (value) => {
    setSearch(value);
    clearTimeout(debounceTimeout);
    const newTime = setTimeout(() => {
      handleFilter(value, byCHW, status);
    }, 500);
    setDebounceTimeout(newTime);
  };

  const handleFilter = async (search) => {
    dispatch(allChw(search));
    setPageNo(1);
    setPageSize(25);
  };

  //For handle modal Click
  const handleClickModal = (action, open, data, rowId) => {
    switch (action) {
      case "addChw":
        setInitialValues({});
        setModalAction(action);
        break;
      case "deleteChw":
        setModalAction(action);
        setChwId(data?.key);
        setOpenDeleteModal(open);
        break;
      default:
        break;
    }
  };

  //For handle dispatch action
  const handleDispatchAction = (action, form) => {
    switch (action) {
      case "addChw":
        form
          .validateFields()
          .then((values) => {
            values.role = "CHW";
            values.userId = loggedInUser?._id;
            values.is_Verified = true;
            setAddClientLoading(true);
            dispatch(createChwAndClient(values)).then((res) => {
              if (res?.payload?.status === true) {
                dispatch(allChw());
                message.success("Community Health Worker added successfully!");
                form.resetFields();
                setChwCount((prevCount) => prevCount + 1);
                modalClose();
                // dispatch(allChw())
              } else {
                message.error(res?.payload?.message);
              }
            });
          })
          .catch(() => {
            message.error(
              "Please fill in all required fields  check your form."
            );
          });
        break;
      case "deleteChw":
        dispatch(deleteUser({ id: chwId })).then((res) => {
          if (res?.payload?.status === true) {
            const tempChwLists = [...chwLists];
            const index = tempChwLists.findIndex(
              (v) => v?._id === res?.payload?.data?._id
            );
            tempChwLists?.splice(index, 1);
            setChwLists(tempChwLists);
            setChwCount((prevCount) => prevCount - 1);
            setOpenDeleteModal(false);
            message.success("Community Health Worker deleted successfully!");
            dispatch(allChw());
          } else {
            message.error("Something went wrong!");
          }
        });
        break;
      default:
        break;
    }
  };

  //For handle row click
  const handleRowClick = (record, e, from) => {
    setClientId(record?.key);
    if (
      !e.target.closest(".accept") &&
      !e.target.closest(".reject") &&
      !e.target.closest(".chw-option") &&
      !e.target.closest(".ant-select-item-option-content") &&
      !e.target.closest(".e.target.closest") &&
      !e.target.closest(".merge") &&
      !e.target.closest(".ant-dropdown-menu")
    ) {
      navigate(`/app/${from}/${record?.key}`);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setByCHW("");
    setStatus("");
    handleFilter("", "", "");
    window.history.replaceState({}, "", window.location.pathname);
  };

  const CHWTabLabel = () => {
    return (
      <>
        <Badge
          count={chwCount}
          showZero
          overflowCount={Number.MAX_SAFE_INTEGER}
        />
      </>
    );
  };

  const modalClose = () => {
    setModalAction("default");
    setClientId("");
    setChwId("");
    setChwName("");
    setMultipleChw("");
    setAddClientLoading(false);
    if (selectedRow) {
      setClientLists((prev) =>
        prev.map((user) => {
          if (user._id === selectedRow) {
            return {
              ...user,
              chwNames: "", // Set chwNames to empty string
            };
          }
          return user; // Return unchanged user for other users
        })
      );
    }
    setSelectedUsers([]);
  };

  return clientLoading ? (
    <Loader className={"page-loader"} />
  ) : (
    <>
      <div className="user_wrapper">
        <div className="status-sec">
          <div className="status-sec-left">
            <div className="dashboard-heading">
              All CHWs <span style={{ margin: "auto" }}>{<CHWTabLabel />}</span>{" "}
            </div>
          </div>
          <div className="status-sec-right">
            <Button onClick={handleResetFilters} disabled={!search && !status}>
              Clear Filters
            </Button>
            <Search
              value={search}
              handleOnChangeSearch={handleOnChangeSearch}
              placeholder={placeholder}
            />
            <div className="request-btn">
              <Button
                type="primary"
                className="yellow-btn"
                icon={pluseIcon}
                onClick={() => handleClickModal("addChw", true)}
              >
                ADD
              </Button>
            </div>
          </div>
        </div>
        <div className="user_table_wrapper">
          <ChwLists
            chwLists={chwLists}
            userRequestTodoList={userRequestTodoList}
            requestList={requestList}
            clientList={clientList}
            chwLoading={chwLoading}
            handleRowClick={handleRowClick}
            handleClickModal={handleClickModal}
            pageNo={pageNo}
            pageSize={pageSize}
            setPageNo={setPageNo}
            setPageSize={setPageSize}
          />
        </div>
      </div>
      {
        <AddChwAndClientModal
          isOpen={modalAction === "addChw"}
          modalClose={modalClose}
          btnLoading={addClientLoading}
          initialValues={initialValues}
          modalAction={modalAction}
          handleSubmit={handleDispatchAction}
        />
      }
      {opeDeleteModal && (
        <DeleteChwAndClientModal
          isOpen={opeDeleteModal}
          setIsOpen={setOpenDeleteModal}
          title={`Are you sure you want to delete this Community Health Worker?`}
          description={`This Community Health Worker and its detail will be deleted permanently!`}
          icon={exclamationIcon}
          modalAction={modalAction}
          handleDispatchAction={handleDispatchAction}
        />
      )}
    </>
  );
};

export default CHWs;
