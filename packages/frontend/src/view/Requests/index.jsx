import { Badge, Button, Select, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { exclamationIcon, pluseIcon, } from "../../assets/icons";
import Search from "../../components/common/Search";
import AcceptRequestModal from "../../components/modal/AcceptRequestModal";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import AddClientRequestModal from "../../components/modal/AddClientRequestModal";
import AddRequestModal from "../../components/modal/AddRequestModal";
import AssignChwModal from "../../components/modal/AssignChwModal";
import DeleteModal from "../../components/modal/DeleteModal";
import EditRequestModal from "../../components/modal/EditRequestModal";
import { RequestStatus } from "../../constant/array";
import { creatRequest, getAllRequest, getRequestActivityLog, getRequestionQuestion, searchRequest, updateRequest, } from "../../redux/actions/request";
import { allChw, allUsers, createChwAndClient } from "../../redux/actions/user";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import RequestTable from "./RequestTable";
import "./style.scss";

const Requests = () => {
  //for reducer
  const { chwList, userList, loggedInUser } = useSelector((state) => state.user);
  const { requestList, newRequestCount, inProgressRequestCount, completedRequestCount, requestLoading } = useSelector((state) => state.request);
  //For dispatch
  const dispatch = useDispatch();
  //For navigate
  const navigate = useNavigate();
  const [requestLists, setRequestLists] = useState([]);
  //For modal
  const [openAddClientModal, setOpenClientModal] = useState(false);
  const [openClientRequestModal, setOpenClientRequestModal] = useState(false);
  const [openAddRequest, setOpenAddRequest] = useState(false);
  const [openAddChwModal, setopenAddChwModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [opeDeleteModal, setOpenDeleteModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [openAcceptRequest, setOpenAcceptRequest] = useState(false);
  const [openRequestDetaile, setOpenRequestDetaile] = useState(false);
  const [openEditRequest, setOpenEditRequest] = useState(false);
  //For sotre request id
  const [requestId, setRequestId] = useState("");
  //For store client name
  const [clientName, setClientName] = useState("");
  //For store request detail
  const [requestDetail, setRequestDetail] = useState("");
  //For store user id
  const [userId, setUserId] = useState("");
  //For initalValues
  const [initialValues, setInitialValues] = useState({});
  //For store visti type
  const [visitType, setVisitType] = useState("");
  //For select row keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //For set checkbox checked or not
  const [isChecked, setIsChecked] = useState(false);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  //For get user lists
  const getUserList = () => {
    dispatch(allUsers());
  };

  //For get client request
  const getAllUserRequest = () => {
    let payload = {
      filter: { search: "", status: "" },
      pagination: { page: pageNo || 1, limit: pageSize || 25 }
    };
    dispatch(getAllRequest(payload));
  };

  //For get chw list
  const getChwList = () => {
    dispatch(allChw());
  };

  useEffect(() => {
    getAllUserRequest();
    if (loggedInUser?.role === "Program_Administrator") {
      getChwList();
      getUserList();
    }
    dispatch(setActiveHeader({ name: "request", heading: "Requests" }));
  }, []);

  useEffect(() => {
    if (requestList.length > 0) {
      setRequestLists(requestList);
    } else {
      setRequestLists(requestList);
    }
  }, [requestList]);

  useEffect(() => {
    if (requestId) {
      dispatch(getRequestionQuestion({ reqId: requestId }));
      dispatch(getRequestActivityLog({ reqId: requestId }));
    }
  }, [openRequestDetaile]);

  const handleStatuschange = (value) => {
    // let data;
    setStatus(value);
    dispatch(searchRequest({ search: search, status: value })).then((res) => {
      if (res?.payload?.status === true) {
        setRequestLists(res?.payload?.data);
      }
    });
  };

  //handle select row change
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setIsChecked(newSelectedRowKeys?.length === requestLists?.length);
  };

  //For row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //For set userid
  const handleUserChange = (value) => {
    setUserId(value);
  };

  //For search
  const handleSearchRequests = (value) => {
    setSearch(value);
    dispatch(searchRequest({ search: value, status: status })).then((res) => {
      if (res?.payload?.status === true) {
        setRequestLists(res?.payload?.data);
      }
    });

  };

  //For handleTab Chnage
  const handleTabChange = (key) => {
    let data = [];
    switch (key) {
      case "newRequest":
        data = requestList.filter((v) => v?.request_status === "Submitted");
        setRequestLists(data);
        break;
      case "activeRequest":
        data = requestList.filter((v) => v?.request_status === "In-Progress");
        setRequestLists(data);
        break;
      case "completedRequest":
        data = requestList.filter((v) => v?.request_status === "Completed");
        setRequestLists(data);
        break;
      default:
        break;
    }
  };

  const handleModalClickAction = (action, open, data) => {
    switch (action) {
      case "addRequest":
        if (loggedInUser?.role === "Client") {
          setOpenAddRequest(open);
        } else {
          setOpenClientRequestModal(open);
        }
        setModalAction(action);
        setVisitType(loggedInUser?.visit_type);
        break;
      case "addClient":
        setModalAction(action);
        setOpenClientModal(open);
        setOpenClientRequestModal(false);
        break;
      case "acceptRequest":
        setModalAction(action);
        setRequestId(data?.key);
        setClientName(data?.clientName);
        setUserId(data?.userId);
        setRequestDetail(data?.request_details);
        initialValues.clientName = data?.clientName;
        initialValues.requestDetail = data?.taskName;
        // setopenAddChwModal(open)
        setOpenAcceptRequest(open);
        break;
      case "viewRequest":
        setModalAction(action);
        setRequestId(data?.key);
        setOpenRequestDetaile(open);
        setInitialValues(data);
        break;
      case "editRequest":
        setModalAction(action);
        setOpenEditRequest(open);
        setRequestId(data?.key);
        setUserId(data?.userId);
        setInitialValues(data);
        break;
      case "rejectRequest":
        setOpenRejectModal(open);
        setRequestId(data?.key);
        setModalAction(action);
        break;
      case "deleteRequest":
        setRequestId(data?.key);
        setOpenDeleteModal(open);
        setModalAction(action);
        break;
      default:
        break;
    }
  };

  const handleDispatchAction = (action, data) => {
    const tempRequest = [...requestLists];
    let payload = {};
    switch (action) {
      case "addRequest":
        data.validateFields().then((values) => {
          if (loggedInUser?.role === "Client") {
            values.request_by = loggedInUser?._id;
            values.assign_to = loggedInUser?.assign_to?._id;
            values.request_status = "Submitted";
          }
          dispatch(creatRequest(values)).then((res) => {
            if (res?.payload?.status === true) {
              tempRequest?.unshift(res?.payload?.data);
              setRequestLists(tempRequest);
              message.success("Request is created successfully!")
              setOpenAddRequest(false);
              data.resetFields();
            }
          });
        });
        break;
      case "editRequest":
        data?.validateFields().then((values) => {
          payload = {
            request_by: userId,
            request_details: values?.request_details,
            request_status: values?.request_status,
            requests: values?.request_type,
          };
          dispatch(updateRequest({ id: requestId, payload })).then((res) => {
            const index = tempRequest?.findIndex(
              (v) => v?._id === res?.payload?.data?._id
            );
            tempRequest.splice(index, 1, res?.payload?.data);
            setRequestLists(tempRequest);
            message.success("Request updated successfully!")
            setOpenEditRequest(false);
          });
        });
        break;
      case "addClient":
        data.validateFields().then((values) => {
          values.role = "Client";
          values.userId = loggedInUser?._id;
          values.is_Verified = "true";
          values.status = "Pending";
          dispatch(createChwAndClient(values)).then((res) => {
            if (res?.payload?.status === true) {
              tempRequest?.unshift(res?.payload?.clientRequest);
              setRequestLists(tempRequest);
              message.success("Client added successfully!")
              setOpenClientModal(false);
            } else {
              message.error('hello')
            }
          });
        });
        break;
      case "acceptRequest":
        if (loggedInUser?.role === "Program_Administrator") {
          payload = {
            request_status: "Accepted",
          };
        } else {
          payload = {
            request_status: "In-Progress",
            assign_to: loggedInUser?._id,
          };
        }
        dispatch(updateRequest({ id: requestId, payload })).then((res) => {
          if (res?.payload?.status === true) {
            const index = tempRequest.findIndex(
              (v) => v?._id === res?.payload?.data?._id
            );
            tempRequest.splice(index, 1, res?.payload?.data);
            setRequestLists(tempRequest);
            // setopenAddChwModal(false)
            setOpenAcceptRequest(false);
            navigate(`/app/users/${userId}`);
          } else {
            message.error("Something went wrong!");
          }
        });
        break;
      case "rejectRequest":
        dispatch(updateRequest({ id: requestId, payload: { request_status: "Resolve" } })).then((res) => {
          if (res?.payload?.status === true) {
            const index = tempRequest.findIndex(
              (v) => v?._id === res?.payload?.data?._id
            );
            tempRequest.splice(index, 1, res?.payload?.data);
            setRequestLists(tempRequest);
            setOpenRejectModal(false);
          } else {
            message.error("Something went wrong!");
          }
        });
        break;
      case "deleteRequest":
        payload = {
          isArchive: true,
        };
        dispatch(updateRequest({ id: requestId, payload })).then((res) => {
          if (res?.payload?.status === true) {
            const index = tempRequest.findIndex(
              (v) => v?._id === res?.payload?.data?._id
            );
            tempRequest.splice(index, 1);
            setRequestLists(tempRequest);
            message.success("Request deleted successfully!")
            setOpenDeleteModal(false);
          }
        });
        break;
      default:
        break;
    }
  };

  //For tab label
  const NewRequest = () => (
    <>
      <span>New requests</span>
      <Badge count={newRequestCount} showZero />
    </>
  );
  const ActiveRequests = () => (
    <>
      <span>Active requests</span>
      <Badge count={inProgressRequestCount} showZero />
    </>
  );
  const CompletedRequests = () => (
    <>
      <span>Completed requests</span>
      <Badge count={completedRequestCount} showZero />
    </>
  );
  //For request tabs
  const requestTabs = [
    {
      label: <NewRequest />,
      key: "newRequest",
      children: <RequestTable
        loading={requestLoading}
        requestLists={requestLists?.filter((v) => v?.request_status === "Submitted")}
        handleModalClickAction={handleModalClickAction}
        tkey="newRequest"
      />
    },
    {
      label: <ActiveRequests />,
      key: "activeRequest",
      children: <RequestTable
        loading={requestLoading}
        requestLists={requestLists?.filter((v) => v?.request_status === "In-Progress")}
        handleModalClickAction={handleModalClickAction}
        tkey="activeRequest"
      />
    },
    {
      label: <CompletedRequests />,
      key: "completedRequest",
      children: <RequestTable
        loading={requestLoading}
        requestLists={requestLists?.filter((v) => v?.request_status === "Completed")}
        handleModalClickAction={handleModalClickAction}
        tkey="completedRequest"
      />
    },
  ];

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <>
      <div className="">
        <div className="status-sec">
          <div className="status-sec-left">
            <div className="dashboard-heading">All Requests</div>
          </div>
          <div className="status-sec-right">
            <Search handleOnChangeSearch={handleSearchRequests} placeholder={"Search requests"} />
            {loggedInUser?.role !== "CHW" &&
              <Select
                placeholder="Status-All"
                onChange={handleStatuschange}
                options={RequestStatus}
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
              />
            }
            {loggedInUser?.role === "Client" && (
              <div className="request-btn">
                <Button type="primary" className="yellow-btn" icon={pluseIcon} onClick={() => handleModalClickAction("addRequest", true)}>
                  New Request
                </Button>
              </div>
            )}
          </div>
        </div>
        {loggedInUser?.role === "CHW" ?
          <div className="user_table_wrapper">
            <Tabs items={requestTabs} onChange={handleTabChange} />
          </div> :
          <div className="dashboard_table_wrapper">
            <RequestTable
              loading={requestLoading}
              requestLists={requestLists}
              status={status}
              handleModalClickAction={handleModalClickAction}
            />
          </div>
        }
      </div>
      <AddClientRequestModal
        chwList={chwList}
        userList={userList}
        visitType={visitType}
        setUserId={setUserId}
        setVisitType={setVisitType}
        isOpen={openClientRequestModal}
        setIsOpen={setOpenClientRequestModal}
        handleModalClickAction={handleModalClickAction}
        handleDispatchAction={handleDispatchAction}
        modalAction={modalAction}
      />

      <AddRequestModal
        isOpen={openAddRequest}
        setIsOpen={setOpenAddRequest}
        modalAction={modalAction}
        handleDispatchAction={handleDispatchAction}
      />

      <AssignChwModal
        isOpen={openAddChwModal}
        setIsOpen={setopenAddChwModal}
        chwLists={chwList}
        modalAction={modalAction}
        handleDispatchAction={handleDispatchAction}
        initialValues={initialValues}
      />

      <AddChwAndClientModal
        isOpen={openAddClientModal}
        setIsOpen={setOpenClientModal}
        modalAction={modalAction}
        handleSubmit={handleDispatchAction}
      />

      <DeleteModal
        isOpen={openRejectModal}
        setIsOpen={setOpenRejectModal}
        title={"Are you sure want to resolve this request?"}
        description={" This client request resolve by manualy!"}
        modalAction={modalAction}
        icon={exclamationIcon}
        handleDispatchAction={handleDispatchAction}
      />

      <EditRequestModal
        isOpen={openEditRequest}
        setIsOpen={setOpenEditRequest}
        userList={userList}
        data={initialValues}
        handleUserChange={handleUserChange}
        modalAction={modalAction}
        handleDispatchAction={handleDispatchAction}
      />
      <DeleteModal
        isOpen={opeDeleteModal}
        setIsOpen={setOpenDeleteModal}
        modalAction={modalAction}
        icon={exclamationIcon}
        handleDispatchAction={handleDispatchAction}
        title={"Are you sure you want to delete this request"}
        description={"This client request and it’s request detail will be deleted permanently !"}
      />

      <AcceptRequestModal
        isOpen={openAcceptRequest}
        setIsOpen={setOpenAcceptRequest}
        clientName={clientName}
        title={"Accept Request"}
        request_details={requestDetail}
        handleDispatchAction={handleDispatchAction}
        modalAction={modalAction}
      />
    </>
  );
};
export default Requests;
