import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../api";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

//For create question category
export const createQuestionCategory = createAsyncThunk("question/createCategory", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.questionCategory.create,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//For get all question category
export const getAllQuestionCategory = createAsyncThunk("question/allCategory", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.questionCategory.all, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
