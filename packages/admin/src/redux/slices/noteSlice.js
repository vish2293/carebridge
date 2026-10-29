import { createSlice } from "@reduxjs/toolkit";
import { getAllNotes } from "../actions/notes";

const initialState = {
    noteList: [],
    noteLoading: false,
    noteError: ""

};
const noteSlice = createSlice({
    name: 'noteSlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAllNotes.pending, (state, { payload }) => {
            state.noteLoading = true;
        });
        builder.addCase(getAllNotes.fulfilled, (state, { payload }) => {
            state.noteLoading = false;
            state.noteList = payload;
        });
        builder.addCase(getAllNotes.rejected, (state, { payload }) => {
            state.noteLoading = false;
            state.noteError = payload;
        });
    }
})
export default noteSlice.reducer;