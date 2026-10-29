import { createSlice } from "@reduxjs/toolkit";
import { createPA, deletePA, getAllPA, getPAwiseCHW, getSinglePA, listAndSerachPA, updatePA } from "../actions/programAdmin";

const initialState = {
    PAList: [],
    PADetails: {},
    PALoading: false,
    PAError: "",
    deletePAData: {},
    updatePAData: {},
    createPAData: {},
    getPAwiseCHWData: [],
    listAndSearchPAData: [],
};

const programAdminSlice = createSlice({
    name: 'programAdminSlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAllPA.pending, (state, { payload }) => {
            state.PALoading = true;
        });
        builder.addCase(getAllPA.fulfilled, (state, { payload }) => {
            state.PALoading = false;
            state.PAList = payload;
        });
        builder.addCase(getAllPA.rejected, (state, { payload }) => {
            state.PALoading = false;
            state.PAError = payload;
        });

        builder.addCase(getSinglePA.pending, (state, { payload }) => {
            state.PALoading = true;
        });
        builder.addCase(getSinglePA.fulfilled, (state, { payload }) => {
            state.PALoading = false;
            state.PADetails = payload;
        });
        builder.addCase(getSinglePA.rejected, (state, { payload }) => {
            state.PALoading = false;
            state.PAError = payload;
        });

        builder.addCase(deletePA.pending, (state, { payload }) => {
            state.PALoading = true;
        });
        builder.addCase(deletePA.fulfilled, (state, { payload }) => {
            state.PALoading = false;
            state.deletePAData = payload;
        });
        builder.addCase(deletePA.rejected, (state, { payload }) => {
            state.PALoading = false;
            state.PAError = payload;
        });

        builder.addCase(updatePA.pending, (state, { payload }) => {
            state.PALoading = true;
        });
        builder.addCase(updatePA.fulfilled, (state, { payload }) => {
            state.PALoading = false;
            state.updatePAData = payload;
        });
        builder.addCase(updatePA.rejected, (state, { payload }) => {
            state.PALoading = false;
            state.PAError = payload;
        });

        builder.addCase(createPA.pending, (state, { payload }) => {
            state.PALoading = true;
        });
        builder.addCase(createPA.fulfilled, (state, { payload }) => {
            state.PALoading = false;
            state.createPAData = payload;
        });
        builder.addCase(createPA.rejected, (state, { payload }) => {
            state.PALoading = false;
            state.PAError = payload;
        });

        builder.addCase(getPAwiseCHW.pending, (state, { payload }) => {
            state.PALoading = true;
        });
        builder.addCase(getPAwiseCHW.fulfilled, (state, { payload }) => {
            state.PALoading = false;
            state.getPAwiseCHWData = payload;
        });
        builder.addCase(getPAwiseCHW.rejected, (state, { payload }) => {
            state.PALoading = false;
            state.PAError = payload;
        });

        builder.addCase(listAndSerachPA.pending, (state, { payload }) => {
            state.PALoading = true;
        });
        builder.addCase(listAndSerachPA.fulfilled, (state, { payload }) => {
            state.PALoading = false;
            state.listAndSearchPAData = payload;
        });
        builder.addCase(listAndSerachPA.rejected, (state, { payload }) => {
            state.PALoading = false;
            state.PAError = payload;
        });
    }
})
export default programAdminSlice.reducer;