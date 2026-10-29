import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import apiClient from "../../../helpers/interseptor";

//For create question category
export const createQuestionCategory = createAsyncThunk("question/createCategory", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.post(API_URL.questionCategory.create, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//For get all question category
export const getAllQuestionCategory = createAsyncThunk("question/allCategory", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await apiClient.get(API_URL.questionCategory.all, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
