import { createSlice } from "@reduxjs/toolkit";
import { getActionStepsExport, getAuditLogsExport, getImportantDateExport, getObjectiveExport, getPathwaysExport, getResourceGivemExport, getUserExport, getVisitExport } from "../actions/export";

const initialState = {
    userExportLists: [],
    userExportListsCount: 0,
    userExportLoading: false,
    userExportError: "",
    importantDateExportList: [],
    importantDateExportLoading: false,
    importantDateExportListCount: 0,
    importantDateExportError: "",
    actionStepExportList: [],
    actionStepExportListCount: 0,
    actionStepExportLoading: false,
    actionStepExportError: "",
    visitExportList: [],
    visitExportListCount: 0,
    visitExportLoading: false,
    visitExportError: "",
    objectiveExportList: [],
    objectiveExportLoading: false,
    objectiveExportListCount: 0,
    objectiveExportError: "",
    resourcegivenExportList: [],
    resourcegivenExportCount: 0,
    resourcegivenExportLoading: false,
    resourcegivenExportError: "",
    pathwayExportList: [],
    pathwayExportLoading: false,
    pathwayExportListCount: 0,
    pathwaysExportError: "",
    auditLogsExportList: [],
    auditLogsExportLoading: false,
    auditLogsExportListCount: 0,
    auditLogssExportError: "",
}
const exportSlice = createSlice({
    name: "exportSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserExport.pending, (state, { payload }) => {
            state.userExportLoading = true
        });
        builder.addCase(getUserExport.fulfilled, (state, { payload }) => {
            state.userExportLoading = false
            state.userExportLists = payload
            state.userExportListsCount = payload.totalCount
        });
        builder.addCase(getUserExport.rejected, (state, { payload }) => {
            state.userExportLoading = false
            state.userExportError = payload
        });

        builder.addCase(getImportantDateExport.pending, (state, { payload }) => {
            state.importantDateExportLoading = true
        });
        builder.addCase(getImportantDateExport.fulfilled, (state, { payload }) => {
            state.importantDateExportLoading = false
            state.importantDateExportList = payload
            state.importantDateExportListCount = payload.totalCount
        });
        builder.addCase(getImportantDateExport.rejected, (state, { payload }) => {
            state.importantDateExportLoading = false
            state.importantDateExportError = payload
        });

        builder.addCase(getActionStepsExport.pending, (state, { payload }) => {
            state.actionStepExportLoading = true
        });
        builder.addCase(getActionStepsExport.fulfilled, (state, { payload }) => {
            state.actionStepExportLoading = false
            state.actionStepExportList = payload.data
            state.actionStepExportListCount = payload.totalCount
        });
        builder.addCase(getActionStepsExport.rejected, (state, { payload }) => {
            state.actionStepExportLoading = false
            state.actionStepExportError = payload
        });

        builder.addCase(getVisitExport.pending, (state, { payload }) => {
            state.visitExportLoading = true
        });
        builder.addCase(getVisitExport.fulfilled, (state, { payload }) => {
            state.visitExportLoading = false
            state.visitExportList = payload
            state.visitExportListCount = payload.totalCount
        });
        builder.addCase(getVisitExport.rejected, (state, { payload }) => {
            state.visitExportLoading = false
            state.visitExportError = payload
        });

        builder.addCase(getObjectiveExport.pending, (state, { payload }) => {
            state.objectiveExportLoading = true
        });
        builder.addCase(getObjectiveExport.fulfilled, (state, { payload }) => {
            state.objectiveExportLoading = false
            state.objectiveExportList = payload
            state.objectiveExportListCount = payload.totalCount
        });
        builder.addCase(getObjectiveExport.rejected, (state, { payload }) => {
            state.objectiveExportLoading = false
            state.objectiveExportError = payload
        });

        builder.addCase(getResourceGivemExport.pending, (state, { payload }) => {
            state.resourcegivenExportLoading = true
        });
        builder.addCase(getResourceGivemExport.fulfilled, (state, { payload }) => {
            state.resourcegivenExportLoading = false
            state.resourcegivenExportList = payload
            state.resourcegivenExportCount = payload.totalCount
        });
        builder.addCase(getResourceGivemExport.rejected, (state, { payload }) => {
            state.resourcegivenExportLoading = false
            state.resourcegivenExportError = payload
        });

        builder.addCase(getPathwaysExport.pending, (state, { payload }) => {
            state.pathwayExportLoading = true
        });
        builder.addCase(getPathwaysExport.fulfilled, (state, { payload }) => {
            state.pathwayExportLoading = false
            state.pathwayExportList = payload
            state.pathwayExportListCount = payload.totalCount
        });
        builder.addCase(getPathwaysExport.rejected, (state, { payload }) => {
            state.pathwayExportLoading = false
            state.pathwaysExportError = payload
        });

        builder.addCase(getAuditLogsExport.pending, (state, { payload }) => {
            state.auditLogsExportLoading = true
        });
        builder.addCase(getAuditLogsExport.fulfilled, (state, { payload }) => {
            state.auditLogsExportLoading = false
            state.auditLogsExportList = payload
            state.auditLogsExportListCount = payload.totalCount
        });
        builder.addCase(getAuditLogsExport.rejected, (state, { payload }) => {
            state.auditLogsExportLoading = false
            state.auditLogssExportError = payload
        });
    }
})
export default exportSlice.reducer;