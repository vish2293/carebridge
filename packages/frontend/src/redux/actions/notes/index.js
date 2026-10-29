import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import apiClient from "../../../helpers/interseptor";

// FOR CREATE NOTES
export const createNotes = createAsyncThunk("notes/createNotes", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.note.create, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
// FOR GET ALL NOTES
export const getAllNotes = createAsyncThunk("notes/getAllNotes", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(
			API_URL.note.getAll,
			{ clientId: payload },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return data?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
// FOR GET NOTES
export const getSingleNotes = createAsyncThunk("notes/getSingleNotes", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(
			API_URL.note.getAll,
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
// FOR UPDATE NOTES
export const updateNotes = createAsyncThunk("notes/updateNotes", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.note.update, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
// FOR DELETE NOTES
export const deleteNotes = createAsyncThunk("notes/deleteNotes", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.note.delete, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
