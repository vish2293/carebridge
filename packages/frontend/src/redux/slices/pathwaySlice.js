import { createSlice } from "@reduxjs/toolkit";
import { getAllNotes } from "../actions/notes";
import { createPathway, deletePathway, fetchOutcomes, getPathwayNameOption, listAllPathway, listPathwayBaseOfNeed, listSinglePathway, updateOutcomesResult, updatePathway } from "../actions/pathway";

const initialState = {
    pathwayList: [],
    pathwayLoading: false,
    pathwayError: "",
    pathwayDetails: {},
    createdPathwayData: {},
    updatedPathwayData: {},
    deletedPathwayData: {},
    listPathway: [],
    listPathwayOptions: [],
    outcomesData: [],
    updatedResult: {}
};

const pathwaySlice = createSlice({
    name: 'pathwaySlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(listAllPathway.pending, (state, { payload }) => {
            state.pathwayLoading = true;
        });
        builder.addCase(listAllPathway.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayList = payload;
        });
        builder.addCase(listAllPathway.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });

        builder.addCase(listSinglePathway.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayDetails = payload;
        });
        builder.addCase(listSinglePathway.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });

        builder.addCase(createPathway.pending, (state, { payload }) => {
            state.pathwayLoading = true;
        });
        builder.addCase(createPathway.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.createdPathwayData = payload;
        });
        builder.addCase(createPathway.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });

        builder.addCase(updatePathway.pending, (state, { payload }) => {
            state.pathwayLoading = true;
        });
        builder.addCase(updatePathway.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.updatedPathwayData = payload;
        });
        builder.addCase(updatePathway.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });

        builder.addCase(deletePathway.pending, (state, { payload }) => {
            state.pathwayLoading = true;
        });
        builder.addCase(deletePathway.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.deletedPathwayData = payload;
        });
        builder.addCase(deletePathway.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });

        builder.addCase(listPathwayBaseOfNeed.pending, (state, { payload }) => {
            state.pathwayLoading = true;
        });
        builder.addCase(listPathwayBaseOfNeed.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.listPathway = payload;
        });
        builder.addCase(listPathwayBaseOfNeed.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });

        builder.addCase(getPathwayNameOption.pending, (state, { payload }) => {
            state.pathwayLoading = true;
        });
        builder.addCase(getPathwayNameOption.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.listPathwayOptions = payload;
        });
        builder.addCase(getPathwayNameOption.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });

        builder.addCase(fetchOutcomes.pending, (state, { payload }) => {
            state.pathwayLoading = true;
        });
        builder.addCase(fetchOutcomes.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.outcomesData = payload;
        });
        builder.addCase(fetchOutcomes.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });

        builder.addCase(updateOutcomesResult.pending, (state, { payload }) => {
            state.pathwayLoading = true;
        });
        builder.addCase(updateOutcomesResult.fulfilled, (state, { payload }) => {
            state.pathwayLoading = false;
            state.updatedResult = payload;
        });
        builder.addCase(updateOutcomesResult.rejected, (state, { payload }) => {
            state.pathwayLoading = false;
            state.pathwayError = payload;
        });
    }
})

export default pathwaySlice.reducer;