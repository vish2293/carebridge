import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import apiClient from "../../../helpers/interseptor";

export const createPathway = createAsyncThunk("pathway/createPathway", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.pathway.create, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const updatePathway = createAsyncThunk("pathway/updatePathway", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.pathway.update, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const deletePathway = createAsyncThunk("pathway/deletePathway", async (pathwayId, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(
			`${API_URL.pathway.delete}/${pathwayId}`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const listAllPathway = createAsyncThunk("pathway/listAllPathway", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(
			API_URL.pathway.getAll,
			{ payload },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const listSinglePathway = createAsyncThunk("pathway/listSinglePathway", async (id, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(`${API_URL.pathway.getSingle}/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const listPathwayBaseOfNeed = createAsyncThunk("pathway/listPathwayBaseOfNeed", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(
			API_URL.pathway.listPathwayOnBaseOfNeed,
			{ payload },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const getNeedName = createAsyncThunk("pathway/getNeedName", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(
			API_URL.pathway.getNeedName,
			{ payload },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const getPathwayNameOption = createAsyncThunk("resource/getPathwayNameOption", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.pathway.listPathwayOptions, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const fetchOutcomes = createAsyncThunk("pathway/fetchOutcomes", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.pathway.outcomes, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const updateOutcomesResult = createAsyncThunk("pathway/updateOutcomesResult", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.pathway.outcomesResult, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
