import { Button, Skeleton, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CustomScroll } from "react-custom-scroll";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { newEditIcon, viewHistoryIcon } from "../../assets/icons";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import ClientGoalHistory from "../../components/modal/ClientGoalHistory";
import ConfirmChwModal from "../../components/modal/ConfirmChwModal";
import DeleteModal from "../../components/modal/DeleteModal";
import RequestStatusHistory from "../../components/modal/RequestStatusHistory";
import { initialObjectiveValue } from "../../constant/array";
import {
  getActionStepHistory,
  getRequestStatusHistory,
} from "../../redux/actions/request";
import {
  allChw,
  getClientGoalHistory,
  getObjectiveHistory,
  getResourceOptions,
  getSingleUser,
  getUserStatusHistory,
  updateClient,
} from "../../redux/actions/user";
import {
  deleteVisit,
  getAllNeedOrCategory,
  getSingleVisit,
  getVisitHistory,
  updateVisit,
} from "../../redux/actions/visit";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ObjectiveHistory from "../ObjectiveHistory";
import AddVisitForm from "../UserDetaile/AddVisits/AddVisitForm";
import UpdateStatus from "../UserDetaile/AddVisits/UpdateStatus";
import UserInfo from "../UserDetaile/UserInfo";
import VisitHistory from "../UserDetaile/VisitHistory";
import SingleVisitData from "./SingleVisitData";
import "./style.scss";
import Loader from "../../components/common/Loader";
import DataNotfound from "../../components/common/DataNotFound";

