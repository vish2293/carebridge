import axios from "axios";
import { API_URL } from "../../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

// FOR CREATE VISIT
export const createVisit = createAsyncThunk("visit/createVisit", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const payloads = encryptData(payload);
		const { data } = await axios.post(API_URL.visit.create, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR GET VISIT LIST
export const getAllVisit = createAsyncThunk("visit/get	AllVisit", async (search, { rejectWithValue }) => {
	try {
		const payload = encryptData(search);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.visit.all,
			{ encryptedData: payload },
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

// FOR GET USER VISIT LIST
export const getUserVisitList = createAsyncThunk("visit/getUserVisitList", async ({ visitId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.visit.userVisit, {
			params: { id: visitId },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
// FOR GET SINGLE VISIT
export const getSingleVisit = createAsyncThunk("visit/getSingleVisit", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.visit.single, {
			params: { id },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
// FOR UPDATE VISIT
export const updateVisit = createAsyncThunk("visit/updateVisit", async ({ payload, visitId }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.visit.update, {encryptedData :payloads}, {
			params: { id: visitId },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR DELETE VISIT
export const deleteVisit = createAsyncThunk("visit/deleteVisit", async (visitId, { rejectWithValue }) => {
	try {
		const payloads = encryptData({ visitId });
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.visit.delete,
			{encryptedData :payloads},
			{
				params: { visitId: visitId },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getVisitHistory = createAsyncThunk("visit/getVisitHistory", async (visitId, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(`${API_URL.visit.history}/${visitId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// GET VISIT REPORT
export const getVisitReport = createAsyncThunk("visit/getVisitReport", async (visitId, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(`${API_URL.visit.history}/${visitId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getAllNeedOrCategory = createAsyncThunk("visit/getAllNeedOrCategory", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.needCategory.getAll, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
