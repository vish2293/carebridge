import { createSlice } from "@reduxjs/toolkit";
import { getAttachments } from "../actions/attachments";

const initialState = {
    userAttachmentList: [],
    userAttachmentLoading: true,
    error: ""
};
const attachmentSlice = createSlice({
    name: "attachmentSlice",
    initialState,
    reducers: {},
    extraReducers(builder) {

        //For get all question
        builder.addCase(getAttachments.pending, (state, { payload }) => {
            state.userAttachmentLoading = true;
        });
        builder.addCase(getAttachments.fulfilled, (state, { payload }) => {
            state.userAttachmentLoading = false;
            state.userAttachmentList = payload;
        });
        builder.addCase(getAttachments.rejected, (state, { payload }) => {
            state.userAttachmentLoading = false;
            state.error = payload;
        });

    }
});

export default attachmentSlice.reducer;