import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import axios from "axios";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

//FOR CREATE QUESTION
export const createProfileQuestion = createAsyncThunk("question/createProfileQuestion", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.question.create, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR ALL PROFILE QUESTION
export const allQuestion = createAsyncThunk("question/allQuestion", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.question.all, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR ALL ONBOARDING QUESTION
export const allOnBoardingQuestion = createAsyncThunk("question/allOnBoardingQuestion", async (_, { rejectWithValue }) => {
	try {
		const { data } = await axios.get(API_URL.question.onBoardingQuestion);
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR SINGLE QUESTION
export const singleQuestion = createAsyncThunk("question/singleQuestion", async (payload, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.question.single, payload, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR SEARCH QUESTIONS
export const searchQuestion = createAsyncThunk("question/searchQuestion", async ({ search }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.question.search,
			{},
			{
				params: { search },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR UPDATE   QUESTION
export const updateQuestion = createAsyncThunk("question/updateUser", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.question.update,
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

//FOR DELETE QUESTION
export const deleteQuestion = createAsyncThunk("question/deleteQuestion", async (id, { rejectWithValue }) => {
	try {
		const payloads = encryptData({ id });
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.question.delete,
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

//FOR DELETE MULTIPLE QUESTION
export const deleteMultipleQuestion = createAsyncThunk("question/deleteQuestion", async ({ ids }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.delete(API_URL.question.deleteMany, {
			params: { ids },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR all Profile Question
export const allProfileQuestion = createAsyncThunk("question/allProfileQuestion", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.question.allProfileQuestion, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const allDemography = createAsyncThunk("question/allDemography", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.question.allDemography, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR UPDATE PROFILE QUESTION
export const updateProfileQuestion = createAsyncThunk("question/updateProfileQuestion", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.question.updateProfileQuestion,
			{ encryptedData: payloads },
			{ headers: { Authorization: `Beaere ${token}` } }
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR UPDATE CLIENT QUESTION
export const updateClientQuestions = createAsyncThunk("question/updateClientQuestions", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.question.updateClientQuestion, { encryptedData: payloads }, { headers: { Authorization: `Beaere ${token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

// FOR UPDATE PROFILE CATEGORY
export const getProfileCategory = createAsyncThunk("question/getProfileCategory", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.question.allProfileQuestionCategory, { headers: { Authorization: `Beaere ${token}` } });
		const response = decryptData(data.encryptedData);
		return response.data?.categories;
	} catch (error) {
		return rejectWithValue(error);
	}
});
