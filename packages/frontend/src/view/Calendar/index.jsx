import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RenderCalendarEvents from "../../components/common/RenderCalendarEvents";
import { calenderTodo } from "../../redux/actions/todo";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import './style.scss';
import Loader from "../../components/common/Loader";

const Calendar = () => {
  const { calendarTodoList, calendarTaskLoading } = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const getClendarTodos = () => {
    let payload = {
      filter: { search: "", status: "" },
      pagination: { page: 1, limit: 25 }
    };
    dispatch(calenderTodo());
  }

  useEffect(() => {
    getClendarTodos();
    localStorage.setItem("prevUrl", window.location.pathname);
    dispatch(setActiveHeader({ name: "calendar", heading: "Calendar" }));
  }, []);

  useEffect(() => {
    let tempArray = [];
    if (calendarTodoList?.length > 0) {
      calendarTodoList?.map((taskData) => {
        let subObj = {
          title: (taskData?.task?.task_name).length > 25 ? taskData?.task?.task_name.slice(0, 22) + "..." : taskData?.task?.task_name,
          start: taskData?.dueDate,
          taskId: taskData?._id,
          isOverdue: taskData?.isOverdue,
          userId: taskData?.clientId?._id,
          status: taskData?.task?.status,
          extendedProps: {
            dueDate: taskData?.dueDate,
            category: taskData?.task?.category.map(cat => cat.name),
            userName: `${taskData?.clientId?.firstName} ${taskData?.clientId?.lastName}`
          }
        };
        tempArray.push({ ...subObj });
      });
      setEvents([...tempArray?.filter((task) => task.status !== "Completed")]);
    }
  }, [calendarTodoList]);

  const onclickEvent = (info) => {
    navigate(`/app/users/${info.event._def.extendedProps?.userId}?todoId=${info.event._def.extendedProps?.taskId}`);
  };

  const handleDateClick = (event) => { };

  return calendarTaskLoading ? <Loader className={'page-loader'} /> : (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "",
        center: "prev,title,next,today",
        right: ""
      }}
      events={events}
      eventTimeFormat={{ hour: "2-digit", minute: "2-digit" }}
      nowIndicator
      selectable
      stickyHeaderDates
      eventContent={RenderCalendarEvents}
      eventClick={onclickEvent}
      dateClick={handleDateClick}
      dayMaxEventRows={2}
    />
  );
};

export default Calendar;
