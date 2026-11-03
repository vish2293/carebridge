/* eslint-disable no-undef */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import axios from "axios";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

//FOR CREATE USER
export const createUser = createAsyncThunk("user/createUser", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.post(API_URL.user.create, { encryptedData: payloads });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

//FOR CREATE CHW
export const createChwAndClient = createAsyncThunk("user/createChw", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.createChw,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

//FOR CREATE CLIENT REQUEST
export const createClientRequest = createAsyncThunk("user/createClientRequest", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.createCLientRequest,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});
//FOR VERIFY USER EMAIL
export const verifyUserEmail = createAsyncThunk("user/verifyUserEmail", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.put(API_URL.user.verify, { encryptedData: payloads });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		rejectWithValue(error);
	}
});

//FOR LOGIN USER
export const loginUser = createAsyncThunk("user/login", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.post(API_URL.user.login, { encryptedData: payloads });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		const response = decryptData(error.response.data.encryptedData);
		return rejectWithValue(response);
	}
});

export const demoLogin = createAsyncThunk("user/demoLogin", async (payload, { rejectWithValue }) => {
	try {
		const { data } = await axios.post(API_URL.user.demoLogin, { encryptedData: encryptData(payload) });
		return decryptData(data.encryptedData);
	} catch (error) {
		const body = error.response?.data?.encryptedData ? decryptData(error.response.data.encryptedData) : null;
		return rejectWithValue({ message: body?.message || (error.response ? `Server error ${error.response.status}` : "Cannot reach the server (check VITE_APP_SERVICE_URL and CORS_ORIGINS)") });
	}
});

