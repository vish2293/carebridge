import { createSlice } from "@reduxjs/toolkit";
import { createVisit, getAllNeedOrCategory, getAllVisit, getSingleVisit, getUserVisitList, getVisitHistory, updateVisit } from "../actions/visit";
const initialState = {
    visitList: [],
    visitListCount: 0,
    userVisitList: [],
    singleVisit: {},
    visitHistory: [],
    singleVisitLoading: true,
    visitHistoryLoader: true,
    visitLoading: true,
    userVisitLoading: true,
    error: '',
    singleUser: {},
    needOrCategoryOptions: []
}
const visitSlice = createSlice({
    name: "visitSlice",
    initialState,
    reducers: {
        resetVisit: (state) => {
            state.singleUser = {};
            state.singleVisit = {}
        }
    },
    extraReducers(builder) {

        //FOR GET ALL VISIT LIST
        builder.addCase(getAllVisit.pending, (state, action) => {
            if (action?.meta?.arg) {
                state.visitLoading = false
            } else if (action?.meta?.arg === "") {
                state.visitLoading = false
            } else {
                state.visitLoading = true
            }
        })
        builder.addCase(getAllVisit.fulfilled, (state, { payload }) => {
            state.visitLoading = false
            state.visitList = payload.data
            state.visitListCount = payload.totalCount
        })
        builder.addCase(getAllVisit.rejected, (state, { payload }) => {
            state.visitLoading = false
            state.error = payload
        })

        // FOR GET USER VISIT LIST
        builder.addCase(getUserVisitList.pending, (state, { payload }) => {
            state.userVisitLoading = true
        })
        builder.addCase(getUserVisitList.fulfilled, (state, { payload }) => {
            state.userVisitLoading = false
            state.userVisitList = payload
        })
        builder.addCase(getUserVisitList.rejected, (state, { payload }) => {
            state.userVisitLoading = false
            state.error = payload
        })
        // FOR GET SINGLE VISIT
        builder.addCase(getSingleVisit.pending, (state, { payload }) => {
            state.singleVisitLoading = true
        })
        builder.addCase(getSingleVisit.fulfilled, (state, { payload }) => {
            state.singleVisitLoading = false
            state.singleVisit = payload
        })
        builder.addCase(getSingleVisit.rejected, (state, { payload }) => {
            state.singleVisitLoading = false
            state.error = payload
        })
        // FOR UPDATE VISIT
        builder.addCase(updateVisit.pending, (state, { payload }) => {
            // state.singleVisitLoading = true
        })
        builder.addCase(updateVisit.fulfilled, (state, { payload }) => {

            // state.singleVisitLoading = false
            state.singleVisit = { visitData: payload?.data?.updatedVisitData, requestData: payload?.data?.updatedRequests, taskData: payload?.data?.taskData }
        })
        builder.addCase(updateVisit.rejected, (state, { payload }) => {
            // state.singleVisitLoading = false
            state.error = payload
        })
        builder.addCase(getVisitHistory.pending, (state, { payload }) => {
            state.visitHistoryLoader = true
        })
        builder.addCase(getVisitHistory.fulfilled, (state, { payload }) => {
            state.visitHistoryLoader = false
            state.visitHistory = payload
        })
        builder.addCase(getVisitHistory.rejected, (state, { payload }) => {
            state.visitHistoryLoader = false
            state.error = payload
        })

        builder.addCase(getAllNeedOrCategory.pending, (state, { payload }) => {
            state.visitHistoryLoader = true
        })
        builder.addCase(getAllNeedOrCategory.fulfilled, (state, { payload }) => {
            state.visitHistoryLoader = false
            state.needOrCategoryOptions = payload
        })
        builder.addCase(getAllNeedOrCategory.rejected, (state, { payload }) => {
            state.visitHistoryLoader = false
            state.error = payload
        })
    }
})

export const { resetVisit } = visitSlice.actions
export default visitSlice.reducer;