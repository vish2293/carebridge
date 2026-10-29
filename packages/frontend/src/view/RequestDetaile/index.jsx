import { Button, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CustomScroll } from "react-custom-scroll";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DataNotfound from "../../components/common/DataNotFound";
import Loader from "../../components/common/Loader";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import ConfirmChwModal from "../../components/modal/ConfirmChwModal";
import EditRequestModal from "../../components/modal/EditRequestModal";
import RequestStatusHistory from "../../components/modal/RequestStatusHistory";
import { initialObjectiveValue } from "../../constant/array";
import {
  getActionStepHistory,
  getRequestStatusHistory,
  singleRequest,
  updateRequest,
} from "../../redux/actions/request";
import {
  allChw,
  getObjectiveHistory,
  getResourceOptions,
  getSingleUser,
  getUserStatusHistory,
  updateClient,
} from "../../redux/actions/user";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ObjectiveHistory from "../ObjectiveHistory";
import UpdateStatus from "../UserDetaile/AddVisits/UpdateStatus";
import UserInfo from "../UserDetaile/UserInfo";
import RequestDetailData from "./RequestDetailData";
import "./style.scss";
import { ActionStepHistory } from "../UserDetaile/ActionStepHistory";
import { viewHistoryIcon } from "../../assets/icons";

