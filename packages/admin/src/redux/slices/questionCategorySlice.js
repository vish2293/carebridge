import { createSlice } from "@reduxjs/toolkit";
import { getAllQuestionCategory } from "../actions/questionCategory";

const initialState = {
    questionCategoryList: [],
    questionCategoryDetail:{},    
    questinCategoryLoading: false,
    error: ''
}
const questionCategorySlice = createSlice({
    name: "questionCategorySlice",
    initialState,
    reducers: {},
    extraReducers(builder) {

        //For get all requests
        builder.addCase(getAllQuestionCategory.pending,(state,{payload})=>{
            state.questinCategoryLoading=true
        })
        builder.addCase(getAllQuestionCategory.fulfilled,(state,{payload})=>{
            state.questinCategoryLoading=false
            state.questionCategoryList=payload            
        })
        builder.addCase(getAllQuestionCategory.rejected,(state,{payload})=>{
            state.requestLoading=false
            state.error=payload
        })



    }
})


export default questionCategorySlice.reducer;