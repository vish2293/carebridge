import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../api";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

//FOR CREATE TODO
export const createTodo = createAsyncThunk("todo/createTodo", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.todo.create, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR ASSIGN TODO
export const assignTodo = createAsyncThunk("todo/assignTodo", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.todo.assign_todo, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET REQUEST TASK
export const getRequestTasks = createAsyncThunk("todo/getRequestTasks", async ({ reqId }, { rejectWithValue }) => {
	try {
		const payloads = encryptData({ reqId });
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.todo.requestTask, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET SINGLE REQUEST TODO
export const getRequestTodo = createAsyncThunk("todo/getRequestTodo", async ({ reqId }, { rejectWithValue }) => {
	try {
		const payloads = encryptData({ reqId });
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.todo.requestTask, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		rejectWithValue(error);
	}
});

//FOR COMPLETE TASK
export const completeAssignTask = createAsyncThunk("todo/updateAssignedTask", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.todo.completeTask, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const updateAssignedTask = createAsyncThunk("todo/updateAssignedTask", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.todo.updateAssignedTask,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
        const response = decryptData(data.encryptedData);
		

		// Check if the response contains data or an error
		if (response?.data) {
			return response?.data;
		} else {
			// If there is an error in the response, handle it
			throw new Error("Invalid response format");
		}
	} catch (error) {
		// Use rejectWithValue to pass the error value to the Redux state
		return rejectWithValue(error.message || "An error occurred");
	}
});

//FOR GET ALL TODO
export const getAllTodos = createAsyncThunk("todo/getAlltodo", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const data = await axios.get(API_URL.todo.all, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
        const response = decryptData(data.data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR GET USER TODO LIST
export const getSingleUserTodo = createAsyncThunk("task-client/getSingleUserTodo", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.todo.usertTask, {
			params: { id },
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getSingleTask = createAsyncThunk("task-client/getSingleTask", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.todo.singleTask, {
			params: { id },
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR GET ALL TODO
export const getAllTaskSearch = createAsyncThunk("todo/search", async ({ search }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const data = await axios.get(API_URL.todo.search, {
			params: { search },
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
        const response = decryptData(data.encryptedData);
		return response?.data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET ALL TODO
export const getllUserTodo = createAsyncThunk("todo/getllUserTodo", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const data = await axios.get(API_URL.todo.userTodo, {
			params: { id },
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const response = decryptData(data.encryptedData);
		return response?.data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR SEARCH TODO
export const searchTodo = createAsyncThunk("todo/searchTodo", async ({ value }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.todo.search, {
			params: { search: value },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR UPDATE TODO
export const updateTodo = createAsyncThunk("todo/updateTodo", async ({ id, payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.todo.update,
			{ encryptedData: payloads },
			{
				params: { id },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const deleteTodo = createAsyncThunk("todo/deleteTodo", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.todo.delete,
			{},
			{
				params: { id },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const createTask = createAsyncThunk("task-client/createTask", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.todo.createTask,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const requestTaskByCHW = createAsyncThunk("task-client/request-task-by-chw", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.taskClient.request_by_chw,
			payload,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const requestTaskSearch = createAsyncThunk("task-client/search", async ({ search }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.taskClient.search,
			{},
			{
				params: { search },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const calenderTodo = createAsyncThunk("task-client/calenderTodo", async (search, { rejectWithValue }) => {
	try {
		const requestData = {};

		if (search) {
			const payload = encryptData(search);
			requestData.encryptedData = payload;
		}
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.taskClient.taskClient, requestData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const updateSingleTask = createAsyncThunk("task-client/updateSingleTask", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const editTodoPayload = {
			id: payload?.key,
			task: {
				task_name: payload?.task_name,
				task_description: payload?.task_description,
				category: payload?.category,
				status: payload?.status,
			},
			oldStatus: payload?.oldStatus,
			statusReason: payload?.reason,
			dueDateReason: payload?.dueDateReason,
			oldDueDate: payload?.oldDueDate,
			dueDate: payload?.dueDate,
		};
		const payloads = encryptData(editTodoPayload);
		const { data } = await axios.put(
			API_URL.todo.updateTask,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// GET NEXT IMPORTANT DATE
export const getImportantDate = createAsyncThunk("task-client/getImportantDate", async (search, { rejectWithValue }) => {
	try {
		const payload = encryptData(search);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.taskClient.taskClient,
			{ encryptedData: payload },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
// GET NEXT IMPORTANT DATE HISTORY
export const getNextDateHistory = createAsyncThunk("task-client/getNextDateHistory", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.taskClient.nextDateHistory,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
