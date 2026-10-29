import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import axios from "axios";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

export const listLogs = createAsyncThunk("auditLogs/listLogs", async (payload, { rejectWithValue }) => {
	try {
		const requestData = {};

		if (payload) {
			const payloads = encryptData(payload);
			requestData.encryptedData = payloads;
		}
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.auditLogs.list,
			requestData,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