const VisitDetail = () => {
  const {
    singleVisit,
    singleVisitLoading,
    visitHistoryLoader,
    visitHistory,
    needOrCategoryOptions,
  } = useSelector((state) => state.visit);
  const {
    singleUser,
    chwList,
    loggedInUser,
    singleUserLoading,
    objectiveHistoryLoading,
    statusHistory,
    objectiveHistory,
    clientGoalHistoryLoading,
    clientGoalHistory,
  } = useSelector((state) => state.user);
  const { requestStatusLoading, requestStatusHistory } = useSelector(
    (state) => state.request
  );
  const { pathwayList } = useSelector((state) => state.pathway);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalAction, setModalAction] = useState("default");
  const [timeOptionValue, setTimeOptionValue] = useState("Minutes");
  const [visitInitialValues, setVisitInitialValues] = useState({});
  const [programValue, setProgramValue] = useState("");
  const [chwName, setChwName] = useState("");
  const [addEditVisitLoading, setAddEditvisitLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [openVisitHistory, setOpenVisitHistory] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [objectiveValue, setObjectiveValue] = useState(initialObjectiveValue);
  const [chwId, setChwId] = useState("");
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  let prevUrl = localStorage.getItem("prevUrl");

  const { id } = useParams();
  //For accept chw
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
    dispatch(allChw());
    dispatch(getAllNeedOrCategory());
    dispatch(getResourceOptions({ payload: { search: "" } }));
  }, []);

  //For get single user details
  const getSignleUserDetail = (id) => {
    if (id) {
      dispatch(getSingleUser({ id }));
    }
  };

  useEffect(() => {
    getSignleUserDetail(singleVisit?.visitData?.clientId);
  }, [singleVisit]);

  useEffect(() => {
    if (singleUser?.objective?.length > 0) {
      setObjectiveValue(singleUser?.objective);
    }
    setProgramValue(singleUser?.program);
  }, [singleUser]);

  const handleProgramValueChange = (value) => {
    if (value) {
      setProgramValue(value);
    }
    dispatch(
      updateClient({
        id: singleVisit?.visitData?.clientId,
        payload: { program: value },
      })
    );
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  //For handle select
  const handleChwSelect = (values, option) => {
    setChwId(values);
    setChwName(option?.label);
    setModalAction("acceptChw");
  };

  const handleobjectiveChange = (value, label) => {
    if (value) {
      const newObj = [...objectiveValue];
      const index = newObj.findIndex((objItem) => objItem.label === label);
      newObj[index] = { ...newObj[index], value }; // Update the value property of the object
      setObjectiveValue(newObj);
      dispatch(
        updateClient({
          id: singleVisit?.visitData?.clientId,
          payload: { objective: [{ label: label, value: value }] },
        })
      );
    }
  };
  useEffect(() => {
    dispatch(
      setActiveHeader({
        name:
          prevUrl == "/app/visits"
            ? "visits"
            : prevUrl.includes("/app/users")
            ? "users"
            : "",
        heading: "Go back",
      })
    );
    dispatch(getSingleVisit({ id }));
  }, []);

  const modalClose = () => {
    setModalAction("default");
  };

  const [requestIndex, setRequestIndex] = useState(0);
  const handleReasonChange = () => {};

  const handleRequestStatusChange = (value, request) => {
    setRequestIndex(request);
    setRequestStatus(value);
    setIsUpdateStatus(true);
    setCurrentStatus(visitInitialValues?.request[request]?.request_status);
  };
  // For handle click modal
  const handleClickModal = (action, isOpen, data) => {
    switch (action) {
      case "editVisit":
        setModalAction(action);
        setVisitInitialValues({
          ...singleVisit?.visitData,
          client_goal: singleUser?.client_goal,
          primaryNeed: Array.isArray(singleVisit?.visitData?.primaryNeed)
            ? singleVisit?.visitData?.primaryNeed
            : singleVisit?.visitData?.primaryNeed,
          pathway: Array.isArray(singleVisit?.visitData?.pathway)
            ? singleVisit?.visitData?.pathway
            : singleVisit?.visitData?.pathway,
          nextSteps: singleVisit?.taskData?.task?.task_description,
          followupReason: singleVisit?.taskData?.task?.task_name,
          visitDate: dayjs(singleVisit?.visitData?.visitDate),
          followupDate: dayjs(singleVisit?.taskData?.dueDate),
          request: singleVisit?.requestData,
        });
        break;
      case "editClient":
        setModalAction(action);
        setInitialValues({
          ...data,
          birthDate: data?.birthDate ? dayjs(data?.birthDate) : data?.birthDate,
        });
        break;
      case "visitHistory":
        setModalAction(action);
        setOpenVisitHistory(isOpen);
        dispatch(getVisitHistory(data?.visitData?._id));
        break;
      case "viewHistroyObject":
        setModalAction("viewHistroyObject");
        dispatch(getObjectiveHistory({ clientId: singleUser?._id }));
        break;
      case "deleteVisit":
        setModalAction(action);
        setOpenDelete(isOpen);
        setModalTitle("Are you sure you want to delete this visit?");
        setModalDescription("This visit will be delete  permanently.");
        break;
      case "viewGoal":
        dispatch(getClientGoalHistory({ clientId: singleUser?._id }));
        setModalAction(action);
        break;
      case "viewRequestHistory":
        dispatch(getRequestStatusHistory({ requestId: data?._id }));
        setModalAction(action);
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

  // For handle dispatch action
  const handleDispatchAction = (action, data) => {
    switch (action) {
      case "editVisit":
        data.validateFields().then((values) => {
          const visitPayload = {
            visit: {
              visitType: values?.visitType,
              lengthOfvisit: values?.lengthOfvisit,
              lengthOfvisitUnit: timeOptionValue,
              visitDate: values?.visitDate,
              clientStory: values?.clientStory,
              primaryNeed: values?.primaryNeed,
              pathway: values?.pathway,
              otherNeed: values?.otherNeed,
              client_goal: values?.client_goal,
              nextSteps: values?.nextSteps,
              assign_to: singleUser?.assign_to?._id,
              clientId: singleVisit?.visitData?.clientId,
              followupDate: values?.followupDate,
              followupReason: values?.followupReason,
            },
            task: {
              id: singleVisit?.taskData?._id,
              dueDateReason: values?.dueDateReason,
              oldDueDate: visitInitialValues?.followupDate,
              task: {
                category: values?.primaryNeed,
                task_name: values?.followupReason,
                task_description: values?.nextSteps,
              },
              dueDate: values?.followupDate,
              clientId: singleVisit?.visitData?.clientId,
            },
            request: values?.request?.map((requestItem, index) => {
              return {
                ...requestItem,
                resources_given: requestItem?.resources_given?.map(
                  (resourceItem) =>
                    resourceItem?.value ? resourceItem?.value : resourceItem
                ),
                request_type: requestItem?.request_type?.value
                  ? requestItem?.request_type?.value
                  : requestItem?.request_type,
                pathway: requestItem?.pathway?.value
                  ? requestItem?.pathway?.value
                  : requestItem?.pathway,
                oldStatus: visitInitialValues?.request?.find(
                  (requestData) => requestData?._id === requestItem?._id
                )?.request_status,
                request_by: singleVisit?.visitData?.clientId,
              };
            }),
          };
          setAddEditvisitLoading(true);
          dispatch(
            updateVisit({
              payload: visitPayload,
              visitId: singleVisit?.visitData?._id,
            })
          ).then((res) => {
            if (res?.payload?.status === true) {
              setAddEditvisitLoading(false);
              message.success("Visit updated successfully!");
              modalClose();
            }
          });
        });
        break;
      case "editClient":
        data.validateFields().then((values) => {
          values.oldStatus = singleUser?.status;
          setAddEditvisitLoading(true);
          dispatch(
            updateClient({
              id: singleVisit?.visitData?.clientId,
              payload: values,
            })
          ).then(() => {
            setAddEditvisitLoading(false);
            modalClose();
            message.success("User updated successfully!");
          });
        });
        break;
      case "deleteVisit":
        dispatch(deleteVisit(id)).then((res) => {
          if (res?.payload?.status === true) {
            message.success("Visit Deleted Duccessfully!");
            navigate(`/app/users/${singleUser?._id}`);
          }
        });
        break;
      default:
        break;
    }
  };

  return singleVisitLoading ? (
    <Loader className={"page-loader"} />
  ) : (
    <>
      {Object.keys(singleVisit).length ? (
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
            <div className="addivisit visit-sec">
              <div className="visit-head">
                <div className="visit">
                  Visit
                  <div>
                    <span>Created By : </span>
                    <span>
                      {singleVisit?.visitData?.createdBy
                        ? `${singleVisit?.visitData?.createdBy?.firstName} ${singleVisit?.visitData?.createdBy?.lastName}`
                        : "---"}
                    </span>
                  </div>
                  <div>
                    <span>Modified By : </span>
                    <span>
                      {singleVisit?.visitData?.modifiedBy
                        ? `${singleVisit?.visitData?.modifiedBy?.firstName} ${singleVisit?.visitData?.modifiedBy?.lastName}`
                        : " ---"}
                    </span>
                  </div>
                </div>
                <div className="accept-reject">
                  {modalAction !== "editVisit" && (
                    <Button
                      type="primary"
                      onClick={() => handleClickModal("editVisit", true)}
                      icon={newEditIcon}
                      className="edit-btn yellow-btn"
                    >
                      Edit
                    </Button>
                  )}
                  {loggedInUser?.role !== "CHW" &&
                    modalAction !== "editVisit" && (
                      <div
                        onClick={() =>
                          handleClickModal("visitHistory", true, singleVisit)
                        }
                        className="view-btn"
                      >
                        {viewHistoryIcon}
                      </div>
                    )}
                </div>
              </div>
              <div className="vist-form">
                {modalAction === "editVisit" ? (
                  <AddVisitForm
                    visitInitialValues={visitInitialValues}
                    timeOptionValue={timeOptionValue}
                    setAddEditvisitLoading={setAddEditvisitLoading}
                    modalClose={modalClose}
                    setTimeOptionValue={setTimeOptionValue}
                    modalAction={modalAction}
                    handleRequestStatusChange={handleRequestStatusChange}
                    createVisitLoading={addEditVisitLoading}
                    handleClickModal={handleClickModal}
                    handleDispatchAction={handleDispatchAction}
                    setVisitInitialValues={setVisitInitialValues}
                  />
                ) : (
                  <SingleVisitData
                    singleVisit={singleVisit}
                    handleClickModal={handleClickModal}
                    modalAction={modalAction}
                  />
                )}
              </div>
            </div>
            {modalAction !== "editVisit" && (
              <div className="accept-reject">
                <Button
                  onClick={() => handleClickModal("deleteVisit", true)}
                  type="primary"
                  className="reject-btn"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <DataNotfound />
      )}
      {
        <AddChwAndClientModal
          isOpen={modalAction === "editClient"}
          modalAction={modalAction}
          modalClose={modalClose}
          handleSubmit={handleDispatchAction}
          initialValues={initialValues}
        />
      }
      {
        <ConfirmChwModal
          isOpen={modalAction === "acceptChw"}
          handleOnOk={handleConfirmChw}
          chwName={chwName}
          modalClose={modalClose}
        />
      }
      <VisitHistory
        isOpen={modalAction === "visitHistory"}
        data={visitHistory}
        visitHistoryLoader={visitHistoryLoader}
        modalClose={modalClose}
        modalAction={modalAction}
      />
      <ObjectiveHistory
        isOpen={modalAction === "viewHistroyObject"}
        modalClose={modalClose}
        data={objectiveHistory}
        loading={objectiveHistoryLoading}
      />
      {openDelete && (
        <DeleteModal
          isOpen={openDelete}
          setIsOpen={setOpenDelete}
          modalAction={modalAction}
          handleDispatchAction={handleDispatchAction}
          title={modalTitle}
          description={modalDescription}
        />
      )}
      {
        <ClientGoalHistory
          isOpen={modalAction === "viewGoal"}
          onClose={modalClose}
          historyLists={clientGoalHistory}
          loading={clientGoalHistoryLoading}
        />
      }
      {
        <UpdateStatus
          isOpen={isUpdateStatus}
          setIsOpen={setIsUpdateStatus}
          initialValues={{ request_status: currentStatus }}
          changedStatus={requestStatus}
          requestIndex={requestIndex}
          setVisitInitialValues={setVisitInitialValues}
          handleReasonChange={handleReasonChange}
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
    </>
  );
};
export default VisitDetail;
