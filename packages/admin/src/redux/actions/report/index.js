import axios from "axios";
import { API_URL } from "../../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

//FOR GET USER REPORT
export const getUserReport = createAsyncThunk("report/getUserReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);

		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.report.userReport,
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

//FOR GET IMPORTANT DATE REPORT
export const getImportantDateReport = createAsyncThunk("report/getImportantDateReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.report.importantDateReport,
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
//FOR GET ACTION STEPS REPORT
export const getActionStepsReport = createAsyncThunk("report/getActionStepsReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.report.actionStepsReport,
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
//FOR GET ACTION STEPS REPORT
export const getVisitReport = createAsyncThunk("report/getVisitReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.report.visitReport,
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

//FOR GET OBJECTIVE REPORT
export const getObjectiveReport = createAsyncThunk("report/getObjectiveReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.report.objectiveReport,
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

export const getResourceGivenReport = createAsyncThunk("report/getResourceGivenReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.report.resourceGivenReport,
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

export const getPathwaysReport = createAsyncThunk("report/getPathwaysReport", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.report.pathwayReport,
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
