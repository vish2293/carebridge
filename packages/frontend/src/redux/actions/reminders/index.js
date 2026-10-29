import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import apiClient from "../../../helpers/interseptor";

//FOR CREATE Reminder
export const createReminder = createAsyncThunk("notification/setup-reminder", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.reminder.create, payload, { headers: { Authorization: `Bearer ${token}` } });
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR Update Reminder
export const updateReminder = createAsyncThunk("notification/update-reminder", async ({ id, reminders }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.put(API_URL.reminder.update, reminders, {
			params: { id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR single Reminder
export const getSingleReminder = createAsyncThunk("notification/single-reminder", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.reminder.single, { headers: { Authorization: `Bearer ${token}` } });
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
