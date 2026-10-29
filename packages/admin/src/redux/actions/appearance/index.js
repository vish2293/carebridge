import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../../api";
import axios from "axios";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

export const getAppearance = createAsyncThunk("attachments/getAppearance",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(API_URL.appearance.get, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateAppearance = createAsyncThunk("attachments/updateAppearance",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const payloads = encryptData(payload);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.appearance.update, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const response = decryptData(data.encryptedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);