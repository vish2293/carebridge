import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../api";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

// FOR CREATE RESOURCE
export const createResource = createAsyncThunk("resource/createResource", async ({ payload }, { rejectWithValue }) => {
	try {
		const formdata = new FormData();
		formdata.append("attachment_name", payload?.attachment_name);
		formdata.append("category", payload?.category);
		formdata.append("eligibility", payload?.eligibility);
		formdata.append("email", payload?.email);
		formdata.append("phone", payload?.phone);
		formdata.append("organization", payload?.organization);
		payload?.files?.map((file) => {
			formdata.append("files", file.originFileObj);
		});
		formdata.append("resource_details", payload?.resource_details);
		formdata.append("resource_name", payload?.resource_name);
		formdata.append("website", payload?.website);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.resource.create, formdata, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
// FOR GET  ALL RESOURCE
export const getAllResource = createAsyncThunk("resource/getAllResource", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.resource.getAll, {encryptedData :payloads}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
// FOR GET  SINGLE RESOURCE
export const getSingleResource = createAsyncThunk("resource/getSingleResource", async (_, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(
			API_URL.resource.getAll,
			{},
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
// FOR UPDATE RESOURCE
export const updateResource = createAsyncThunk("resource/updateResource", async ({ payload }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.resource.update, payload, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
// FOR DELETE RESOURCE
export const updateAndDeleteResource = createAsyncThunk("resource/updateAndDeleteResource", async ({ formData }, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.resource.updateAndDele, formData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const viewResource = createAsyncThunk("resource/viewResource", async (id, { rejectWithValue }) => {
	try {
		const token = localStorage.getItem("token");
		const { data } = await axios.get(`${API_URL.resource.view}/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

// FOR RESOURCE CATEGORY OPTIONS
export const getResourceCategoryOption = createAsyncThunk("resource/getResourceCategoryOption", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.resource.getCategory, {encryptedData :payloads}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const getResourceNameOption = createAsyncThunk("resource/getResourceNameOption", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.resource.getResourceName, {encryptedData :payloads}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

export const getResourceOrganizationOption = createAsyncThunk("resource/getResourceOrganizationOption", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.resource.getResourceOrganization, {encryptedData :payloads}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

// FOR CREATE RESOURCE CATEGORY
export const createResourceCategory = createAsyncThunk("resource/createResourceCategory", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.post(API_URL.resource.createCategory, {encryptedData :payloads}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
// FOR CREATE RESOURCE CATEGORY
export const getResourceCategoryList = createAsyncThunk("resource/getResourceCategoryList", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.resource.listCategory, {encryptedData :payloads}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response?.data;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});

// FOR UPDATE AND DELETE RESOURCE CATEGORY
export const updateAndDeleteResourceCategory = createAsyncThunk("resource/updateAndDeleteResourceCategory", async ({ payload }, { rejectWithValue }) => {
	try {
		const payloads = encryptData(payload);
		const token = localStorage.getItem("token");
		const { data } = await axios.put(API_URL.resource.updateCategory, {encryptedData :payloads}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const response = decryptData(data.encryptedData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response);
	}
});
