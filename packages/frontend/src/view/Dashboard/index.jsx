/* eslint-disable no-case-declarations */
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RenderCalendarEvents from "../../components/common/RenderCalendarEvents";
import { getAllNewRequest } from "../../redux/actions/request";
import { calenderTodo } from "../../redux/actions/todo";
import { getActiveUSer, getNewUSer } from "../../redux/actions/user";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ChwTable from "./ChwTable";
import DashboardCards from "./DashboardCards";
import DashboardTable from "./DashboardTable";
import "./style.scss";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const { requestList, requestLoading } = useSelector((state) => state.request);
  const { loggedInUser, activeUser, newUser } = useSelector(
    (state) => state.user
  );
  const { headerValue } = useSelector((state) => state.header);
  const { calendarTodoList, calendarTaskLoading } = useSelector(
    (state) => state.todo
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestLists, setRequestLists] = useState([]);
  const [clientCount, setClientCount] = useState({
    activeClient: 0,
    newClient: 0,
  });
  const [events, setEvents] = useState([]);

  const getActiveUsers = (date) => {
    if (date) {
      dispatch(getActiveUSer({ payload: { fromDate: date } }));
    }
  };

  const getNewUSerCount = (date) => {
    if (date) {
      dispatch(getNewUSer({ payload: date }));
    }
  };

  const getClendarTodos = () => {
    let payload = {
      filter: { search: "", status: "" },
      pagination: { page: 1, limit: 25 },
    };
    dispatch(calenderTodo());
  };

  useEffect(() => {
    dispatch(setActiveHeader({ name: "dashboard", heading: "Dashboard" }));
    localStorage.setItem("prevUrl", window.location.pathname);
    dispatch(getAllNewRequest());
    getClendarTodos();
    getActiveUsers("Tue Mar 26 2024 12:51:22 GMT+0530 (India Standard Time)");
    getNewUSerCount({
      fromDate: "2024-01-01",
      toDate: "2024-04-30",
    });
  }, []);

  useEffect(() => {
    setClientCount({
      activeClient: activeUser ? activeUser : 0,
      newClient: newUser ? newUser : 0,
    });
  }, [activeUser, newUser]);

  useEffect(() => {
    setRequestLists(
      requestList?.filter(
        (reqData) => reqData?.request_status !== "Completed"
      ) || []
    );
  }, [requestList]);

  useEffect(() => {
    let tempArray = [];
    if (calendarTodoList?.length > 0) {
      calendarTodoList?.map((taskData) => {
        let subObj = {
          title:
            (taskData?.task?.task_name).length > 25
              ? taskData?.task?.task_name.slice(0, 22) + "..."
              : taskData?.task?.task_name,
          start: taskData?.dueDate,
          taskId: taskData?._id,
          isOverdue: taskData?.isOverdue,
          userId: taskData?.clientId?._id,
          status: taskData?.task?.status,
          extendedProps: {
            dueDate: taskData?.dueDate,
            category: taskData?.task?.category.map((cat) => cat.name),
            userName: `${taskData?.clientId?.firstName} ${taskData?.clientId?.lastName}`,
          },
        };
        tempArray.push({ ...subObj });
      });
      setEvents([...tempArray?.filter((task) => task.status !== "Completed")]);
    }
  }, [calendarTodoList]);

  const onclickEvent = (info) => {
    navigate(
      `/app/users/${info.event._def.extendedProps?.userId}?todoId=${info.event._def.extendedProps?.taskId}`
    );
  };

  return requestLoading || calendarTaskLoading ? (
    <Loader className={"page-loader"} />
  ) : (
    <>
      <div className="dashboard">
        <div className="dashboard_task_wrapper">
          {
            <div
              className={
                loggedInUser?.role !== "Client"
                  ? "w-50 dashboard_table_wrapper"
                  : "w-50 dashboard_table_wrapper"
              }
            >
              <div className="dashboard-heading">{headerValue?.heading}</div>
              <div className="dashboard_table_top">
                {Object.keys(clientCount).map((values, index) => (
                  <div className="task-sec" key={index}>
                    <DashboardCards
                      count={clientCount[values]}
                      title={values}
                    />
                  </div>
                ))}
                <div className="dashboard-heading">
                  {loggedInUser?.role === "Client"
                    ? "Action Steps"
                    : "Active Action Steps"}
                </div>
              </div>
              {loggedInUser?.role !== "CHW" ? (
                <DashboardTable
                  requestLists={requestLists}
                  loading={requestLoading}
                />
              ) : (
                <ChwTable
                  requestLists={requestLists}
                  loading={requestLoading}
                />
              )}
            </div>
          }
          {loggedInUser?.role !== "Client" && (
            <div className="w-50 dashboard_table_wrapper">
              <div className="dashboard-heading">Calendar</div>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "",
                  center: "prev,title,next,today",
                  right: "",
                }}
                events={events}
                eventContent={RenderCalendarEvents}
                eventTimeFormat={{ hour: "2-digit", minute: "2-digit" }}
                nowIndicator
                dayMaxEventRows={2}
                selectable
                stickyHeaderDates
                eventClick={onclickEvent}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Dashboard;
