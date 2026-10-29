import { createSlice } from "@reduxjs/toolkit";
import { getAttachments } from "../actions/attachments";
import { getAppearance, updateAppearance } from "../actions/appearance";

const initialState = {
    appearanceList: {},
    appearanceLoading: true,
    updateAppearanceLoading: false,
    error: ""
};
const appearanceSlice = createSlice({
    name: "appearanceSlice",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAppearance.pending, (state, { payload }) => {
            state.appearanceLoading = true;
        });
        builder.addCase(getAppearance.fulfilled, (state, { payload }) => {
            state.appearanceLoading = false;
            state.appearanceList = payload;
        });
        builder.addCase(getAppearance.rejected, (state, { payload }) => {
            state.appearanceLoading = false;
            state.error = payload;
        });
        builder.addCase(updateAppearance.pending, (state, { payload }) => {
            state.updateAppearanceLoading = true;
        });
        builder.addCase(updateAppearance.fulfilled, (state, { payload }) => {
            state.updateAppearanceLoading = false;
            state.appearanceList = payload;
        });
        builder.addCase(updateAppearance.rejected, (state, { payload }) => {
            state.updateAppearanceLoading = false;
            state.error = payload;
        });
    }
});

export default appearanceSlice.reducer;