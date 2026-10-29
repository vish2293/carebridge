import { API_URL } from "../../../api";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

export const addAttachments = createAsyncThunk("attachments/addAttachments",
    async (payload, { rejectWithValue }) => {
        try {
            const formdata = new FormData();
            formdata.append("name", payload?.name);
            payload?.files?.fileList?.map((file) => {
                formdata.append("files", file?.originFileObj);
            });
            formdata.append("clientId", payload?.clientId);
            const token = localStorage.getItem("token");

            const { data } = await axios.post(API_URL.attachments.add, formdata, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAttachments = createAsyncThunk("attachments/getAttachments",
    async ({ clientId }, { rejectWithValue }) => {
        try {
            const payloads = encryptData({ clientId: clientId });
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.attachments.get, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteAttachment = createAsyncThunk("attachments/deleteAttachment",
    async ({ id }, { rejectWithValue }) => {
        try {
            const payloads = encryptData({ id });
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.attachments.delete, {encryptedData :payloads}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = decryptData(data.encryptedData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const updateAttachments = createAsyncThunk("attachments/updateAttachments",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.put(API_URL.attachments.update, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);