export const MFALoginUser = createAsyncThunk("user/MFALoginUser", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.post(API_URL.user.otp, { encryptedData: payloads });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const resendOTP = createAsyncThunk("user/resendOTP", async (payload, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.post(API_URL.user.resendOTP, { encryptedData: payloads });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR ALL USERS
export const allUsers = createAsyncThunk("user/allUser", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.user.all, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR ALL CLIENTS
export const allClients = createAsyncThunk("user/allClients", async ({ filter }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(filter);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.allClient,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR ALL CHW CLIENTS
export const allChwClients = createAsyncThunk("user/allChwClients", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.user.allChwClient, {
			params: { id },
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error.response?.data || error.message); // Handle error with specific response or message
	}
});

//FOR ALL CHW
export const allChw = createAsyncThunk("user/allChw", async (search, { rejectWithValue }) => {
	try {
		const requestData = {};

		if (search) {
			const payload = encryptData(search);
			requestData.encryptedData = payload;
		}
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.user.allChw, requestData, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR GET USER DETAILS
export const getLoginUserDetails = createAsyncThunk("user/getLoginUserDetails", async ({ token }, { rejectWithValue }) => {
	try {
		const { data } = await axios.get(API_URL.user.loggedInUser, { headers: { Authorization: `Bearer ${token}` } });

		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data);
	}
});
//FOR SINGLE USER
export const getSingleUser = createAsyncThunk("user/singleUser", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.user.single, {
			params: { id },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR SEARCH ALL CLIENT
export const searchClient = createAsyncThunk("user/searchClient", async ({ search, payload }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.searchClient,
			{ encryptedData: payloads },
			{
				params: { search },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR SEARCH ALL CLIENT
export const searchUser = createAsyncThunk("user/searchUser", async ({ search, payload }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.searchtt,
			{ encryptedData: payloads },
			{
				params: { search },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR SEARCH ALL CHW
export const searchChw = createAsyncThunk("user/searchChw", async ({ search }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.searchChw,
			{},
			{
				params: { search },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR SEARCH ALL CHW
export const searchChwClient = createAsyncThunk("user/searchChwClient", async ({ search, id }) => {
	try {
		const payloads = encryptData({ id });
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.searchChwClient,
			{ encryptedData: payloads },
			{
				params: { search },
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR UPDATE USER
export const updateUser = createAsyncThunk("user/updateUser", async ({ id, payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.user.update, payload, {
			params: { id: id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR UPDATE CLIENT
export const updateClient = createAsyncThunk("user/updateClient", async ({ id, payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.user.update, payload, {
			params: { id: id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR UPDATE CHW
export const updateChw = createAsyncThunk("user/updateChw", async ({ id, payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.user.update, payload, {
			params: { id: id },
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR SEND RESET PASSWORD LINK
export const sendResetPassword = createAsyncThunk("user/reset-password", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.post(API_URL.user.resetPassword, { encryptedData: payloads });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR CHANGE PASSWORD
export const changePassword = createAsyncThunk("user/change-password", async ({ id, payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.post(
			API_URL.user.changePassword,
			{ encryptedData: payloads },
			{
				params: { id },
			}
		);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data);
	}
});

//FOR UPDATE PASSWORD
// eslint-disable-next-line no-unused-vars
export const updatePassword = createAsyncThunk("user/updatePassword", async ({ id, payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.put(API_URL.user.updatePassword, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${payload?.token}` } });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data);
	}
});
//FOR SET PASSWORD
export const setPassword = createAsyncThunk("user/setPassword", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const { data } = await axios.put(API_URL.user.setPassword, { encryptedData: payloads });
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data);
	}
});

//FOR DELETE USER
export const deleteUser = createAsyncThunk("user/deleteUser", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.delete(API_URL.user.delete, {
			params: { id: id },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR DELETE MULTIPLE USER
export const deleteMultiUser = createAsyncThunk("user/deleteUser", async ({ ids }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.delete(API_URL.user.deleteMany, {
			params: { ids },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR SEND CONTACT EMAIL
export const sendContactUsEmail = createAsyncThunk("user/sendContactUsEmail", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.contactUs,
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
// FOR ACTIVE USER
export const getActiveUSer = createAsyncThunk("user/getActiveUSer", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.activeUSer,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});
//FOR NEW USER COUNT
export const getNewUSer = createAsyncThunk("user/getNewUSer", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.newUSer,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

//FOR IMPORT CSV
export const importCsvClient = createAsyncThunk("user/importCsvClient", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.importCsvClient,
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

//FOR IMPORT CLIENT FROM CSV
export const getCsvClient = createAsyncThunk("user/getCsvClient", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.user.getCsvClient, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.csvData;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const newSignupUser = createAsyncThunk("user/newSignupUser", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(
			API_URL.user.newSignup,
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
export const getProfileHistory = createAsyncThunk("user/getProfileHistory", async ({ clientId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.user.questionHistory, {
			params: { clientId },
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getObjectiveHistory = createAsyncThunk("user/getObjectiveHistory", async ({ clientId }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(`${API_URL.user.objectiveHistory}/${clientId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const getClientGoalHistory = createAsyncThunk("user/getClientGoalHistory", async ({ clientId }, { rejectWithValue }) => {
	try {
		const payloads = encryptData({ clientId });
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.user.clientGoalHistory, { encryptedData: payloads }, { headers: { Authorization: `Bearer ${token}` } });
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const verifySetPasswordLink = createAsyncThunk("user/verifySetPasswordLink", async ({ token }, { rejectWithValue }) => {
	try {
		const { data } = await axios.get(`${API_URL.user.verifyPasswordLink}/${token}`);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const verifyResetPasswordLink = createAsyncThunk("user/verifyResetPasswordLink", async ({ token }, { rejectWithValue }) => {
	try {
		const { data } = await axios.get(`${API_URL.user.verifyResetPasswordLink}/${token}`);
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

// FOR GET OPTIONS OF CHW
export const getChwOptions = createAsyncThunk("user/getChwOptions", async ({ search }, { rejectWithValue }) => {
	try {
		const payloads = encryptData({ search });
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.chwOptions,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

// FOR GET OPTIONS OF ZIP CODE
export const getZipCodeOptions = createAsyncThunk("user/getZipCodeOptions", async ({ search }, { rejectWithValue }) => {
	try {
		const payloads = encryptData({ search });
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.zipOptions,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
export const getClientOptions = createAsyncThunk("user/getClientOptions", async ({ search }, { rejectWithValue }) => {
	try {
		const payloads = encryptData({ search });
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.clientOptions,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

//FOR ASSIGNED CHW
export const assignChw = createAsyncThunk("user/assignChw", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.assignChw,
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

//FOR GET RESOURCE OPTIONS
export const getResourceOptions = createAsyncThunk("resource/getResourceOptions", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.resourceOptions,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

//FOR GET PRONOUNCE
export const getPronounceOptions = createAsyncThunk("user/getPronounceOptions", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.user.pronounceOptions, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

//FOR GET ETHNICITY
export const getEthnicityOptions = createAsyncThunk("user/getEthnicityOptions", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.user.ethnicityOptions, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

//FOR GET LANGUAGE OPTIONS
export const getLanguageOptions = createAsyncThunk("user/getLanguageOptions", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(API_URL.user.languageOptions, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
//FOR GET STATUS HISTORY
export const getUserStatusHistory = createAsyncThunk("user/getUserStatusHistory", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(
			API_URL.user.statusHistory,
			{ encryptedData: payloads },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const listDuplicateClient = createAsyncThunk("user/listDuplicateClient", async ({ id }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(`${API_URL.user.listDuplicateClient}/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});
