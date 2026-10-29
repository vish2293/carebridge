/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Button, Tabs, message } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { CustomScroll } from "react-custom-scroll";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { exclamationIcon, pluseIcon, questionIcon } from "../../assets/icons";
import DataNotfound from "../../components/common/DataNotFound";
import Loader from "../../components/common/Loader";
import UserProfileInfo from "../../components/common/UserProfileInfo";
import AddAndEditAttachmentModal from "../../components/modal/AddAttachment";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import ClientGoalHistory from "../../components/modal/ClientGoalHistory";
import ConfirmChwModal from "../../components/modal/ConfirmChwModal";
import DeleteModal from "../../components/modal/DeleteModal";
import ViewAttachment from "../../components/modal/ViewAttachment";
import { initialObjectiveValue } from "../../constant/array";
import {
  addAttachments,
  deleteAttachment,
  getAttachments,
  updateAttachments,
} from "../../redux/actions/attachments";
import {
  createNotes,
  getAllNotes,
  updateNotes,
} from "../../redux/actions/notes";
import { singleUserRequest } from "../../redux/actions/request";
import {
  deleteTodo,
  getNextDateHistory,
  getSingleUserTodo,
  updateSingleTask,
} from "../../redux/actions/todo";
import {
  allChw,
  getChwOptions,
  getClientGoalHistory,
  getObjectiveHistory,
  getProfileHistory,
  getResourceOptions,
  getSingleUser,
  getUserStatusHistory,
  updateClient,
} from "../../redux/actions/user";
import {
  createVisit,
  getUserVisitList,
  getVisitHistory,
} from "../../redux/actions/visit";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import { resetVisit } from "../../redux/slices/visitSlice";
import ObjectiveHistory from "../ObjectiveHistory";
import ConfirmTask from "../RequestDetaile/ConfirmModal";
import ActiveRequests from "./ActiveRequests";
import AddVisists from "./AddVisits";
import AttachmentLists from "./AttachementLists";
import Notes from "./Notes";
import ProfileQuestionHistory from "./ProfileQuestionHistory";
import TodoDetailData from "./TodoDetailData";
import TodoLists from "./TodoLists";
import UserInfo from "./UserInfo";
import VisitHistory from "./VisitHistory";
import VisitLists from "./VisitLists";
import "./style.scss";
import RequestStatusHistory from "../../components/modal/RequestStatusHistory";
import NextDateHistory from "../../components/modal/NextDateHistory";

