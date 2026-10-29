import { createSlice } from "@reduxjs/toolkit";
import { getAllTodos, getllUserTodo, requestTaskByCHW, getRequestTasks, requestTaskSearch, getAllTaskSearch, calenderTodo, getSingleUserTodo, getSingleTask, updateSingleTask, getNextDateHistory } from "../actions/todo";

const initialState = {
    todoList: [],
    userTodoList: [],
    requestTasks: [],
    userRequestTodoList: [],
    nextDateHistory:[],
    userTaskList: [],
    singleTodo: {},
    calendarTodoList: [],
    totalTodoCount: 0,
    newTodoCount: 0,
    inProgressTodoCount: 0,
    calendarTodoListCount: 0,
    completedTodoCount: 0,
    todoLoading: false,
    requestTaskLoading: false,
    userTaskLoading: true,
    error: "",
    nextDateHistoryLoading:false,
    nextDateHistoryError:""
};
const todoSlice = createSlice({
    name: "todoSlice",
    initialState,
    reducers: {},
    extraReducers(builder) {

        //For get all todo's
        builder.addCase(getAllTodos.pending, (state) => {
            state.todoLoading = true;
        });
        builder.addCase(getAllTodos.fulfilled, (state, { payload }) => {

            state.todoList = payload.todoLists;
            state.newTodoCount = payload.newTodoCount,
                state.completedTodoCount = payload.completedTodoCount;
            state.inProgressTodoCount = payload.inProgressTodoCount;
            state.totalTodoCount = payload.totalTodoCount;
            state.todoLoading = false;
        });
        builder.addCase(getAllTodos.rejected, (state, { payload }) => {
            state.error = payload,
                state.todoLoading = false;
        });

        //request by chw
        builder.addCase(requestTaskByCHW.pending, (state) => {
            state.todoLoading = true;
        });
        builder.addCase(requestTaskByCHW.fulfilled, (state, { payload }) => {
            state.userRequestTodoList = payload?.data?.answerAdd;
            state.newTodoCount = payload?.data?.newTodoCount,
                state.inProgressTodoCount = payload?.data?.inProgressTodoCount,
                state.completedTodoCount = payload?.data?.completedTodoCount,
                state.todoLoading = false;
        });
        builder.addCase(requestTaskByCHW.rejected, (state, { payload }) => {
            state.error = payload,
                state.todoLoading = false;
        });

        //request by chw and client search
        builder.addCase(requestTaskSearch.pending, (state) => {
            state.todoLoading = true;
        });
        builder.addCase(requestTaskSearch.fulfilled, (state, { payload }) => {
            state.userRequestTodoList = payload.data;
            state.todoLoading = false;
        });
        builder.addCase(requestTaskSearch.rejected, (state, { payload }) => {
            state.error = payload,
                state.todoLoading = false;
        });

        //request by pa search
        builder.addCase(getAllTaskSearch.pending, (state) => {
            state.todoLoading = true;
        });
        builder.addCase(getAllTaskSearch.fulfilled, (state, { payload }) => {

            state.todoList = payload;
            state.todoLoading = false;
        });
        builder.addCase(getAllTaskSearch.rejected, (state, { payload }) => {
            state.error = payload,
                state.todoLoading = false;
        });

        //For get all user todo's
        builder.addCase(getllUserTodo.pending, (state) => {
            state.todoLoading = true;
        });
        builder.addCase(getllUserTodo.fulfilled, (state, { payload }) => {
            state.userTodoList = payload;
            state.todoLoading = false;
        });
        builder.addCase(getllUserTodo.rejected, (state, { payload }) => {
            state.error = payload,
                state.todoLoading = false;
        });
        //For get  request todo
        builder.addCase(getRequestTasks.pending, (state) => {
            state.requestTaskLoading = true;
        });
        builder.addCase(getRequestTasks.fulfilled, (state, { payload }) => {
            state.requestTasks = payload;
            state.requestTaskLoading = false;
        });
        builder.addCase(getRequestTasks.rejected, (state, { payload }) => {
            state.error = payload,
                state.requestTaskLoading = false;
        });
        // FOR GET CALENDAR TODO'S
        builder.addCase(calenderTodo.pending, (state, action) => {
            if (action?.meta?.arg?.filter?.search) {
                state.calendarTaskLoading = false;
            } else if (action?.meta?.arg?.filter?.search === "") {
                state.calendarTaskLoading = false;
            } else {
                state.calendarTaskLoading = true;
            }
        });
        builder.addCase(calenderTodo.fulfilled, (state, { payload }) => {
            state.calendarTodoList = payload.answerAdd;
            state.calendarTodoListCount = payload.totalCount;
            state.calendarTaskLoading = false;
        });
        builder.addCase(calenderTodo.rejected, (state, { payload }) => {
            state.error = payload,
                state.calendarTaskLoading = false;
        });
        //For get single user todo
        builder.addCase(getSingleUserTodo.pending, (state) => {
            state.userTaskLoading = true
        });
        builder.addCase(getSingleUserTodo.fulfilled, (state, { payload }) => {
            state.userTaskList = payload;
            state.userTaskLoading = false;
        });
        builder.addCase(getSingleUserTodo.rejected, (state, { payload }) => {
            state.error = payload,
                state.userTaskLoading = false;
        });
        builder.addCase(getSingleTask.pending, (state) => {
            // state.requestTaskLoading = true;
        });
        builder.addCase(getSingleTask.fulfilled, (state, { payload }) => {
            state.singleTodo = payload;
            state.requestTaskLoading = false;
        });
        builder.addCase(getSingleTask.rejected, (state, { payload }) => {
            state.error = payload,
                state.requestTaskLoading = false;
        });
        builder.addCase(updateSingleTask.pending, (state) => {
            // state.requestTaskLoading = true;
        });
        builder.addCase(updateSingleTask.fulfilled, (state, { payload }) => {
            state.singleTodo = payload?.data;
            state.requestTaskLoading = false;
        });
        builder.addCase(updateSingleTask.rejected, (state, { payload }) => {
            state.error = payload,
                state.requestTaskLoading = false;
        });
        builder.addCase(getNextDateHistory.pending, (state) => {
            state.nextDateHistoryLoading = true;
        });
        builder.addCase(getNextDateHistory.fulfilled, (state, { payload }) => {            
            state.nextDateHistory = payload
            state.nextDateHistoryLoading = false;
        });
        builder.addCase(getNextDateHistory.rejected, (state, { payload }) => {
            state.nextDateHistoryError = payload,
                state.nextDateHistoryLoading = false;
        });

    }
});


export default todoSlice.reducer;