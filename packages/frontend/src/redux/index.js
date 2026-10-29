import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import requestSlice from "./slices/requestSlice";
import questionCategorySlice from "./slices/questionCategorySlice";
import questionSlice from "./slices/questionSlice";
import todoSlice from "./slices/todoSlice";
import headerSlice from "./slices/headerSlice";
import visitSlice from "./slices/visitSlice";
import attachmentSlice from "./slices/attachmentSlice";
import appearanceSlice from "./slices/appearanceSlice";
import resourceSlice from "./slices/resourceSlice";
import reportSlice from "./slices/reportSlice";
import noteSlice from "./slices/noteSlice";
import exportSlice from "./slices/exportSlice";
import pathwaySlice from "./slices/pathwaySlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        request: requestSlice,
        questionCategory: questionCategorySlice,
        question: questionSlice,
        todo: todoSlice,
        visit: visitSlice,
        header: headerSlice,
        attachment: attachmentSlice,
        appearance: appearanceSlice,
        resource: resourceSlice,
        report: reportSlice,
        note: noteSlice,
        exportCSV: exportSlice,
        pathway: pathwaySlice,
    }
})