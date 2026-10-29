import { createSlice } from "@reduxjs/toolkit";
import { getAllResource, getResourceCategoryList, getResourceCategoryOption, getResourceNameOption, getResourceOrganizationOption } from "../actions/resource";

const initialState = {
    resourceList: [],
    resourceLoading: false,
    resourceError: "",
    resourceCategoryOptions: [],
    resourceNameList: [],
    organizationList: [],
    resourceCategoryOptionsLoading: false,
    resourceCategoryOptionsErr: "",
    categoryList: [],
    categoryLoading: false,
    categoryErr: "",

};
const resourceSlice = createSlice({
    name: 'resourceSlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAllResource.pending, (state, { payload }) => {
            state.resourceLoading = true
        });
        builder.addCase(getAllResource.fulfilled, (state, { payload }) => {
            state.resourceLoading = false
            state.resourceList = payload
        });
        builder.addCase(getAllResource.rejected, (state, { payload }) => {
            state.resourceLoading = false
            state.resourceError = payload
        });
        builder.addCase(getResourceCategoryOption.pending, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = true
        });
        builder.addCase(getResourceCategoryOption.fulfilled, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = false
            state.resourceCategoryOptions = payload
        });
        builder.addCase(getResourceCategoryOption.rejected, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = false
            state.resourceCategoryOptionsErr = payload
        });

        builder.addCase(getResourceNameOption.pending, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = true
        });
        builder.addCase(getResourceNameOption.fulfilled, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = false
            state.resourceNameList = payload
        });
        builder.addCase(getResourceNameOption.rejected, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = false
            state.resourceCategoryOptionsErr = payload
        });

        builder.addCase(getResourceOrganizationOption.pending, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = true
        });
        builder.addCase(getResourceOrganizationOption.fulfilled, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = false
            state.organizationList = payload
        });
        builder.addCase(getResourceOrganizationOption.rejected, (state, { payload }) => {
            state.resourceCategoryOptionsLoading = false
            state.resourceCategoryOptionsErr = payload
        });

        builder.addCase(getResourceCategoryList.pending, (state, { payload }) => {
            state.categoryLoading = true
        });
        builder.addCase(getResourceCategoryList.fulfilled, (state, { payload }) => {
            state.categoryLoading = false
            state.categoryList = payload
        });
        builder.addCase(getResourceCategoryList.rejected, (state, { payload }) => {
            state.categoryLoading = false
            state.categoryErr = payload
        });
    }
})
export default resourceSlice.reducer;