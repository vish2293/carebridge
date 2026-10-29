import { createSlice } from "@reduxjs/toolkit";
import { allOnBoardingQuestion, allProfileQuestion, allDemography, allQuestion, getProfileCategory, searchQuestion, updateClientQuestions, updateProfileQuestion, } from "../actions/question";

const initialState = {
    questionList: [],
    profileQuestionList: [],
    onboardingQuestionList: [],
    profileQuestionCategory: [],
    profileQuestionLoading: true,
    onboardingQuestionLoading: true,
    singleQuestion: {},
    demographyList: [],
    questionLoading: false,
    error: ""
};
const questionSlice = createSlice({
    name: "questionSlice",
    initialState,
    reducers: {},
    extraReducers(builder) {

        //For get all question
        builder.addCase(allQuestion.pending, (state, { payload }) => {
            state.questionLoading = true;
        });
        builder.addCase(allQuestion.fulfilled, (state, { payload }) => {
            state.questionLoading = false;
            state.questionList = payload;
        });
        builder.addCase(allQuestion.rejected, (state, { payload }) => {
            state.questionLoading = false;
            state.error = payload;
        });

        //For get all question
        builder.addCase(allProfileQuestion.pending, (state, { payload }) => {
            state.profileQuestionLoading = true;
        });
        builder.addCase(allProfileQuestion.fulfilled, (state, { payload }) => {
            state.profileQuestionLoading = false;
            state.profileQuestionList = payload.questionList;
        });
        builder.addCase(allProfileQuestion.rejected, (state, { payload }) => {
            state.profileQuestionLoading = false;
            state.error = payload;
        });

        builder.addCase(allDemography.pending, (state, { payload }) => {
            state.profileQuestionLoading = true;
        });
        builder.addCase(allDemography.fulfilled, (state, { payload }) => {
            state.profileQuestionLoading = false;
            state.demographyList = payload.questionList;
        });
        builder.addCase(allDemography.rejected, (state, { payload }) => {
            state.profileQuestionLoading = false;
            state.error = payload;
        });

        builder.addCase(allOnBoardingQuestion.pending, (state, { payload }) => {
            state.profileQuestionLoading = true;
        });
        builder.addCase(allOnBoardingQuestion.fulfilled, (state, { payload }) => {
            state.profileQuestionLoading = false;
            state.profileQuestionList = payload.questionList;
        });
        builder.addCase(allOnBoardingQuestion.rejected, (state, { payload }) => {
            state.profileQuestionLoading = false;
            state.error = payload;
        });

        // For update profile queston lists
        builder.addCase(updateProfileQuestion.pending, (state, { payload }) => {
            state.questionLoading = true;
        });
        builder.addCase(updateProfileQuestion.fulfilled, (state, { payload }) => {
            state.questionLoading = false;
            state.profileQuestionList = payload.data;
        });
        builder.addCase(updateProfileQuestion.rejected, (state, { payload }) => {
            state.questionLoading = false;
            state.error = payload;
        });
        builder.addCase(updateClientQuestions.pending, (state, { payload }) => {
            state.questionLoading = true;
        });
        builder.addCase(updateClientQuestions.fulfilled, (state, { payload }) => {
            state.questionLoading = false;
            state.profileQuestionList = payload.data;
        });
        builder.addCase(updateClientQuestions.rejected, (state, { payload }) => {
            state.questionLoading = false;
            state.error = payload;
        });
        builder.addCase(getProfileCategory.pending, (state, { payload }) => {
        });
        builder.addCase(getProfileCategory.fulfilled, (state, { payload }) => {
            state.profileQuestionCategory = payload
        });
        builder.addCase(getProfileCategory.rejected, (state, { payload }) => {
            state.error = payload;
        });

        //For search question
        builder.addCase(searchQuestion.pending, (state, { payload }) => {
            state.questionLoading = true;
        });
        builder.addCase(searchQuestion.fulfilled, (state, { payload }) => {
            state.questionList = payload;
            state.questionLoading = false;
        });
        builder.addCase(searchQuestion.rejected, (state, { payload }) => {
            state.questionLoading = false;
            state.error = payload;
        });


    }
});


export default questionSlice.reducer;