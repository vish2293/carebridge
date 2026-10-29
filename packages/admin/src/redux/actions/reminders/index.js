import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import axios from "axios";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

//FOR CREATE Reminder
export const createReminder = createAsyncThunk("notification/setup-reminder", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.reminder.create, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR Update Reminder
export const updateReminder = createAsyncThunk("notification/update-reminder", async ({ id, reminders }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(reminders);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.reminder.update,
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

//FOR single Reminder
export const getSingleReminder = createAsyncThunk("notification/single-reminder", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.reminder.single, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});
