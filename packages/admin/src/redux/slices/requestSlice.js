import { createSlice } from "@reduxjs/toolkit";
import { answerQuestion, getActionStepHistory, getAllNewRequest, getAllRequest, getRequestActivityLog, getRequestStatusHistory, getRequestionQuestion, previousRequestData, singleRequest, singleUserRequest, updateRequest } from "../actions/request";
import { completeAssignTask } from "../actions/todo";


const initialState = {
  requestList: [],
  requestDetaile: {},
  requestQuestions: [],
  singleUserRequestLists: [],
  singleUserRequestCount: 0,
  requestActivityStatus: [],
  requestStatusHistory: [],
  actionStepHistory: [],
  requestStatusLoading: true,
  totalRequestCount: 0,
  inProgressRequestCount: 0,
  completedRequestCount: 0,
  newRequestCount: 0,
  requestLoading: true,
  singleUserRequestLoading: false,
  singleRequestLoading: true,
  requestQuestionLoading: false,
  updateRequestLoading: false,
  error: "",
  oldRequestData: []
};
const requestSlice = createSlice({
  name: "requestSlice",
  initialState,
  reducers: {
    resetRequest: (state) => {
      state.requestDetaile = {};
    }
  },
  extraReducers(builder) {

    //For get all requests
    builder.addCase(getAllRequest.pending, (state, action) => {
      if (action?.meta?.arg?.filter?.search) {
        state.requestLoading = false;
      } else if (action?.meta?.arg?.filter?.search === "") {
        state.requestLoading = false;
      } else {
        state.requestLoading = true;
      }

    });
    builder.addCase(getAllRequest.fulfilled, (state, { payload }) => {
      state.requestLoading = false;
      state.requestList = payload?.requestList;
      state.totalRequestCount = payload?.totalRequestCount
      state.newRequestCount = payload?.newRequestCount
      state.inProgressRequestCount = payload?.inProgressRequestCount
      state.completedRequestCount = payload?.completedRequestCount
    });
    builder.addCase(getAllRequest.rejected, (state, { payload }) => {
      state.requestLoading = false;
      state.error = payload;
    });
    //For get all new requests
    builder.addCase(getAllNewRequest.pending, (state, { payload }) => {
      state.requestLoading = true;
    });
    builder.addCase(getAllNewRequest.fulfilled, (state, { payload }) => {
      state.requestLoading = false;
      state.requestList = payload?.requestList;
      state.totalRequestCount = payload?.totalRequestCount
      state.newRequestCount = payload?.newRequestCount
      state.inProgressRequestCount = payload?.inProgressRequestCount
      state.completedRequestCount = payload?.completedRequestCount
    });
    builder.addCase(getAllNewRequest.rejected, (state, { payload }) => {
      state.requestLoading = false;
      state.error = payload;
    });

    //FOR ALL USER REQUEST LISTS
    builder.addCase(singleUserRequest.pending, (state, { payload }) => {
      state.singleUserRequestLoading = true;
    });
    builder.addCase(singleUserRequest.fulfilled, (state, { payload }) => {
      state.singleUserRequestLoading = false;
      state.singleUserRequestLists = payload?.data;
      state.singleUserRequestCount = payload?.requestCount;
    });
    builder.addCase(singleUserRequest.rejected, (state, { payload }) => {
      state.singleUserRequestLoading = false;
      state.error = payload;
    });
    //FOR ALL SINGLE REQUEST 
    builder.addCase(singleRequest.pending, (state, { payload }) => {
      state.singleRequestLoading = true;
    });
    builder.addCase(singleRequest.fulfilled, (state, { payload }) => {
      state.singleRequestLoading = false;
      state.requestDetaile = payload;
    });
    builder.addCase(singleRequest.rejected, (state, { payload }) => {
      state.singleRequestLoading = false;
      state.error = payload;
    });
    //FOR REQUEST QUESTIONS
    builder.addCase(getRequestionQuestion.pending, (state, { payload }) => {
      state.requestQuestionLoading = true;
    });
    builder.addCase(getRequestionQuestion.fulfilled, (state, { payload }) => {
      state.requestQuestionLoading = false;
      state.requestQuestions = payload;
    });
    builder.addCase(getRequestionQuestion.rejected, (state, { payload }) => {
      state.requestQuestionLoading = false;
      state.error = payload;
    });
    //FOR SUBMIT ANSWER
    builder.addCase(answerQuestion.pending, (state, { payload }) => {
      state.requestQuestionLoading = true;
    });
    builder.addCase(answerQuestion.fulfilled, (state, { payload }) => {
      state.requestQuestions = payload?.arrAnswer;
      state.requestDetaile = payload?.updatedRequest;
      state.requestQuestionLoading = false;
    });
    builder.addCase(answerQuestion.rejected, (state, { payload }) => {
      state.requestQuestionLoading = false;
      state.error = payload;
    });
    //FOR REQUEST STATUS LOG
    builder.addCase(getRequestActivityLog.pending, (state, { payload }) => {
      state.requestQuestionLoading = true;
    });
    builder.addCase(getRequestActivityLog.fulfilled, (state, { payload }) => {
      state.requestActivityStatus = payload;
      state.requestQuestionLoading = false;
    });
    builder.addCase(getRequestActivityLog.rejected, (state, { payload }) => {
      state.requestQuestionLoading = false;
      state.error = payload;
    });

    //FOR REQUEST STATUS LOG
    builder.addCase(completeAssignTask.pending, (state, { payload }) => {
      state.requestQuestionLoading = true;
    });
    builder.addCase(completeAssignTask.fulfilled, (state, { payload }) => {
      state.requestDetaile.request_status = payload?.data?.requestId?.request_status;
      state.requestQuestionLoading = false;
    });
    builder.addCase(completeAssignTask.rejected, (state, { payload }) => {
      state.requestQuestionLoading = false;
      state.error = payload;
    });
    // FOR UPDATE REQUEST
    builder.addCase(updateRequest.pending, (state, { payload }) => {
      state.updateRequestLoading = true;
    });
    builder.addCase(updateRequest.fulfilled, (state, { payload }) => {
      state.requestDetaile = payload?.data
      state.updateRequestLoading = false;
    });
    builder.addCase(updateRequest.rejected, (state, { payload }) => {
      state.updateRequestLoading = false;
      state.error = payload;
    });

    builder.addCase(getRequestStatusHistory.pending, (state, { payload }) => {
      state.requestStatusLoading = true;
    });
    builder.addCase(getRequestStatusHistory.fulfilled, (state, { payload }) => {
      state.requestStatusHistory = payload?.data
      state.requestStatusLoading = false;
    });
    builder.addCase(getRequestStatusHistory.rejected, (state, { payload }) => {
      state.requestStatusLoading = false;
      state.error = payload;
    });

    builder.addCase(getActionStepHistory.pending, (state, { payload }) => {
      state.requestStatusLoading = true;
    });
    builder.addCase(getActionStepHistory.fulfilled, (state, { payload }) => {
      state.actionStepHistory = payload?.data
      state.requestStatusLoading = false;
    });
    builder.addCase(getActionStepHistory.rejected, (state, { payload }) => {
      state.requestStatusLoading = false;
      state.error = payload;
    });

    builder.addCase(previousRequestData.pending, (state, { payload }) => {
      state.requestStatusLoading = true;
    });
    builder.addCase(previousRequestData.fulfilled, (state, { payload }) => {
      state.oldRequestData = payload?.data
      state.requestStatusLoading = false;
    });
    builder.addCase(previousRequestData.rejected, (state, { payload }) => {
      state.requestStatusLoading = false;
      state.error = payload;
    });
  },
});

export const { resetRequest } = requestSlice.actions
export default requestSlice.reducer;