const RequestDetaile = () => {
  const {
    requestDetaile,
    requestStatusHistory,
    actionStepHistory,
    singleRequestLoading,
  } = useSelector((state) => state.request);
  const {
    singleUser,
    chwList,
    loggedInUser,
    objectiveHistory,
    objectiveHistoryLoading,
    statusHistory,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [modalAction, setModalAction] = useState("default");
  const [chwId, setChwId] = useState("");
  const [chwName, setChwName] = useState("");
  const [openEditRequest, setOpenEditRequest] = useState(false);
  const [programValue, setProgramValue] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [updateRequestLoading, setUpdateRequestLoading] = useState(false);
  const [objectiveValue, setObjectiveValue] = useState(initialObjectiveValue);
  const [requestStatus, setRequestStatus] = useState("");
  const [openStatus, setOpenStatus] = useState(false);
  const prevUrl = localStorage.getItem("prevUrl");
  const [requestLoading, setRequestLoading] = useState(false);

  const getSingleRequest = (id) => {
    dispatch(singleRequest({ id }));
  };

  const getSignleUserDetail = (id) => {
    if (id) {
      dispatch(getSingleUser({ id }));
    }
  };

  const handleConfirmChw = () => {
    const payload = {
      assign_to: chwId,
      isChw_Assign: true,
    };
    dispatch(updateClient({ id: singleUser._id, payload })).then(() => {
      modalClose();
      message.success("Community Health Worker assign successfully!");
    });
  };

  useEffect(() => {
    getSignleUserDetail(requestDetaile?.request_by?._id);
  }, [requestDetaile?.request_by?._id]);

  useEffect(() => {
    getSingleRequest(id);
    dispatch(getResourceOptions({ payload: { search: "" } }));
    dispatch(
      setActiveHeader({
        name:
          prevUrl == "/app"
            ? "dashboard"
            : prevUrl == "/app/task"
            ? "todo"
            : prevUrl.includes("/app/users")
            ? "users"
            : "visits",
        heading: "Go back",
      })
    );
  }, [id]);

  useEffect(() => {
    if (singleUser?.objective?.length > 0) {
      setObjectiveValue(singleUser?.objective);
    }
    setProgramValue(singleUser?.program);
  }, [singleUser]);

  useEffect(() => {
    if (loggedInUser?.role === "Program_Administrator") {
      dispatch(allChw());
    }
  }, []);

  //For handle select
  const handleChwSelect = (values, option) => {
    setChwId(values);
    setChwName(option?.label);
    setModalAction("acceptChw");
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // For handle program value change
  const handleProgramValueChange = (value) => {
    if (value) {
      setProgramValue(value);
    }
    dispatch(
      updateClient({
        id: requestDetaile?.request_by?._id,
        payload: { program: value },
      })
    );
  };

  // For handle objective change
  const handleobjectiveChange = (value, label) => {
    if (value) {
      const newObj = [...objectiveValue];
      const index = newObj.findIndex((objItem) => objItem.label === label);
      newObj[index] = { ...newObj[index], value }; // Update the value property of the object
      setObjectiveValue(newObj);
      dispatch(
        updateClient({
          id: requestDetaile?.request_by?._id,
          payload: { objective: [{ label: label, value: value }] },
        })
      );
    }
  };

  const handleRequestChange = (value) => {
    setRequestStatus(value);
    setOpenStatus(true);
  };

  const handleReasonChange = (value) => {};
  const modalClose = () => {
    setModalAction("default");
  };
  // For handel click mnodal
  const handleClickModal = (action, isOpen, data) => {
    switch (action) {
      case "editRequest":
        setModalAction(action);
        setRequestStatus(data?.request_status);
        setOpenEditRequest(isOpen);
        break;
      case "editClient":
        setModalAction(action);
        setInitialValues({
          ...data,
          birthDate: data?.birthDate ? dayjs(data?.birthDate) : data?.birthDate,
        });
        break;
      case "viewHistroyObject":
        setModalAction("viewHistroyObject");
        dispatch(getObjectiveHistory({ clientId: singleUser?._id }));
        break;
      case "viewRequestHistory":
        setModalAction(action);
        dispatch(getRequestStatusHistory({ requestId: data?._id }));
        break;
      case "viewActionStepHistory":
        setModalAction(action);
        dispatch(getActionStepHistory({ requestId: data?._id }));
        break;
      case "ClientStatusHistory":
        setModalAction(action);
        dispatch(
          getUserStatusHistory({ payload: { clientId: singleUser?._id } })
        );
        break;
      default:
        break;
    }
  };

  const handleDispatchAction = (action, data) => {
    switch (action) {
      case "editRequest":
        setRequestLoading(true);
        data.validateFields().then((values) => {
          values.resources_given = values.resources_given?.map((resourItem) =>
            resourItem?.value ? resourItem?.value : resourItem
          );
          values.request_status = values?.request_status;
          values.oldStatus = requestDetaile?.request_status;
          values.reason = values?.reason;
          values.request_by = singleUser._id;
          setUpdateRequestLoading(true);
          dispatch(updateRequest({ id, payload: values })).then((res) => {
            if (res?.payload?.status === true) {
              setRequestLoading(false);
              message.success("Action Step updated successfully!");
              setOpenEditRequest(false);
              setUpdateRequestLoading(false);
            }
          });
        });
        break;
      case "editClient":
        data.validateFields().then((values) => {
          values.oldStatus = singleUser?.status;
          values.birthDate = dayjs(values.birthDate).format("MM/DD/YYYY");
          dispatch(
            updateClient({
              id: requestDetaile?.request_by?._id,
              payload: values,
            })
          ).then(() => {
            message.success("User updated successfully!");
            modalClose();
          });
        });
        break;
      default:
        break;
    }
  };

  return singleRequestLoading ? (
    <Loader className={"page-loader"} />
  ) : (
    <>
      {Object.keys(requestDetaile).length ? (
        <div className="user_detail_wrapper visit_detail">
          <div className="user_detail_left">
            <CustomScroll heightRelativeToParent="100%" className="cstm-scroll">
              <UserInfo
                singleUser={singleUser}
                chwList={chwList}
                objectiveValue={objectiveValue}
                programValue={programValue}
                handleProgramValueChange={handleProgramValueChange}
                handleobjectiveChange={handleobjectiveChange}
                filterOption={filterOption}
                handleChwSelect={handleChwSelect}
                handleClickModal={handleClickModal}
                loggedInUser={loggedInUser}
              />
            </CustomScroll>
          </div>
          <div className="user_detail-right">
            <div className="addivisit">
              <div className="dashboard-heading">
                Action Step detail{" "}
                <span
                  style={{
                    margin: "auto",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleClickModal(
                      "viewActionStepHistory",
                      true,
                      requestDetaile
                    )
                  }
                >
                  {viewHistoryIcon}
                </span>
              </div>
              {openEditRequest ? (
                <EditRequestModal
                  isOpen={openEditRequest}
                  setIsOpen={setOpenEditRequest}
                  data={requestDetaile}
                  setUpdateRequestLoading={setUpdateRequestLoading}
                  updateRequestLoading={updateRequestLoading}
                  handleRequestChange={handleRequestChange}
                  handleDispatchAction={handleDispatchAction}
                  modalAction={modalAction}
                  requestLoading={requestLoading}
                />
              ) : (
                <>
                  <RequestDetailData
                    requestDetaile={requestDetaile}
                    handleClickModal={handleClickModal}
                  />
                  <div className="accept-reject">
                    <Button
                      onClick={() =>
                        handleClickModal("editRequest", true, requestDetaile)
                      }
                      type="primary"
                      className="yellow-btn"
                    >
                      Edit
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <DataNotfound />
      )}

      <AddChwAndClientModal
        isOpen={modalAction === "editClient"}
        modalAction={modalAction}
        modalClose={modalClose}
        handleSubmit={handleDispatchAction}
        initialValues={initialValues}
      />
      <ConfirmChwModal
        isOpen={modalAction === "acceptChw"}
        modalClose={modalClose}
        handleOnOk={handleConfirmChw}
        chwName={chwName}
      />
      <ObjectiveHistory
        isOpen={modalAction === "viewHistroyObject"}
        modalClose={modalClose}
        data={objectiveHistory}
        loading={objectiveHistoryLoading}
      />
      {
        <UpdateStatus
          isOpen={openStatus}
          setIsOpen={setOpenStatus}
          initialValues={requestDetaile}
          changedStatus={requestStatus}
          handleReasonChange={handleReasonChange}
          modalAction={modalAction}
        />
      }
      <RequestStatusHistory
        isOpen={
          modalAction === "viewRequestHistory" ||
          modalAction === "ClientStatusHistory"
        }
        title={
          modalAction === "viewRequestHistory"
            ? "Action Step Status Change History"
            : "User Status Change History"
        }
        modalClose={modalClose}
        data={
          modalAction === "viewRequestHistory"
            ? requestStatusHistory
            : statusHistory
        }
      />
      <ActionStepHistory
        isOpen={modalAction === "viewActionStepHistory"}
        title="Action Step History"
        modalClose={modalClose}
        data={actionStepHistory}
      />
    </>
  );
};

export default RequestDetaile;
