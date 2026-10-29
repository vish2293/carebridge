import { createSlice } from "@reduxjs/toolkit";

const headerState = createSlice({
    name: "updateHeader",
    initialState: {
        headerValue: { name: "dashboard", heading: "Dashboard" },
        sideBarValue: false
    },
    reducers: {
        setActiveHeader: (state, action) => {
            state.headerValue = action.payload;
        },
        setActiveSidebar: (state, action) => {
            state.sideBarValue = action.payload;
        }
    }
})

export const { setActiveHeader, setActiveSidebar } = headerState.actions

export default headerState.reducer;