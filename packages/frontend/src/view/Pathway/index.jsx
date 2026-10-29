/* eslint-disable no-case-declarations */
import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Search from "../../components/common/Search";
import ViewPathway from "../../components/modal/ViewPathway";
import { listAllPathway, listSinglePathway } from "../../redux/actions/pathway";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import PathwayLists from "./PathwayLists";
import "./style.scss";

const Pathway = () => {
  const { pathwayList, pathwayLoading } = useSelector((state) => state.pathway);
  const { loggedInUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [clientId, setClientId] = useState("");
  const [pathwayId, setPathwayId] = useState("");
  const [modalAction, setModalAction] = useState("default");
  const [search, setSearch] = useState("");
  const [addClientLoading, setAddClientLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pathwayData, setPathwayData] = useState([]);
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
    if (loggedInUser?.role === "Program_Administrator") {
      dispatch(listAllPathway());
    }
  }, [dispatch, loggedInUser?.role]);

  const handleOnChangeSearch = (value) => {
    setSearch(value);
    clearTimeout(debounceTimeout);
    const newTime = setTimeout(() => {
      handleFilter(value);
    }, 500);
    setDebounceTimeout(newTime);
  };

  const handleFilter = async (search) => {
    dispatch(listAllPathway(search));
    setPageNo(1);
    setPageSize(25);
  };

  //For handle modal Click
  const handleClickModal = (action, open, data) => {
    switch (action) {
      case "viewPathway":
        handleDispatchAction(action, data);
        setPathwayData(data);
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
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    handleFilter("");
    window.history.replaceState({}, "", window.location.pathname);
  };

  const modalClose = () => {
    setModalAction("default");
    setAddClientLoading(false);
    setClientId("");
    setPathwayId("");
  };

  return (
    <>
      <div className="user_wrapper">
        <div className="status-sec">
          <div className="status-sec-left">
            <div className="dashboard-heading">All Pathways </div>
          </div>
          <div className="status-sec-right">
            <Button onClick={handleResetFilters} disabled={!search}>
              Clear Search
            </Button>
            <Search
              value={search}
              handleOnChangeSearch={handleOnChangeSearch}
              placeholder={"Search Pathway"}
            />
          </div>
        </div>
        <div className="user_table_wrapper">
          <PathwayLists
            PALists={pathwayList}
            PALoading={pathwayLoading}
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
        viewData={viewData}
      />
    </>
  );
};

export default Pathway;
