import axios from "axios";
import { API_URL } from "../../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

//FOR GET USER REPORT
export const getUserExport = createAsyncThunk("export/getUserExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.export.userExport, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

//FOR GET IMPORTANT DATE REPORT
export const getImportantDateExport = createAsyncThunk("export/getImportantDateExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.export.importantDateExport, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
//FOR GET ACTION STEPS REPORT
export const getActionStepsExport = createAsyncThunk("export/getActionStepsExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.export.actionStepsExport, {encryptedData :payloads}, {
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
export const getVisitExport = createAsyncThunk("export/getVisitExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.export.visitExport, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

//FOR GET OBJECTIVE REPORT
export const getObjectiveExport = createAsyncThunk("export/getObjectiveExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.export.objectiveExport, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getResourceGivemExport = createAsyncThunk("export/getResourceGivemExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.export.resourceGivenExport, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getPathwaysExport = createAsyncThunk("export/getPathwaysExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.export.pathwaysExport, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAuditLogsExport = createAsyncThunk("export/getAuditLogsExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.export.auditLogsExport, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);