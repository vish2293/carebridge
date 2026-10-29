import { API_URL } from "../../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../helpers/interseptor";

//FOR GET USER REPORT
export const getUserReport = createAsyncThunk("report/getUserReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.report.userReport, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET IMPORTANT DATE REPORT
export const getImportantDateReport = createAsyncThunk("report/getImportantDateReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.report.importantDateReport, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR GET ACTION STEPS REPORT
export const getActionStepsReport = createAsyncThunk("report/getActionStepsReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.report.actionStepsReport, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR GET ACTION STEPS REPORT
export const getVisitReport = createAsyncThunk("report/getVisitReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.report.visitReport, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET OBJECTIVE REPORT
export const getObjectiveReport = createAsyncThunk("report/getObjectiveReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.report.objectiveReport, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getResourceGivenReport = createAsyncThunk("report/getResourceGivenReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.report.resourceGivenReport, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getPathwaysReport = createAsyncThunk("report/getPathwaysReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.report.pathwayReport, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
