import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import apiClient from "../../../helpers/interseptor";

//FOR GET ALL REQUEST
export const getAllRequest = createAsyncThunk("/request/allRequest", async (search, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.requests.all, search, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET ALL NEW REQUESTS
export const getAllNewRequest = createAsyncThunk("/request/getAllNewRequest", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.requests.allNewRequest, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
export const searchRequest = createAsyncThunk("/request/searchRequest", async ({ search, status }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(
			API_URL.requests.search,
			{},
			{
				params: { search, status },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET SINGLE USER REQUEST
export const singleUserRequest = createAsyncThunk("request/singleUserRequest", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.requests.singleUserRequest, {
			params: { id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET SINGLE REQUEST
export const singleRequest = createAsyncThunk("request/singleRequest", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.requests.singleRequest, {
			params: { id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR CREATE REQUEST
export const creatRequest = createAsyncThunk("request/createRequest", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.requests.create, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR ASSIGN QUESTION
export const assingQuestion = createAsyncThunk("question/assignQuestion", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.requests.assign, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		rejectWithValue(error);
	}
});

//FOR GET QUESTION OF REQUEST
export const getRequestionQuestion = createAsyncThunk("request/getRequestionQuestion", async ({ reqId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(
			API_URL.requests.requestQuestion,
			{ reqId },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR SUBMNIT ANSWER ON QUESTION
export const answerQuestion = createAsyncThunk("request/answerQuestion", async ({ answer, reqId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(
			API_URL.requests.answerQuestion,
			{ answer },
			{
				params: { reqId },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//For get request status
export const getRequestActivityLog = createAsyncThunk("request/getRequestActivityLog", async ({ reqId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(
			API_URL.requests.activityRequest,
			{ reqId },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR UPDATE REQUEST
export const updateRequest = createAsyncThunk("request/updateRequest", async ({ id, payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.requests.update, payload, {
			params: { id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getRequestStatusHistory = createAsyncThunk("request/getRequestStatusHistory", async ({ requestId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(
			API_URL.requests.requestHistory,
			{ requestId },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getActionStepHistory = createAsyncThunk("request/getActionStepHistory", async ({ requestId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(
			API_URL.requests.actionStepHistory,
			{ requestId },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR DELETE REQUEST
export const deleteRequest = createAsyncThunk("request/deleteRequest", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.delete(API_URL.requests.delete, {
			params: { id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const previousRequestData = createAsyncThunk("request/previousRequestData", async ({ requestId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(
			`${API_URL.requests.previousRequestData}/${requestId}`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
