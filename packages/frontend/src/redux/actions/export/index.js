import { API_URL } from "../../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../helpers/interseptor";

//FOR GET USER REPORT
export const getUserExport = createAsyncThunk("export/getUserExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await apiClient.put(API_URL.export.userExport, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

//FOR GET IMPORTANT DATE REPORT
export const getImportantDateExport = createAsyncThunk("export/getImportantDateExport",
    async ({ payload }, { rejectWithValue }) => {
        try {

            const token = localStorage.getItem("token");
            const { data } = await apiClient.put(API_URL.export.importantDateExport, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
//FOR GET ACTION STEPS REPORT
export const getActionStepsExport = createAsyncThunk("export/getActionStepsExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await apiClient.put(API_URL.export.actionStepsExport, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
//FOR GET ACTION STEPS REPORT
export const getVisitExport = createAsyncThunk("export/getVisitExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await apiClient.put(API_URL.export.visitExport, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

//FOR GET OBJECTIVE REPORT
export const getObjectiveExport = createAsyncThunk("export/getObjectiveExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await apiClient.put(API_URL.export.objectiveExport, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getResourceGivemExport = createAsyncThunk("export/getResourceGivemExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await apiClient.put(API_URL.export.resourceGivenExport, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getPathwaysExport = createAsyncThunk("export/getPathwaysExport",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await apiClient.put(API_URL.export.pathwaysExport, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);