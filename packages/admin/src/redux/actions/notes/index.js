import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../api";
import { decryptData, encryptData } from "../../../helpers/encryption-decryption";

// FOR CREATE NOTES
export const createNotes = createAsyncThunk("notes/createNotes", async ({ payload }, { rejectWithValue }) => {
    try {
        const payloads = encryptData(payload);
        const token = localStorage.getItem("token");
        const { data } = await axios.post(API_URL.note.create, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});
// FOR GET ALL NOTES
export const getAllNotes = createAsyncThunk("notes/getAllNotes", async ({ payload }, { rejectWithValue }) => {
    try {        
        const payloads = encryptData({clientId:payload});
        const token = localStorage.getItem("token");
        const { data } = await axios.put(API_URL.note.getAll, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});
// FOR GET NOTES
export const getSingleNotes = createAsyncThunk("notes/getSingleNotes", async ({ payload }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(API_URL.note.getAll, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});
// FOR UPDATE NOTES
export const updateNotes = createAsyncThunk("notes/updateNotes", async ({ payload }, { rejectWithValue }) => {
    try {
        const payloads = encryptData(payload);
        const token = localStorage.getItem("token");
        const { data } = await axios.put(API_URL.note.update, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});
// FOR DELETE NOTES
export const deleteNotes = createAsyncThunk("notes/deleteNotes", async ({ payload }, { rejectWithValue }) => {
    try {
        const payloads = encryptData(payload);
        const token = localStorage.getItem("token");
        const { data } = await axios.post(API_URL.note.delete, {encryptedData :payloads}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const response = decryptData(data.encryptedData);
        return response;
    } catch (error) {
        return rejectWithValue(error?.response);
    }
});

