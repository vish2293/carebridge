/* eslint-disable no-case-declarations */
import { Badge, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { exclamationIcon, pluseIcon } from "../../assets/icons";
import Search from "../../components/common/Search";
import AddAndEditPAModal from "../../components/modal/AddAndEditPAModal";
import DeleteChwAndClientModal from "../../components/modal/DeleteModal";
import { createPA, deletePA, getAllPA } from "../../redux/actions/programAdmin";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ProgramAdminLists from "./ProgramAdminLists";
import "./style.scss";

const ProgramAdmins = () => {
  const { PAList, PALoading } = useSelector((state) => state.programAdmin);
  const { loggedInUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [PALists, setPALists] = useState([]);
  const [clientId, setClientId] = useState("");
  const [paId, setPaId] = useState("");
  const [PACount, setPACount] = useState(0);
  const [initialValues, setInitialValues] = useState({});
  const [opeDeleteModal, setOpenDeleteModal] = useState(false);
  const [modalAction, setModalAction] = useState("default");
  const [search, setSearch] = useState("");
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
        name: prevUrl == "/app" ? "dashboard" : "program_admin",
        heading: prevUrl == "/app" ? "Go back" : "Program Administartors",
      })
    );
  }, [pageNo, pageSize]);

  useEffect(() => {
    setPACount(PAList.length);
  }, [PAList.length]);

  useEffect(() => {
    if (loggedInUser?.role === "Super_Admin") {
      dispatch(getAllPA());
    }
  }, [loggedInUser?.role]);

  useEffect(() => {
    setPALists(PAList || []);
  }, [PAList]);

  const handleOnChangeSearch = (value) => {
    setSearch(value);
    clearTimeout(debounceTimeout);
    const newTime = setTimeout(() => {
      handleFilter(value);
    }, 500);
    setDebounceTimeout(newTime);
  };

  const handleFilter = async (search) => {
    dispatch(getAllPA(search));
    setPageNo(1);
    setPageSize(25);
  };

  //For handle modal Click
  const handleClickModal = (action, open, data, rowId) => {
    switch (action) {
      case "addPA":
        setInitialValues({});
        setModalAction(action);
        break;
      case "deletePA":
        setModalAction(action);
        setPaId(data?.key);
        setOpenDeleteModal(open);
        break;
      default:
        break;
    }
  };

  //For handle dispatch action
  const handleDispatchAction = (action, form) => {
    switch (action) {
      case "addPA":
        setAddClientLoading(true);
        form.validateFields().then((values) => {
          dispatch(createPA(values))
            .then((res) => {
              if (res?.payload?.status === true) {
                message.success("Program Admin added successfully!");
                dispatch(getAllPA());
                form.resetFields();
                modalClose();
              } else {
                message.error(res?.payload?.message);
              }
              setAddClientLoading(false);
            })
            .catch((error) => {
              message.error(
                "Please fill in all required fields and check your form.",
                error
              );
            });
        });
        break;
      case "deletePA":
        dispatch(deletePA(paId)).then((res) => {
          if (res?.payload?.status === true) {
            dispatch(getAllPA());
            setOpenDeleteModal(false);
            message.success("Program Administrator deleted successfully!");
          } else {
            message.error("Something went wrong!");
          }
        });
        break;
      default:
        break;
    }
  };

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
    handleFilter("");
    window.history.replaceState({}, "", window.location.pathname);
  };

  const CHWTabLabel = () => {
    return (
      <>
        <Badge
          count={PAList.length}
          showZero
          overflowCount={Number.MAX_SAFE_INTEGER}
        />
      </>
    );
  };

  const modalClose = () => {
    setModalAction("default");
    setAddClientLoading(false);
    setInitialValues({});
    setClientId("");
    setPaId("");
  };

  return (
    <>
      <div className="user_wrapper">
        <div className="status-sec">
          <div className="status-sec-left">
            <div className="dashboard-heading">
              All Program Administrators{" "}
              <span style={{ margin: "auto" }}>{<CHWTabLabel />}</span>{" "}
            </div>
          </div>
          <div className="status-sec-right">
            <Button onClick={handleResetFilters} disabled={!search}>
              Clear Filters
            </Button>
            <Search
              value={search}
              handleOnChangeSearch={handleOnChangeSearch}
              placeholder={"Search Program Admin"}
            />
            <div className="request-btn">
              <Button
                type="primary"
                className="yellow-btn"
                icon={pluseIcon}
                onClick={() => handleClickModal("addPA", true)}
              >
                ADD
              </Button>
            </div>
          </div>
        </div>
        <div className="user_table_wrapper">
          <ProgramAdminLists
            PALists={PAList}
            PALoading={PALoading}
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
        <AddAndEditPAModal
          isOpen={modalAction === "addPA"}
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
          title={"Are you sure you want to delete this Program Admin?"}
          description={
            "This Program Admin and it's detail will be deleted permanently !"
          }
          icon={exclamationIcon}
          modalAction={modalAction}
          handleDispatchAction={handleDispatchAction}
        />
      )}
    </>
  );
};

export default ProgramAdmins;
