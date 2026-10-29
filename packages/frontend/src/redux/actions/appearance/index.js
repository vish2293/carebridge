import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import apiClient from "../../../helpers/interseptor";

export const getAppearance = createAsyncThunk("attachments/getAppearance", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.appearance.get, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const updateAppearance = createAsyncThunk("attachments/updateAppearance", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.appearance.update, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
