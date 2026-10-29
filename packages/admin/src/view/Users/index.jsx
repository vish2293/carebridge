/* eslint-disable no-case-declarations */
import { Badge, Button, Form, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { exclamationIcon, pluseIcon } from "../../assets/icons";
import Filter from "../../components/common/Filter";
import Loader from "../../components/common/Loader";
import Search from "../../components/common/Search";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import DeleteChwAndClientModal from "../../components/modal/DeleteModal";
import { filterClientStatus } from "../../constant/array";
// import { getChwOptions } from "../../helpers";
import dayjs from "dayjs";
import AssignCHWDropdown from "../../components/common/AssignChwDropdown";
import ConfirmChwModal from "../../components/modal/ConfirmChwModal";
import OpenMergeClientModal from "../../components/modal/OpenMergeClient";
import { getAllRequest } from "../../redux/actions/request";
import { getAllTodos, requestTaskByCHW } from "../../redux/actions/todo";
import {
  allClients,
  assignChw,
  createChwAndClient,
  deleteUser,
  getChwOptions,
} from "../../redux/actions/user";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ClientLists from "./ClientLists";
import "./style.scss";

const Users = () => {
  const { clientList, chwOptions, loggedInUser, totalClient, clientLoading } =
    useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Client");
  const [clientLists, setClientLists] = useState([]);
  const [clientId, setClientId] = useState("");
  const [chwId, setChwId] = useState("");
  const [totalClients, setTotalClients] = useState(0);
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
  const [mergeClientId, setMergeClientId] = useState("");
  const [dropdownData, setDropdownData] = useState([]);
  const [openMergeModal, setOpenMergeModal] = useState(false);
  const [selectedMergeUserIds, setSelectedMergeUserIds] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const statusFromDashboard = urlParams.get("status");
  let prevUrl;
  if (statusFromDashboard) {
    prevUrl = localStorage.getItem("prevUrl");
  }

  useEffect(() => {
    let payload = {
      filter: {
        status: statusFromDashboard ? statusFromDashboard : "",
        search: search,
      },
      pagination: { page: pageNo || 1, limit: pageSize || 25 },
    };

    dispatch(getChwOptions({ search: "" }));
    setLoading(true);
    dispatch(allClients({ filter: payload })).then(() => {
      setLoading(false);
    });
    dispatch(
      setActiveHeader({
        name: prevUrl == "/app" ? "dashboard" : "users",
        heading: prevUrl == "/app" ? "Go back" : "Users",
      })
    );
  }, [pageNo, pageSize]);

  useEffect(() => {
    setTotalClients(totalClient);
  }, [totalClient]);

  useEffect(() => {
    if (
      loggedInUser?.role === "Super_Admin" ||
      loggedInUser?.role === "Program_Administrator"
    ) {
      let payload = {
        filter: { search: search, status: "" },
        pagination: { page: pageNo || 1, limit: pageSize || 25 },
      };
      dispatch(getAllRequest(payload));
      dispatch(requestTaskByCHW({ payload: "" }));
      dispatch(getAllTodos());
    }
  }, [loggedInUser?.role]);

  useEffect(() => {
    setClientLists(clientList || []);
  }, [clientList]);

  const handleFilterChange = (filterBy, value) => {
    const newValue = value === "none" ? "" : value;
    if (filterBy === "byCHW") {
      setByCHW(newValue);
      handleFilter(search, newValue, status);
    } else if (filterBy === "status") {
      setStatus(newValue);
      handleFilter(search, byCHW, newValue);
    }
  };

  const handleOnChangeSearch = (value) => {
    setSearch(value);
    clearTimeout(debounceTimeout);
    const newTime = setTimeout(() => {
      handleFilter(value, byCHW, status);
    }, 500);
    setDebounceTimeout(newTime);
  };

  const handleFilter = async (
    search,
    byChw,
    byStatus,
    page = 1,
    limit = 25
  ) => {
    let payload = {
      filter: {
        role: "Client",
        status: byStatus,
        search: search,
        byCHW: byChw,
      },
      pagination: {
        page: page,
        limit: limit,
      },
    };

    if (activeTab === "Client") {
      setLoading(true);
      dispatch(allClients({ filter: payload })).then(() => {
        setLoading(false);
      });
      setPageNo(1);
      setPageSize(25);
    }
  };

  const handleItemClick = (id) => {
    setOpenMergeModal(true);
    setSelectedMergeUserIds(id);
  };

  //For handle modal Click
  const handleClickModal = (action, open, data, rowId) => {
    switch (action) {
      case "addClient":
        setInitialValues({});
        setModalAction(action);
        break;
      case "deleteClient":
        setModalAction(action);
        setClientId(data?.key);
        setOpenDeleteModal(open);
        break;
      case "confirmCHW":
        setChwId(data?.value);
        setChwName(data?.children);
        setSelectedRow(rowId);
        setClientLists(
          (prev) =>
            prev.map((user) => {
              if (user._id === rowId) {
                return {
                  ...user,
                  chwNames: data?.children,
                };
              }
              return user;
            }) //setClient list use for manage assign dropdown in list
        );
        setModalAction(action);
        break;
      case "mergeClient":
        setModalAction(action);
        setMergeClientId(data?.key);
        handleItemClick(data?.key);
        break;
      default:
        break;
    }
  };

  //For handle dispatch action
  const handleDispatchAction = (action, form) => {
    switch (action) {
      case "addClient":
        form
          .validateFields()
          .then((values) => {
            values.role = "Client";
            values.is_Verified = true;
            if (loggedInUser?.role === "CHW") {
              values.assign_to = loggedInUser?._id;
              values.isChw_Assign = true;
            }
            values.birthDate = dayjs(values.birthDate).format("MM/DD/YYYY");
            setAddClientLoading(true);
            dispatch(createChwAndClient(values)).then((res) => {
              if (res?.payload?.status === true) {
                const tempUserLists = [...clientLists];
                tempUserLists.unshift(res?.payload?.data);
                setClientLists(tempUserLists);
                setTotalClients((prevTotalClient) => prevTotalClient + 1);
                form.resetFields();
                modalClose();
                message.success("Client added successfully!");
                navigate(`/app/users/${res?.payload?.data?._id}?tab=2`);
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
      case "deleteClient":
        dispatch(deleteUser({ id: clientId })).then((res) => {
          if (res?.payload?.status === true) {
            const tempClientLists = [...clientLists];
            const index = clientLists.findIndex(
              (v) => v?._id === res?.payload?.data?._id
            );
            tempClientLists?.splice(index, 1);
            setClientLists(tempClientLists);
            setOpenDeleteModal(false);
            setTotalClients((prevTotalClient) => prevTotalClient - 1);
            message.success("User deleted successfully!");
          }
        });
        break;
      default:
        break;
    }
  };

  //For handle tab change
  const handleTabChange = (key) => {
    if (search || byCHW || status) {
      handleResetFilters();
    }
    if (key === "Client") {
      setActiveTab("Client");
      const payload = {
        filter: { search: search, value: "" },
      };

      setLoading(true);
      dispatch(allClients({ filter: payload })).then(() => {
        setLoading(false);
      });
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

  //For tab label
  const ClientTabLabel = () => {
    return (
      <>
        <span>
          {loggedInUser?.role === "CHW" ? "Assigned Clients" : "Clients"}
        </span>
        <Badge
          count={totalClients}
          showZero
          overflowCount={Number.MAX_SAFE_INTEGER}
        />
      </>
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setByCHW("");
    setStatus("");
    handleFilter("", "", "");
    window.history.replaceState({}, "", window.location.pathname);
  };

  //For tab item
  const tabItems = [
    {
      key: "Client",
      label: <ClientTabLabel />,
      children: (
        <ClientLists
          chwName={chwName}
          setChwName={setChwName}
          setSelectedUsers={setSelectedUsers}
          selectedUsers={selectedUsers}
          clientLists={clientLists}
          clientLoading={loading}
          handleRowClick={handleRowClick}
          handleClickModal={handleClickModal}
          dropdownData={dropdownData}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
          totalClient={totalClient}
        />
      ),
    },
  ].filter(Boolean);

  const handleAssingChw = () => {
    if (clientId) {
      let payload = {
        id: [clientId],
        assign_to: chwId,
        isChw_Assign: true,
      };
      dispatch(assignChw({ payload })).then((res) => {
        if (res?.payload?.status === true) {
          setClientLists((prev) =>
            prev?.map((client) =>
              client?._id === res?.payload?.data[0]?._id
                ? res?.payload?.data[0]
                : client
            )
          );
          message.success(" Community Health Worker Assigned Successfully!");
          modalClose();
        }
      });
    } else if (selectedUsers.length) {
      let payload = {
        id: selectedUsers,
        assign_to: chwId,
        isChw_Assign: true,
      };
      dispatch(assignChw({ payload })).then((res) => {
        if (res?.payload?.status === true) {
          setClientLists((prev) => {
            // Create a lookup map from res.payload.data
            const updateMap = res?.payload?.data.reduce((map, obj) => {
              map[obj._id] = obj;
              return map;
            }, {});

            // Update the objects in prev based on the lookup map
            return prev?.map((client) =>
              updateMap[client?._id]
                ? { ...client, ...updateMap[client._id] }
                : client
            );
          });
          message.success(" Community Health Worker Assigned Successfully!");
          modalClose();
        }
      });
    }
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

  return (
    <>
      <div className="user_wrapper">
        <div className="status-sec">
          <div className="status-sec-left">
            <div className="dashboard-heading">All Users</div>
          </div>
          <div className="status-sec-right" style={{ width: "67%" }}>
            <Button
              onClick={handleResetFilters}
              disabled={!search && !status && !byCHW}
            >
              Clear Filters
            </Button>
            <Search
              value={search}
              handleOnChangeSearch={handleOnChangeSearch}
              placeholder={placeholder}
            />
            <Filter
              placeholder={"Select Community Health Worker"}
              values={byCHW || null}
              options={[{ label: "None", value: "none" }, ...chwOptions]}
              handleOnChange={handleFilterChange}
              filterBy="byCHW"
            />
            {/* <Filter placeholder={"Select zip code"} options={getClientOpetions(clientZipList).clientZipCode} handleOnChange={(values) => setZipCode(values)} /> */}
            {activeTab !== "CHW" && (
              <Filter
                placeholder={"Select status"}
                values={status || null}
                options={[
                  { label: "None", value: "none" },
                  ...filterClientStatus,
                ]}
                handleOnChange={handleFilterChange}
                filterBy="status"
              />
            )}
            <div className="request-btn">
              {loggedInUser?.role !== "Client" && (
                <Button
                  type="primary"
                  className="yellow-btn"
                  icon={pluseIcon}
                  onClick={() =>
                    handleClickModal(
                      activeTab === "Client" ? "addClient" : "addChw",
                      true
                    )
                  }
                >
                  {activeTab === "CHW" ? "Add Community Health Worker" : "ADD"}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="user_table_wrapper">
          <Tabs
            items={tabItems}
            onChange={handleTabChange}
            activeKey={activeTab}
            tabBarExtraContent={
              selectedUsers.length && (
                <AssignCHWDropdown
                  value={multipleChw || null}
                  handleClickModal={handleClickModal}
                  setMultipleChw={setMultipleChw}
                />
              )
            }
          />
        </div>
      </div>
      {
        <AddChwAndClientModal
          isOpen={modalAction === "addClient" || modalAction === "addChw"}
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
          title={`Are you sure you want to delete this ${
            activeTab === "Client" ? "client" : "CHW"
          }?`}
          description={`This ${
            activeTab === "Client" ? "client" : "CHW"
          } and it’s detail will be deleted permanently !`}
          icon={exclamationIcon}
          modalAction={modalAction}
          handleDispatchAction={handleDispatchAction}
        />
      )}
      {
        <ConfirmChwModal
          isOpen={modalAction === "confirmCHW"}
          handleOnOk={handleAssingChw}
          modalClose={modalClose}
          chwName={chwName}
        />
      }
      {openMergeModal && (
        <OpenMergeClientModal
          isOpen={openMergeModal}
          setIsOpen={setOpenMergeModal}
          selectedMergeUserIds={selectedMergeUserIds}
        />
      )}
    </>
  );
};

export default Users;
