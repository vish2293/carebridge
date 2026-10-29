import axios from "axios";
import { API_URL } from "../../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

//FOR GET USER REPORT
export const createPA = createAsyncThunk("export/createPA",
    async (payload, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.post(API_URL.programAdmin.create, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response;
        } catch (error) {
            const response = decryptData(error.response.data.encryptedData);
            return rejectWithValue(response);
        }
    }
);

//FOR GET IMPORTANT DATE REPORT
export const updatePA = createAsyncThunk("export/updatePA",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.programAdmin.update, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

//FOR GET ACTION STEPS REPORT
export const getAllPA = createAsyncThunk("export/getAllPA",
    async (payload, { rejectWithValue }) => {
        try {
            const requestData = {};

            if (payload) {
            const payloads = encryptData(payload);
            requestData.encryptedData = payloads;
            }
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.programAdmin.getAll, requestData , {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

//FOR GET ACTION STEPS REPORT
export const deletePA = createAsyncThunk(
    "export/deletePA",
    async (paId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.put(`${API_URL.programAdmin.delete}/${paId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const response = decryptData(data.encryptedData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//FOR GET OBJECTIVE REPORT
export const getSinglePA = createAsyncThunk("export/getSinglePA",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL.programAdmin.getSingle}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getPAwiseCHW = createAsyncThunk("export/getPAwiseCHW",
    async (payload, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.programAdmin.getPAwiseCHW, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const listAndSerachPA = createAsyncThunk("export/listAndSerachPA",
    async (payload, { rejectWithValue }) => {
        try {
            const requestData = {};

            if (payload) {
            const payloads = encryptData(payload);
            requestData.encryptedData = payloads;
            }
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.programAdmin.listAndSerach, requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
