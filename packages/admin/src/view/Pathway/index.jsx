/* eslint-disable no-case-declarations */
import { Badge, Button, Form, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { exclamationIcon, pluseIcon } from "../../assets/icons";
import Loader from "../../components/common/Loader";
import Search from "../../components/common/Search";
import AddAndEditPathwayModal from "../../components/modal/AddAndEditPathwayModal";
import DeleteChwAndClientModal from "../../components/modal/DeleteModal";
import ViewPathway from "../../components/modal/ViewPathway";
import {
  createPathway,
  deletePathway,
  listAllPathway,
  listSinglePathway,
  updatePathway,
} from "../../redux/actions/pathway";
import { getAllPA } from "../../redux/actions/programAdmin";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import PathwayLists from "./PathwayLists";
import "./style.scss";

const Pathway = () => {
  const { pathwayList, pathwayLoading } = useSelector((state) => state.pathway);
  const { loggedInUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [PALists, setPALists] = useState([]);
  const [clientId, setClientId] = useState("");
  const [pathwayId, setPathwayId] = useState("");
  const [PACount, setPACount] = useState(0);
  const [initialValues, setInitialValues] = useState({});
  const [opeDeleteModal, setOpenDeleteModal] = useState(false);
  const [modalAction, setModalAction] = useState("default");
  const [search, setSearch] = useState("");
  const [addClientLoading, setAddClientLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pathwayData, setPathwayData] = useState([]);
  const [form] = Form.useForm();
  const [viewData, setViewData] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const statusFromDashboard = urlParams.get("status");
  let prevUrl;
  if (statusFromDashboard) {
    prevUrl = localStorage.getItem("prevUrl");
  }

  useEffect(() => {
    dispatch(
      setActiveHeader({
        name: prevUrl == "/app" ? "dashboard" : "pathway",
        heading: prevUrl == "/app" ? "Go back" : "Pathway",
      })
    );
  }, [dispatch, pageNo, pageSize, prevUrl]);

  useEffect(() => {
    setPACount(pathwayList.length);
  }, [pathwayList.length]);

  useEffect(() => {
    if (loggedInUser?.role === "Super_Admin") {
      dispatch(listAllPathway());
    }
  }, [dispatch, loggedInUser?.role]);

  useEffect(() => {
    setPALists(pathwayList || []);
  }, [pathwayList]);

  const handleOnChangeSearch = (value) => {
    setSearch(value);
    clearTimeout(debounceTimeout);
    const newTime = setTimeout(() => {
      handleFilter(value);
    }, 500);
    setPageNo(1);
    setPageSize(25);
    setDebounceTimeout(newTime);
  };

  const handleFilter = async (search) => {
    setPageNo(1);
    dispatch(listAllPathway(search));
    const filteredList = pathwayList.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setPALists(filteredList);
  };

  //For handle modal Click
  const handleClickModal = (action, open, data) => {
    switch (action) {
      case "viewPathway":
        handleDispatchAction(action, data);
        setPathwayData(data);
        break;
      case "addPA":
        form.resetFields();
        setModalAction(action);
        break;
      case "editPA":
        form.setFieldsValue({
          ...data,
          need: data?.need?._id || [],
          id: data.key,
        });
        setModalAction(action);
        break;
      case "deletePA":
        setModalAction(action);
        setPathwayId(data?.key);
        setOpenDeleteModal(open);
        break;
      default:
        break;
    }
  };

  //For handle dispatch action
  const handleDispatchAction = (action, form) => {
    switch (action) {
      case "viewPathway":
        dispatch(listSinglePathway(form.key)).then((res) => {
          if (res?.payload?.status === true) {
            setViewData(res?.payload?.data);
            setAddClientLoading(false);
            setModalAction(action);
          }
        });
        break;
      case "addPA":
        setAddClientLoading(true);
        form.validateFields().then((values) => {
          dispatch(createPathway(values))
            .then((res) => {
              if (res?.payload?.status === true) {
                message.success("Pathway details added successfully!");
                dispatch(listAllPathway());
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
      case "editPA":
        setAddClientLoading(true);
        form.validateFields().then((payload) => {
          dispatch(updatePathway(payload))
            .then((res) => {
              if (res?.payload?.status === true) {
                message.success("Pathway details updated successfully!");
                dispatch(listAllPathway());
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
        setAddClientLoading(true);
        dispatch(deletePathway(pathwayId)).then((res) => {
          if (res?.payload?.status === true) {
            dispatch(listAllPathway());
            setOpenDeleteModal(false);
            message.success("Pathway deleted successfully!");
            setAddClientLoading(false);
          } else {
            message.error("Something went wrong!");
          }
        });
        break;
      default:
        break;
    }
  };

  //For handle tab change
  // const handleTabChange = (key) => {
  //   if (search) {
  //     handleResetFilters()
  //   }
  // };

  //For handle row click
  const handleRowClick = (record, e, from) => {
    setClientId(record?.key);
    if (
      !e.target.closest(".accept") &&
      !e.target.closest(".reject") &&
      !e.target.closest("edit") &&
      !e.target.closest(".chw-option") &&
      !e.target.closest(".ant-select-item-option-content") &&
      !e.target.closest(".e.target.closest") &&
      !e.target.closest(".merge") &&
      !e.target.closest(".ant-dropdown-menu")
    ) {
      // navigate(`/app/${from}/${record?.key}`);
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
          count={pathwayList.length}
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
    setPathwayId("");
  };

  return (
    <>
      <div className="user_wrapper">
        <div className="status-sec">
          <div className="status-sec-left">
            <div className="dashboard-heading">
              All Pathways{" "}
              <span style={{ margin: "auto" }}>{<CHWTabLabel />}</span>{" "}
            </div>
          </div>
          <div className="status-sec-right">
            <Button onClick={handleResetFilters} disabled={!search && !status}>
              Clear Filters
            </Button>
            <Search
              value={search}
              handleOnChangeSearch={handleOnChangeSearch}
              placeholder={"Search Pathway"}
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
          <PathwayLists
            PALists={PALists?.data}
            PALoading={pathwayLoading}
            handleRowClick={handleRowClick}
            handleClickModal={handleClickModal}
            pageNo={pageNo}
            pageSize={pageSize}
            setPageNo={setPageNo}
            setPageSize={setPageSize}
          />
        </div>
      </div>
      <ViewPathway
        modalAction={modalAction}
        isOpen={modalAction === "viewPathway"}
        handleClickModal={handleClickModal}
        modalClose={modalClose}
        initialValues={pathwayData}
        handleDispatchAction={handleDispatchAction}
        // confirmLoading={addClientLoading}
        viewData={viewData}
      />
      {
        <AddAndEditPathwayModal
          isOpen={modalAction === "addPA" || modalAction === "editPA"}
          modalClose={modalClose}
          btnLoading={addClientLoading}
          pathwayInitialValues={initialValues}
          modalAction={modalAction}
          handleSubmit={handleDispatchAction}
          form={form}
        />
      }
      {opeDeleteModal && (
        <DeleteChwAndClientModal
          isOpen={opeDeleteModal}
          setIsOpen={setOpenDeleteModal}
          title={"Are you sure you want to delete this pathway?"}
          description={
            "This pathway and it’s detail will be deleted permanently !"
          }
          icon={exclamationIcon}
          modalAction={modalAction}
          handleDispatchAction={handleDispatchAction}
        />
      )}
    </>
  );
};

export default Pathway;
