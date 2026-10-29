import { createSlice } from "@reduxjs/toolkit";
import { getActionStepsReport, getImportantDateReport, getObjectiveReport, getPathwaysReport, getResourceGivenReport, getUserReport, getVisitReport } from "../actions/report";

const initialState = {
    userReportLists: [],
    userReportListsCount: 0,
    pendingUserCount: 0,
    openUserCount: 0,
    closedSuccessUserCount: 0,
    closedInactiveUserCount: 0,
    userReportLoading: false,
    userReportError: "",
    importantList: [],
    pendingTodoCount: 0,
    overdueTodoCount: 0,
    completedTodoCount: 0,
    inProgressTodoCount: 0,
    importantLoading: false,
    importantListCount: 0,
    importantError: "",
    actionStepList: [],
    pendingActionSteps: 0,
    completedActionSteps: 0,
    inprogressActionSteps: 0,
    cancelledActionSteps: 0,
    unsuccessfulActionSteps: 0,
    actionStepListCount: 0,
    actionStepLoading: false,
    actionStepError: "",
    visitReportList: [],
    phoneCallCount: 0,
    textCount: 0,
    inPersonCount: 0,
    emailCount: 0,
    virtualCount: 0,
    visitReportListCount: 0,
    visitReportLoading: false,
    visitReportError: "",
    objectiveReportList: [],
    objectiveReportLoading: false,
    objectiveReportListCount: 0,
    objectiveReportError: "",
    resourceGivenList: [],
    resourcegivenReportLoading: false,
    resourceGivenListCount: 0,
    resourcegivenReportError: "",
    pathwayList: [],
    pathwayReportLoading: false,
    pathwayListCount: 0,
    pathwaysReportError: "",
}

const reportSlice = createSlice({
    name: "reportSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserReport.pending, (state, { payload }) => {
            state.userReportLoading = true
        });
        builder.addCase(getUserReport.fulfilled, (state, { payload }) => {
            state.userReportLoading = false
            state.userReportLists = payload.data
            state.userReportListsCount = payload.totalCount
            state.pendingUserCount = payload.pendingUserCount
            state.openUserCount = payload.openUserCount
            state.closedSuccessUserCount = payload.closedSuccessUserCount
            state.closedInactiveUserCount = payload.closedInactiveUserCount
        });
        builder.addCase(getUserReport.rejected, (state, { payload }) => {
            state.userReportLoading = false
            state.userReportError = payload
        });
        builder.addCase(getImportantDateReport.pending, (state, { payload }) => {
            state.importantLoading = true
        });
        builder.addCase(getImportantDateReport.fulfilled, (state, { payload }) => {
            state.importantLoading = false
            state.importantList = payload.data
            state.importantListCount = payload.totalCount
            state.pendingTodoCount = payload.pendingTodoCount
            state.inProgressTodoCount = payload.inProgressTodoCount
            state.overdueTodoCount = payload.overdueTodoCount
            state.completedTodoCount = payload.completedTodoCount
        });
        builder.addCase(getImportantDateReport.rejected, (state, { payload }) => {
            state.importantLoading = false
            state.importantError = payload
        });
        builder.addCase(getActionStepsReport.pending, (state, { payload }) => {
            state.actionStepLoading = true
        });
        builder.addCase(getActionStepsReport.fulfilled, (state, { payload }) => {
            state.actionStepLoading = false
            state.actionStepList = payload.data
            state.actionStepListCount = payload.totalCount
            state.pendingActionSteps = payload.pendingActionSteps
            state.completedActionSteps = payload.completedActionSteps
            state.inprogressActionSteps = payload.inprogressActionSteps
            state.unsuccessfulActionSteps = payload.unsuccessfulActionSteps
            state.cancelledActionSteps = payload.cancelledActionSteps
        });
        builder.addCase(getActionStepsReport.rejected, (state, { payload }) => {
            state.actionStepLoading = false
            state.actionStepError = payload
        });
        builder.addCase(getVisitReport.pending, (state, { payload }) => {
            state.visitReportLoading = true
        });
        builder.addCase(getVisitReport.fulfilled, (state, { payload }) => {
            state.visitReportLoading = false
            state.visitReportList = payload.data
            state.visitReportListCount = payload.totalCount
            state.inPersonCount = payload.inPersonCount
            state.virtualCount = payload.virtualCount
            state.emailCount = payload.emailCount
            state.phoneCallCount = payload.phoneCallCount
            state.textCount = payload.textCount
        });
        builder.addCase(getVisitReport.rejected, (state, { payload }) => {
            state.visitReportLoading = false
            state.visitReportError = payload
        });
        builder.addCase(getObjectiveReport.pending, (state, { payload }) => {
            state.objectiveReportLoading = true
        });
        builder.addCase(getObjectiveReport.fulfilled, (state, { payload }) => {
            state.objectiveReportLoading = false
            state.objectiveReportList = payload.data
            state.objectiveReportListCount = payload.totalCount
            state.moststable = payload.mostStable
            state.mostunstable = payload.mostUnstable
        });
        builder.addCase(getObjectiveReport.rejected, (state, { payload }) => {
            state.objectiveReportLoading = false
            state.objectiveReportError = payload
        });

        builder.addCase(getResourceGivenReport.pending, (state, { payload }) => {
            state.resourcegivenReportLoading = true
        });
        builder.addCase(getResourceGivenReport.fulfilled, (state, { payload }) => {
            state.resourcegivenReportLoading = false
            state.resourceGivenList = payload.data
            state.mostUsedResource = payload.mostUsedResource
            state.leastUsedResource = payload.leastUsedResource
            state.resourceGivenListCount = payload.totalCount
        });
        builder.addCase(getResourceGivenReport.rejected, (state, { payload }) => {
            state.resourcegivenReportLoading = false
            state.resourcegivenReportError = payload
        });

        builder.addCase(getPathwaysReport.pending, (state, { payload }) => {
            state.pathwayReportLoading = true;
        });
        builder.addCase(getPathwaysReport.fulfilled, (state, { payload }) => {
            state.pathwayReportLoading = false;
            state.pathwayList = payload.data
            state.pathwayListCount = payload.totalCount
        });
        builder.addCase(getPathwaysReport.rejected, (state, { payload }) => {
            state.pathwayReportLoading = false
            state.pathwaysReportError = payload
        });
    }
})
export default reportSlice.reducer;