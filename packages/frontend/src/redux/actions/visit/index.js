import { API_URL } from "../../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../helpers/interseptor";

// FOR CREATE VISIT
export const createVisit = createAsyncThunk("visit/createVisit", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.visit.create, payload, { headers: { Authorization: `Bearer ${token}` } });
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR GET VISIT LIST
export const getAllVisit = createAsyncThunk("visit/getAllVisit", async (search, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.visit.all, search, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR GET USER VISIT LIST
export const getUserVisitList = createAsyncThunk("visit/getUserVisitList", async ({ visitId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.visit.userVisit, {
			params: { id: visitId },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
// FOR GET SINGLE VISIT
export const getSingleVisit = createAsyncThunk("visit/getSingleVisit", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.visit.single, {
			params: { id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
// FOR UPDATE VISIT
export const updateVisit = createAsyncThunk("visit/updateVisit", async ({ payload, visitId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.visit.update, payload, {
			params: { id: visitId },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR DELETE VISIT
export const deleteVisit = createAsyncThunk("visit/deleteVisit", async (visitId, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(
			API_URL.visit.delete,
			{ visitId },
			{
				params: { visitId: visitId },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getVisitHistory = createAsyncThunk("visit/getVisitHistory", async (visitId, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(`${API_URL.visit.history}/${visitId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// GET VISIT REPORT
export const getVisitReport = createAsyncThunk("visit/getVisitReport", async (visitId, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(`${API_URL.visit.history}/${visitId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getAllNeedOrCategory = createAsyncThunk("visit/getAllNeedOrCategory", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.needCategory.getAll, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
