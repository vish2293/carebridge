import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../api";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

export const createPathway = createAsyncThunk("pathway/createPathway", async (payload, { rejectWithValue }) => {
    try {
        const payloads = encryptData(payload);
        const token = localStorage.getItem("token");
        const { data } = await axios.post(API_URL.pathway.create, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const updatePathway = createAsyncThunk("pathway/updatePathway", async (payload, { rejectWithValue }) => {
    try {
        const payloads = encryptData(payload);
        const token = localStorage.getItem("token");
        const { data } = await axios.put(API_URL.pathway.update, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const deletePathway = createAsyncThunk("pathway/deletePathway", async (pathwayId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const { data } = await axios.put(`${API_URL.pathway.delete}/${pathwayId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const listAllPathway = createAsyncThunk("pathway/listAllPathway", async (payload, { rejectWithValue }) => {
    try {
        const payloads = encryptData({payload});
        const token = localStorage.getItem("token");
        const { data } = await axios.post(API_URL.pathway.getAll, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const listSinglePathway = createAsyncThunk("pathway/listSinglePathway", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_URL.pathway.getSingle}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const listPathwayBaseOfNeed = createAsyncThunk("pathway/listPathwayBaseOfNeed", async (payload, { rejectWithValue }) => {
    try {
        const payloads = encryptData({payload});
        const token = localStorage.getItem("token");
        const { data } = await axios.put(API_URL.pathway.listPathwayOnBaseOfNeed, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const getNeedName = createAsyncThunk("pathway/getNeedName", async (payload, { rejectWithValue }) => {
    try {
        const payloads = encryptData({payload});
        const token = localStorage.getItem("token");
        const { data } = await axios.put(API_URL.pathway.getNeedName, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const getPathwayNameOption = createAsyncThunk("resource/getPathwayNameOption", async ({ payload }, { rejectWithValue }) => {
    try {
        const requestData = {};

            if (payload) {
            const payloads = encryptData(payload);
            requestData.encryptedData = payloads;
            }
        const token = localStorage.getItem("token");
        const { data } = await axios.put(API_URL.pathway.listPathwayOptions, requestData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response?.data;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const fetchOutcomes = createAsyncThunk("pathway/fetchOutcomes", async (payload, { rejectWithValue }) => {
    try {
        const payloads = encryptData(payload);
        const token = localStorage.getItem("token");
        const { data } = await axios.put(API_URL.pathway.outcomes, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

export const updateOutcomesResult = createAsyncThunk("pathway/updateOutcomesResult", async (payload, { rejectWithValue }) => {
    try {
        const payloads = encryptData(payload);
        const token = localStorage.getItem("token");
        const { data } = await axios.put(API_URL.pathway.outcomesResult, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});