const UserDetaile = () => {
  const { singleUserRequestLists, singleUserRequestCount } = useSelector(
    (state) => state.request
  );
  const {
    singleUser,
    chwList,
    loggedInUser,
    singleUserLoading,
    statusHistory,
    porfileHistory,
    porfileHistoryLoading,
    objectiveHistoryLoading,
    objectiveHistory,
  } = useSelector((state) => state.user);
  const { userTaskList, nextDateHistoryLoading, nextDateHistory } = useSelector(
    (state) => state.todo
  );
  const { userVisitList, visitHistory, visitHistoryLoader } = useSelector(
    (state) => state.visit
  );
  const { userAttachmentList, userAttachmentLoading } = useSelector(
    (state) => state.attachment
  );
  const { noteList } = useSelector((state) => state.note);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editProfile, setEditProfile] = useState(
    singleUser?.profileQuestion?.length === 0
      ? true
      : singleUser?.profileQuestion?.length > 0 && false
  );
  const [modalAction, setModalAction] = useState("default");
  const [requestLists, setRequestLists] = useState([]);
  const [visitLists, setVisitLists] = useState([]);
  const [requestStatus, setRequestStatus] = useState("In-Progress");
  const [taskLists, setTaskLists] = useState([]);
  const [chwId, setChwId] = useState("");
  const [chwName, setChwName] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [todoInitialValues, setTodoInitialValues] = useState({});
  const [visitInitialValues, setVisitInitialValues] = useState({});
  const [taskStatus, setTaskStatus] = useState("");
  const [openEditTodoStatus, setOpenEditTodoStatus] = useState(false);
  const [createVisitLoading, setCreateVisitLoading] = useState(false);
  const [timeOptionValue, setTimeOptionValue] = useState("Minutes");
  const [showAttachment, setShowAddAttachment] = useState(false);
  const [opeViewAttachment, setOpenViewAttachment] = useState(false);
  const [attachmentLists, setAttachmentLists] = useState([]);
  const [singleAttachment, setSingleAttachment] = useState("");
  const [uploadFileLoading, setUploadFileLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [attachmentInitialValues, setAttachmentInitialVAlues] = useState({});
  const [objectiveValue, setObjectiveValue] = useState(initialObjectiveValue);
  const [programValue, setProgramValue] = useState("");
  const [visitTabKey, setVisitTabKey] = useState("1");
  const [firstTabKey, setFirstTabKey] = useState("1");
  const [modalTitle, setModalTitle] = useState("");
  const [profileQuestionBy, setProfileQuestionBy] = useState({
    answerGivenBy: {},
    lastModifiedBy: {},
  });
  const [modalDescription, setModalDescription] = useState("");
  const [requestCount, setRequestCunt] = useState(singleUserRequestCount);
  const [noteFormFields, setNoteFormFields] = useState([]);
  const [createCHWLoading, setCreateCHWLoading] = useState(false);
  const [noteLists, setNoteLists] = useState([]);
  const [noteInitalValues, setNoteInitalValues] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const { id } = useParams();

  const urlParams = new URLSearchParams(window.location.search);
  let todoId = urlParams.get("todoId");

  let prevUrl;
  if (todoId) {
    prevUrl = localStorage.getItem("prevUrl");
  } else if (localStorage.getItem("prevUrl") === "/app/importClient") {
    prevUrl = localStorage.getItem("prevUrl");
  } else {
    localStorage.setItem("prevUrl", window.location.pathname);
  }

  useEffect(() => {
    setFirstTabKey(urlParams.get("tab") || "1");
    dispatch(
      setActiveHeader({
        name:
          prevUrl == "/app/task"
            ? "todo"
            : prevUrl == "/app"
            ? "dashboard"
            : prevUrl == "/app/calendar"
            ? "calendar"
            : prevUrl == "/app/importClient"
            ? "importClient"
            : "users",
        heading: "Go back",
      })
    );
  }, []);

  const getAllChw = () => {
    dispatch(allChw());
  };

  useEffect(() => {
    dispatch(getSingleUser({ id }));
    dispatch(singleUserRequest({ id }));
    dispatch(getSingleUserTodo({ id }));
    dispatch(getUserVisitList({ visitId: id }));
    dispatch(getAttachments({ clientId: id }));
    dispatch(getAllNotes({ payload: id }));
    dispatch(getResourceOptions({ payload: { search: "" } }));
    dispatch(getChwOptions({ payload: { search: "" } }));
  }, [id]);

  useEffect(() => {
    if (todoId) {
      setModalAction("editTodo");
      const filterTodo = taskLists?.find(
        (todoData) => todoData?._id === todoId
      );
      setTaskStatus(filterTodo?.task?.status);
      setTodoInitialValues({
        ...filterTodo,
        key: filterTodo?._id,
        task_name: filterTodo?.task?.task_name,
        task_description: filterTodo?.task?.task_description,
        category: filterTodo?.task?.category,
        status: filterTodo?.task?.status,
        dueDate: filterTodo?.dueDate ? dayjs(filterTodo?.dueDate) : "",
      });
    }
  }, [todoId, taskLists]);

  useEffect(() => {
    if (
      (loggedInUser?.role === "Super_Admin" ||
        loggedInUser?.role === "Program_Administrator") &&
      loggedInUser?.role !== undefined
    ) {
      getAllChw();
    }
  }, [loggedInUser?.role]);

  useEffect(() => {
    setRequestLists(singleUserRequestLists || []);
  }, [singleUserRequestLists]);

  useEffect(() => {
    setTaskLists(userTaskList || []);
  }, [userTaskList]);

  useEffect(() => {
    setRequestCunt(singleUserRequestCount);
  }, [singleUserRequestCount]);

  useEffect(() => {
    setVisitLists(userVisitList?.visitData || []);
  }, [userVisitList?.visitData]);

  useEffect(() => {
    setAttachmentLists(userAttachmentList || []);
  }, [userAttachmentList]);

  useEffect(() => {
    setNoteLists(noteList || []);
  }, [noteList]);

  useEffect(() => {
    if (singleUser?.objective?.length > 0) {
      setObjectiveValue(singleUser?.objective);
    }
    setProgramValue(singleUser?.program);
  }, [singleUser?.objective]);

  const handleChwSelect = (values, option) => {
    setChwId(values);
    setChwName(option?.label);
    setModalAction("acceptChw");
  };

  const handleStatusChange = (value) => {
    setOpenEditTodoStatus(true);
    setTaskStatus(value);
  };

  const handleConfirmChw = () => {
    setCreateCHWLoading(true);
    const payload = {
      assign_to: chwId,
      isChw_Assign: true,
    };
    dispatch(updateClient({ id, payload })).then(() => {
      modalClose();
      message.success("Community Health Worker assigned successfully!");
      setCreateCHWLoading(false);
    });
  };

  const handleobjectiveChange = (value, label) => {
    if (value) {
      const newObj = [...objectiveValue];
      const index = newObj.findIndex((objItem) => objItem.label === label);
      newObj[index] = { ...newObj[index], value }; // Update the value property of the object
      setObjectiveValue(newObj);
      dispatch(
        updateClient({
          id: id,
          payload: { objective: [{ label: label, value: value }] },
        })
      );
    }
  };

  const handleProgramValueChange = (value) => {
    if (value) {
      setProgramValue(value);
    }
    dispatch(updateClient({ id: id, payload: { program: value } }));
  };

  const handleRequestchange = (value) => {
    setRequestStatus(value);
  };

  const handleClickModal = (action, isOpen, data) => {
    switch (action) {
      case "editNextStep":
        setModalAction(action);
        break;
      case "viewRequest":
        navigate(`/app/requests/${data?._id}`);
        break;
      case "editClient":
        setModalAction(action);
        setInitialValues({
          ...data,
          birthDate: data?.birthDate ? dayjs(data?.birthDate) : data?.birthDate,
        });
        break;
      case "editTodo":
        setModalAction(action);
        setModalAction("editTodo");
        setTaskStatus(data?.status);
        setTodoInitialValues({
          ...data,
          task_name: data?.taskName,
          task_description: data?.taskDescription,
          dueDate: dayjs(data?.dueDate),
        });
        break;
      case "deleteTodo":
        setModalAction(action);
        setModalTitle("Are you sure you want to delete this task?");
        setModalDescription("This task will be delete  permanently.");
        setTodoInitialValues(data);
        setOpenDeleteModal(isOpen);
        break;
      case "addVisit":
        setModalAction(action);
        setVisitInitialValues({ client_goal: singleUser?.client_goal });
        break;
      case "viewVisit":
        setModalAction(action);
        navigate(`/app/visits/${data?._id}`);
        dispatch(resetVisit());
        break;
      case "viewQuestionHistory":
        setModalAction(action);
        setProfileQuestionBy({
          answerGivenBy: singleUser?.profileQuestionBy,
          lastModifiedBy: singleUser?.modifiedProfileQuestions[0],
        });
        dispatch(getProfileHistory({ clientId: singleUser?._id }));
        break;
      case "viewHistroyObject":
        setModalAction("viewHistroyObject");
        dispatch(getObjectiveHistory({ clientId: singleUser?._id }));
        break;
      case "visitHistory":
        setModalAction(action);
        dispatch(getVisitHistory(data?._id));
        break;
      case "actionStepHistory":
        setModalAction(action);

        break;
      case "ClientStatusHistory":
        dispatch(getUserStatusHistory({ payload: { clientId: id } }));
        setModalAction(action);
        break;
      case "addAttachment":
        setModalAction(action);
        break;
      case "viewAttachment":
        setModalAction(action);
        setOpenViewAttachment(isOpen);
        setAttachmentInitialVAlues(data);
        break;
      case "NextDateHistory":
        setModalAction("NextDateHistory");
        dispatch(getNextDateHistory({ payload: { taskClientId: data?.key } }));
        break;
      case "deleteAttachment":
        setModalAction(action);
        setOpenDeleteModal(isOpen);
        setAttachmentInitialVAlues(data);
        setModalTitle("Are you sure you want to delete this attachment?");
        break;
      case "deleteSingleAttachment":
        setModalAction(action);
        setOpenDeleteModal(isOpen);
        setSingleAttachment(data);
        setModalTitle("Are you sure you want to delete this attachment?");
        break;
      case "viewGoal":
        dispatch(getClientGoalHistory({ clientId: id }));
        break;
      case "addNote":
        setNoteFormFields([
          ...noteFormFields,
          { key: Date.now(), name: noteFormFields?.length },
        ]);
        setModalAction(action);
        break;
      case "editNote":
        setModalAction(action);
        setNoteInitalValues(data);
        break;
      case "deleteNote":
        setModalAction(action);
        setOpenDeleteModal(isOpen);
        setModalTitle("Delete Note");
        setModalDescription("Are you sure you want to delete this note.");
        break;
      default:
        break;
    }
  };

  const handleDispatchAction = (action, data) => {
    switch (action) {
      case "editTodo":
        dispatch(updateSingleTask({ payload: data })).then((res) => {
          if (res?.payload?.status === true) {
            const tempTodo = [...taskLists];
            const index = tempTodo?.findIndex(
              (todoData) => todoData?._id === res?.payload?.data?._id
            );
            tempTodo?.splice(index, 1, res?.payload?.data);
            setTaskLists(tempTodo);
            modalClose();
            urlParams.delete("todoId");
            window.history.replaceState({}, "", window.location.pathname);
            setOpenEditTodoStatus(false);
            message.success("Important dates updated successfully!");
          }
        });
        break;
      case "deleteTodo":
        dispatch(deleteTodo({ id: todoInitialValues?.key })).then((res) => {
          if (res?.payload?.status === true) {
            const tempArray = [...taskLists];
            const index = tempArray.findIndex(
              (taskData) => taskData?._id === res?.payload?.data?._id
            );
            tempArray.splice(index, 1);
            setTaskLists(tempArray);
            setTodoInitialValues({});
            setOpenDeleteModal(false);
            message.success("Task deleted successfully!");
          }
        });
        break;
      case "editClient":
        data.validateFields().then((values) => {
          values.oldStatus = singleUser?.status;
          setBtnLoading(true);
          dispatch(updateClient({ id: id, payload: values })).then(() => {
            message.success("User updated successfully!");
            modalClose();
          });
        });
        break;
      case "addVisit":
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
              nextSteps: values?.nextSteps,
              clientId: singleUser?._id,
              client_goal: values?.client_goal,
              createdDate: new Date(),
              assign_to: singleUser?.assign_to?._id,
              followupDate: values?.followupDate,
              followupReason: values?.followupReason,
            },
            request: values?.request?.map((requestItem) => ({
              ...requestItem,
              assign_to: requestItem?.assign_to
                ? requestItem?.assign_to
                : singleUser?.assign_to?._id,
              request_by: singleUser?._id,
              request_type: requestItem?.request_type?.value
                ? requestItem?.request_type?.value
                : requestItem?.request_type,
              pathway: requestItem?.pathway?.value
                ? requestItem?.pathway?.value
                : requestItem?.pathway,
            })),
            task: {
              category: values?.primaryNeed,
              task_name: values?.followupReason,
              task_description: values?.nextSteps,
              dueDate: values?.followupDate,
              status: "Pending",
              assign_to: singleUser?.assign_to?._id,
              clientId: singleUser?._id,
            },
          };
          setCreateVisitLoading(true);
          dispatch(createVisit(visitPayload)).then((res) => {
            if (res?.payload?.status === true) {
              setCreateVisitLoading(false);
              const tempVisit = [...visitLists];
              const tempRequest = [...requestLists];
              const tempTask = [...taskLists];
              tempVisit?.unshift(res?.payload?.data?.createdvisit);
              const updatedRequest = [
                ...tempRequest,
                ...res?.payload?.data?.requestData,
              ];
              setRequestCunt(updatedRequest?.length);
              tempTask?.unshift({
                ...res?.payload?.data?.taskData,
                clientId: {
                  firstName: singleUser?.firstName,
                  lastName: singleUser?.lastName,
                },
              });
              setTaskLists(tempTask);
              setVisitLists(tempVisit);
              dispatch(singleUserRequest({ id }));
              modalClose();
              message.success("Visit created successfully!");
            }
          });
        });
        break;
      case "addAttachment":
        data.validateFields().then((values) => {
          const extension = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "video/mp4",
            "video/mov",
            "image/avi",
            "video/webp",
            "video/webm",
            "audio/mpeg",
            "application/pdf",
          ];
          const maxFileSize = 10 * 1024 * 1024;
          const maxFileCount = 25;
          values.clientId = singleUser?._id;
          if (values.files?.fileList.length > maxFileCount) {
            message.error(
              `You can only upload a maximum of ${maxFileCount} files at a time.`
            );
            return;
          }
          const validFiles = values.files?.fileList.every((file) => {
            const isValidType = extension.includes(file?.type);
            const isValidSize = file.size <= maxFileSize;
            if (!isValidType) {
              message.error(
                `Invalid file type: ${file?.name}. Please check your file type.`
              );
            }
            if (!isValidSize) {
              message.error(`File ${file?.name} exceeds the 10MB limit.`);
            }
            return isValidType && isValidSize;
          });

          if (validFiles) {
            setUploadFileLoading(true);
            dispatch(addAttachments(values)).then((res) => {
              if (res?.payload?.status === true) {
                let tempAttachmentList = [...attachmentLists];
                tempAttachmentList.unshift(res?.payload?.data);
                setAttachmentLists(tempAttachmentList);
              }
              setModalAction("default");
              setUploadFileLoading(false);
              data.resetFields();
              message.success("File Uploaded Successfully!");
            });
          } else {
            message.error("Please check the file size/type and try again!");
          }
        });
        break;
      case "deleteAttachment":
        dispatch(deleteAttachment({ id: attachmentInitialValues?.key })).then(
          (res) => {
            if (res?.payload?.status === true) {
              const tempArray = [...attachmentLists];
              const index = tempArray.findIndex(
                (attachmentItem) =>
                  attachmentItem?._id === res?.payload?.data?._id
              );
              tempArray.splice(index, 1);
              setAttachmentLists(tempArray);
              setOpenDeleteModal(false);
              message.success("Attachment deleted successfully!");
            }
          }
        );
        break;
      case "deleteSingleAttachment":
        const deleteAttachmentPayload = new FormData();
        deleteAttachmentPayload.append("id", attachmentInitialValues?.key);
        const filteredUrls = attachmentInitialValues.url?.filter(
          (urls) => urls !== singleAttachment
        );
        deleteAttachmentPayload.append("files", JSON.stringify(filteredUrls));
        dispatch(updateAttachments({ payload: deleteAttachmentPayload })).then(
          (res) => {
            if (res?.payload?.status === true) {
              const tempArray = [...attachmentLists];
              const index = tempArray.findIndex(
                (attachmentItem) =>
                  attachmentItem?._id === res?.payload?.data?._id
              );
              tempArray.splice(index, 1, res?.payload?.data);
              setAttachmentInitialVAlues({
                ...res?.payload?.data,
                key: res?.payload?.data?._id,
                url: res?.payload?.data?.files,
              });
              setAttachmentLists(tempArray);
              setOpenDeleteModal(false);
              message.success("Attachment deleted successfully!");
            }
          }
        );
        break;
      case "addNote":
        data.validateFields().then((values) => {
          const notes = Object.keys(values).map((key) => ({
            ...values[key],
            clientId: id,
          }));
          let payload = {
            notes: notes,
          };
          setBtnLoading(true);
          dispatch(createNotes({ payload })).then((res) => {
            if (res?.payload?.status === true) {
              // setNoteLists([...res?.payload?.data, ...noteLists])
              setNoteLists((prev) => [...res?.payload?.data, ...prev]);
              setNoteFormFields([]);
              modalClose();
              message.success("Note saved successfully!");
            }
          });
        });
        break;
      case "editNote":
        data.validateFields().then((values) => {
          let payload = {
            ...values,
            clientId: id,
            isUpdated: true,
            id: editNoteId,
          };
          setBtnLoading(true);
          dispatch(updateNotes({ payload })).then((res) => {
            if (res?.payload?.status === true) {
              setNoteLists((prevNotes) =>
                prevNotes?.map((note) =>
                  note?._id === res?.payload?.data?._id
                    ? res?.payload?.data
                    : note
                )
              );
              setEditNoteId(null);
              modalClose();
              message.success("Note updated successfully!");
            }
          });
        });
        break;
      case "deleteNote":
        let payload = {
          id: editNoteId,
          isDeleted: true,
        };
        dispatch(updateNotes({ payload })).then((res) => {
          if (res?.payload?.status === true) {
            setNoteLists((prevNotes) =>
              prevNotes?.filter((note) => note?._id !== res?.payload?.data?._id)
            );
            setEditNoteId(null);
            setOpenDeleteModal(false);
            message.success("Note deleted successfully!");
          }
        });
        break;
      default:
        break;
    }
  };

  const handleTabChange = (key) => {
    setFirstTabKey(key);
    if (Number(key) === 3) {
      setShowAddAttachment(true);
    } else {
      setShowAddAttachment(false);
    }
  };

  const items = [
    {
      key: "1",
      label: "Important Dates",
      children: (
        <TodoLists todoLists={taskLists} handleClickModal={handleClickModal} />
      ),
    },
    {
      key: "2",
      label: "Client Intake",
      children: (
        <UserProfileInfo
          singleUser={singleUser}
          loggedInUser={loggedInUser}
          setEditProfile={setEditProfile}
          editProfile={editProfile}
          handleClickModal={handleClickModal}
        />
      ),
    },
    {
      key: "3",
      label: "Attachments",
      children: (
        <AttachmentLists
          attachmentLists={attachmentLists}
          loading={userAttachmentLoading}
          handleClickModal={handleClickModal}
        />
      ),
    },
  ];

  const visitItems = [
    {
      key: "1",
      label: "Visits",
      children: (
        <VisitLists
          visitLists={visitLists}
          requestLists={requestCount}
          handleClickModal={handleClickModal}
        />
      ),
    },
    {
      key: "2",
      label: `Pathways (${requestCount})`,
      children: (
        <ActiveRequests
          requestLists={requestLists}
          handleClickModal={handleClickModal}
        />
      ),
    },
    {
      key: "3",
      label: `Notes`,
      children: (
        <Notes
          noteLists={noteLists}
          btnLoading={btnLoading}
          noteFormFields={noteFormFields}
          setNoteFormFields={setNoteFormFields}
          modalAction={modalAction}
          handleDispatchAction={handleDispatchAction}
          handleClickModal={handleClickModal}
          editNoteId={editNoteId}
          setEditNoteId={setEditNoteId}
        />
      ),
    },
  ];

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const AddAttachementButton = () => {
    return (
      <Button
        type="primary"
        className="yellow-btn"
        onClick={() => handleClickModal("addAttachment", true)}
      >
        {" "}
        <span className="ant-btn-icon">{pluseIcon}</span>ADD Attachments
      </Button>
    );
  };

  const modalClose = () => {
    setUploadFileLoading(false);
    setModalAction("default");
    setBtnLoading(false);
  };

  const handleVisitTabChange = (key) => {
    setVisitTabKey(key);
  };

  return singleUserLoading ? (
    <Loader className={"page-loader"} />
  ) : (
    <>
      {singleUser && Object.keys(singleUser).length ? (
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
            {modalAction === "addVisit" ? (
              <div>
                <AddVisists
                  modalClose={modalClose}
                  timeOptionValue={timeOptionValue}
                  requestStatus={requestStatus}
                  handleRequestchange={handleRequestchange}
                  setTimeOptionValue={setTimeOptionValue}
                  visitInitialValues={visitInitialValues}
                  modalAction={modalAction}
                  handleClickModal={handleClickModal}
                  handleDispatchAction={handleDispatchAction}
                  createVisitLoading={createVisitLoading}
                />
              </div>
            ) : (
              <>
                <Tabs
                  activeKey={firstTabKey}
                  items={items}
                  onChange={handleTabChange}
                  tabBarExtraContent={
                    showAttachment && <AddAttachementButton />
                  }
                />
                <div className="visit-lists">
                  <Tabs
                    activeKey={visitTabKey}
                    onChange={handleVisitTabChange}
                    items={visitItems}
                    tabBarExtraContent={
                      singleUser?.assign_to &&
                      visitTabKey != 2 && (
                        <Button
                          type="primary"
                          onClick={() =>
                            handleClickModal(
                              visitTabKey == 1
                                ? "addVisit"
                                : visitTabKey == 3
                                ? "addNote"
                                : "",
                              true
                            )
                          }
                          className="yellow-btn"
                        >
                          <span className="ant-btn-icon">{pluseIcon}</span>
                          {visitTabKey == 1
                            ? "ADD New Visit"
                            : visitTabKey == 3
                            ? "ADD New Note"
                            : ""}
                        </Button>
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <DataNotfound />
      )}
      {openDeleteModal && (
        <DeleteModal
          isOpen={openDeleteModal}
          setIsOpen={setOpenDeleteModal}
          modalAction={modalAction}
          title={modalTitle}
          icon={exclamationIcon}
          description={modalDescription}
          handleDispatchAction={handleDispatchAction}
        />
      )}
      {modalAction === "editClient" && (
        <AddChwAndClientModal
          isOpen={modalAction === "editClient"}
          modalClose={modalClose}
          btnLoading={btnLoading}
          modalAction={modalAction}
          handleSubmit={handleDispatchAction}
          initialValues={initialValues}
          isDisabled={true}
        />
      )}
      <ConfirmChwModal
        isOpen={modalAction === "acceptChw"}
        modalClose={modalClose}
        handleOnOk={handleConfirmChw}
        chwName={chwName}
        createCHWLoading={createCHWLoading}
      />
      {modalAction === "editTodo" && (
        <TodoDetailData
          isOpen={modalAction === "editTodo"}
          modalClose={modalClose}
          singleTodo={todoInitialValues}
          modalAction={modalAction}
          taskStatus={taskStatus}
          handleStatusChange={handleStatusChange}
          readOnly={true}
          handleDispatchAction={handleDispatchAction}
          setTodoInitialValues={setTodoInitialValues}
        />
      )}

      {openEditTodoStatus && (
        <ConfirmTask
          isOpen={openEditTodoStatus}
          setIsOpen={setOpenEditTodoStatus}
          icon={questionIcon}
          handleDispatchAction={handleDispatchAction}
          modaAction={modalAction}
          title={"Are you sure you want to change status"}
        />
      )}
      <ProfileQuestionHistory
        isOpen={modalAction === "viewQuestionHistory"}
        modalClose={modalClose}
        porfileHistoryLoading={porfileHistoryLoading}
        data={porfileHistory}
        profileQuestionBy={profileQuestionBy}
      />
      <ObjectiveHistory
        isOpen={modalAction === "viewHistroyObject"}
        modalClose={modalClose}
        data={objectiveHistory}
        loading={objectiveHistoryLoading}
      />
      <VisitHistory
        isOpen={modalAction === "visitHistory"}
        data={visitHistory}
        visitHistoryLoader={visitHistoryLoader}
        modalClose={modalClose}
        modalAction={modalAction}
      />
      <AddAndEditAttachmentModal
        isOpen={modalAction === "addAttachment"}
        onClose={modalClose}
        handleDispatchAction={handleDispatchAction}
        modalAction={modalAction}
        uploadFileLoading={uploadFileLoading}
      />
      {opeViewAttachment && (
        <ViewAttachment
          isOpen={opeViewAttachment}
          setIsOpen={setOpenViewAttachment}
          data={attachmentInitialValues}
          handleClickModal={handleClickModal}
          modaAction={modalAction}
        />
      )}
      <ClientGoalHistory isOpen={modalAction === "viewGoal"} />
      <RequestStatusHistory
        isOpen={
          modalAction === "viewRequestHistory" ||
          modalAction === "ClientStatusHistory"
        }
        title={"User Status Change History"}
        modalClose={modalClose}
        data={statusHistory}
      />
      <NextDateHistory
        isOpen={modalAction === "NextDateHistory"}
        modalClose={modalClose}
        data={nextDateHistory}
        nextDateHistoryLoading={nextDateHistoryLoading}
      />
    </>
  );
};
export default UserDetaile;
