import { createSlice } from "@reduxjs/toolkit";
import { allChw, allChwClients, allClients, allUsers, getActiveUSer, getChwOptions, getClientGoalHistory, getClientOptions, getCsvClient, getEthnicityOptions, getLanguageOptions, getLoginUserDetails, getNewUSer, getObjectiveHistory, getPAwiseCHW, getProfileHistory, getPronounceOptions, getResourceOptions, getSingleUser, getUserStatusHistory, getZipCodeOptions, searchChwClient, searchUser, updateChw, updateClient, updateUser, } from "../actions/user";
import { createVisit } from "../actions/visit";
import { createNotes } from "../actions/notes";

const initialState = {
    userList: [],
    chwClientList: [],
    chwOptions: [],
    zipOptions: [],
    clientOptions: [],
    pronounceOptions: [],
    languageOptions: [],
    ethnicityOptions: [],
    statusHistory:[],
    singleUser: {},
    loggedInUser: {},
    clientList: [],
    csvUser: [],
    csvUserLoading: false,
    porfileHistory: {},
    clientGoalHistory: [],
    clientGoalHistoryLoading: true,
    porfileHistoryLoading: true,
    totalClient: 0,
    totalChw: 0,
    activeUser: 0,
    newUser: 0,
    totalChwClient: 0,
    clientLoading: false,
    chwClientLoading: false,
    chwList: [],
    objectiveHistory: [],
    objectiveHistoryLoading: true,
    chwLoading: false,
    loggedInUserLoading: false,
    userLoading: false,
    singleUserLoading: true,
    clientZipList: [],
    chwOptionsLoading: false,
    zipOptionLoading: false,
    clientOptionLoading: false,
    zipOptionError: "",
    chwOptionsError: "",
    clientOptionError: "",
    error: "",
    resourceOptions: [],
    resourceOptionLoading: false,
    resourceOptionErr: "",
    pronounceLoading:false,
    singleUserError:"",
    pronounceError:"",
    ethnicityLoading:false,
    ethnicityError:"",
    languageLoading:false,
    languageError:"",
    statusHistoryLoading:false,
    statusHistoryError:"",
    getPAwiseCHWData: [],

};
const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        resetUser: (state) => {
            state.singleUser = {};
        }
    },
    extraReducers(builder) {
        //FOR GET ALL USERS
        builder.addCase(allUsers.pending, (state) => {
            state.userLoading = true;
        });
        builder.addCase(allUsers.fulfilled, (state, { payload }) => {
            state.userList = payload?.userLists;
            state.userLoading = false;
        });
        builder.addCase(allUsers.rejected, (state, { payload }) => {
            state.error = payload,
                state.userLoading = false;
        });
        //FOR GET ALL CLIENTS
        builder.addCase(allClients.pending, (state, action) => {
            if (action?.meta?.arg?.filter?.filter?.search) {
                state.clientLoading = false;
            } else if (action?.meta?.arg?.filter?.filter?.search === "") {
                state.clientLoading = false;
            }
            else {
                state.clientLoading = true;
            }

        });
        builder.addCase(allClients.fulfilled, (state, { payload }) => {
            state.clientList = payload?.userLists;
            state.totalClient = payload?.totalUsersCount;
            state.clientZipList = payload?.userLists;
            state.clientLoading = false;
        });
        builder.addCase(allClients.rejected, (state, { payload }) => {
            state.error = payload,
                state.clientLoading = false;
        });
        //FOR GET ALL CHW CLIENT LIST
        builder.addCase(allChwClients.pending, (state) => {
            state.chwClientLoading = true;
        });
        builder.addCase(allChwClients.fulfilled, (state, { payload }) => {
            state.chwClientList = payload?.userLists;
            state.totalChwClient = payload?.totalUsersCount;
            state.chwClientLoading = false;
        });
        builder.addCase(allChwClients.rejected, (state, { payload }) => {
            state.error = payload,
                state.chwClientLoading = false;
        });
        //FOR SEARCH ALL CHW CLIENT LIST
        builder.addCase(searchChwClient.pending, (state) => {
            state.chwClientLoading = true;
        });
        builder.addCase(searchChwClient.fulfilled, (state, { payload }) => {
            state.chwClientList = payload;
            state.chwClientLoading = false;
        });
        builder.addCase(searchChwClient.rejected, (state, { payload }) => {
            state.error = payload,
                state.chwClientLoading = false;
        });
        //FOR GET ALL CHW
        builder.addCase(allChw.pending, (state, action) => {
            if (action?.meta?.arg?.search) {
                state.chwLoading = false;
            } else if (action?.meta?.arg?.search === "") {
                state.chwLoading = false;
            }
            else {
                state.chwLoading = true;
            }

        });
        builder.addCase(allChw.fulfilled, (state, { payload }) => {
            state.chwList = payload?.userLists;
            state.totalChw = payload?.totalUsersCount;
            state.chwLoading = false;
        });
        builder.addCase(allChw.rejected, (state, { payload }) => {
            state.error = payload,
                state.chwLoading = false;
        });
        // FOR GET LOGGED IN USER DETAILS
        builder.addCase(getLoginUserDetails.pending, (state) => {
            state.loggedInUserLoading = true;
        });
        builder.addCase(getLoginUserDetails.fulfilled, (state, { payload }) => {
            state.loggedInUser = payload?.data;
            state.loggedInUserLoading = false;
        });
        builder.addCase(getLoginUserDetails.rejected, (state, { payload }) => {
            state.error = payload;
            state.loggedInUserLoading = false;
        });
        //FOR GET SINGLE USER
        builder.addCase(getSingleUser.pending, (state) => {
            state.singleUserLoading = true;
        });
        builder.addCase(getSingleUser.fulfilled, (state, { payload }) => {
            state.singleUser = payload;
            state.singleUserLoading = false;
        });
        builder.addCase(getSingleUser.rejected, (state, { payload }) => {
            state.error = payload,
                state.singleUserLoading = false;
        });
        // FOR UPDATE USER
        builder.addCase(updateUser.pending, (state) => {
            state.userLoading = true;
        });
        builder.addCase(updateUser.fulfilled, (state, { payload }) => {
            state.loggedInUser = payload?.data;
            state.userLoading = false;
        });
        builder.addCase(updateUser.rejected, (state, { payload }) => {
            state.error = payload,
                state.userLoading = false;
        });
        //FOR UPDATE CLIENT
        // FOR UPDATE USER
        builder.addCase(updateClient.pending, (state) => {
            // state.userLoading = true;
        });
        builder.addCase(updateClient.fulfilled, (state, { payload }) => {
            state.singleUser = payload?.data;
            state.userLoading = false;
        });
        builder.addCase(updateClient.rejected, (state, { payload }) => {
            state.error = payload,
                state.userLoading = false;
        });
        //FOR UPDATE CHW
        builder.addCase(updateChw.pending, (state) => {
            state.userLoading = true;
        });
        builder.addCase(updateChw.fulfilled, (state, { payload }) => {

            state.singleUser = payload?.data;
            state.userLoading = false;
        });
        builder.addCase(updateChw.rejected, (state, { payload }) => {
            state.error = payload,
                state.userLoading = false;
        });
        //For filter
        builder.addCase(searchUser.pending, (state) => {
            state.userLoading = true;
        });
        builder.addCase(searchUser.fulfilled, (state, { payload }) => {
            state.clientList = payload?.data;
            state.userLoading = false;
        });
        builder.addCase(searchUser.rejected, (state, { payload }) => {
            state.error = payload,
                state.userLoading = false;
        });
        // FOR ACTIVE USER
        builder.addCase(getActiveUSer.pending, (state) => {
            state.userLoading = true;
        });
        builder.addCase(getActiveUSer.fulfilled, (state, { payload }) => {
            state.activeUser = payload?.data;
            state.userLoading = false;
        });
        builder.addCase(getActiveUSer.rejected, (state, { payload }) => {
            state.error = payload,
                state.userLoading = false;
        });
        // FOR ACTIVE USER
        builder.addCase(getNewUSer.pending, (state) => {
            state.userLoading = true;
        });
        builder.addCase(getNewUSer.fulfilled, (state, { payload }) => {
            state.newUser = payload?.count;
            state.userLoading = false;
        });
        builder.addCase(getNewUSer.rejected, (state, { payload }) => {
            state.error = payload,
                state.userLoading = false;
        });
        // FOR CSV USERS
        builder.addCase(getCsvClient.pending, (state) => {
            state.csvUserLoading = true;
        });
        builder.addCase(getCsvClient.fulfilled, (state, { payload }) => {
            state.csvUser = payload;
            state.csvUserLoading = false;
        });
        builder.addCase(getCsvClient.rejected, (state, { payload }) => {
            state.error = payload,
                state.csvUserLoading = false;
        });
        builder.addCase(getProfileHistory.pending, (state) => {
            state.porfileHistoryLoading = true;
        });
        builder.addCase(getProfileHistory.fulfilled, (state, { payload }) => {
            state.porfileHistory = payload?.data
            state.porfileHistoryLoading = false;
        });
        builder.addCase(getProfileHistory.rejected, (state, { payload }) => {
            state.error = payload,
                state.porfileHistoryLoading = false;
        });

        builder.addCase(createVisit.pending, (state, { payload }) => {
        })
        builder.addCase(createVisit.fulfilled, (state, { payload }) => {
            state.singleUser = payload.data.findUserOfData
        })
        builder.addCase(createVisit.rejected, (state, { payload }) => {
            state.error = payload
        })

        builder.addCase(getObjectiveHistory.pending, (state, { payload }) => {
            state.objectiveHistoryLoading = true
        })
        builder.addCase(getObjectiveHistory.fulfilled, (state, { payload }) => {
            state.objectiveHistoryLoading = false
            state.objectiveHistory = payload
        })
        builder.addCase(getObjectiveHistory.rejected, (state, { payload }) => {
            state.objectiveHistoryLoading = false
            state.error = payload
        })

        builder.addCase(getClientGoalHistory.pending, (state, { payload }) => {
            state.clientGoalHistoryLoading = true
        })
        builder.addCase(getClientGoalHistory.fulfilled, (state, { payload }) => {
            state.clientGoalHistoryLoading = false
            state.clientGoalHistory = payload
        })
        builder.addCase(getClientGoalHistory.rejected, (state, { payload }) => {
            state.clientGoalHistoryLoading = false
            state.error = payload
        })
        builder.addCase(getChwOptions.pending, (state, { payload }) => {
            state.chwOptionsLoading = true
        });
        builder.addCase(getChwOptions.fulfilled, (state, { payload }) => {
            state.chwOptionsLoading = false
            state.chwOptions = payload
        });
        builder.addCase(getChwOptions.rejected, (state, { payload }) => {
            state.chwOptionsLoading = false
            state.chwOptionsError = payload
        });
        builder.addCase(getZipCodeOptions.pending, (state, { payload }) => {
            state.zipOptionLoading = true
        });
        builder.addCase(getZipCodeOptions.fulfilled, (state, { payload }) => {
            state.zipOptionLoading = false
            state.zipOptions = payload
        });
        builder.addCase(getZipCodeOptions.rejected, (state, { payload }) => {
            state.zipOptionLoading = false
            state.zipOptionError = payload
        });
        builder.addCase(getClientOptions.pending, (state, { payload }) => {
            state.clientOptionLoading = true
        });
        builder.addCase(getClientOptions.fulfilled, (state, { payload }) => {
            state.clientOptionLoading = false
            state.clientOptions = payload
        });
        builder.addCase(getClientOptions.rejected, (state, { payload }) => {
            state.clientOptionLoading = false
            state.clientOptionError = payload
        });
        builder.addCase(getResourceOptions.pending, (state, { payload }) => {
            state.resourceOptionLoading = true
        });
        builder.addCase(getResourceOptions.fulfilled, (state, { payload }) => {
            state.resourceOptionLoading = false
            state.resourceOptions = payload
        });
        builder.addCase(getResourceOptions.rejected, (state, { payload }) => {
            state.resourceOptionLoading = false
            state.resourceOptionErr = payload
        });
        builder.addCase(getPronounceOptions.pending, (state, { payload }) => {
            state.pronounceLoading = true
        });
        builder.addCase(getPronounceOptions.fulfilled, (state, { payload }) => {
            state.pronounceLoading = false
            state.pronounceOptions = payload
        });
        builder.addCase(getPronounceOptions.rejected, (state, { payload }) => {
            state.pronounceLoading = false
            state.pronounceError = payload
        });
        builder.addCase(getLanguageOptions.pending, (state, { payload }) => {
            state.languageLoading = true
        });
        builder.addCase(getLanguageOptions.fulfilled, (state, { payload }) => {
            state.languageLoading = false
            state.languageOptions = payload
        });
        builder.addCase(getLanguageOptions.rejected, (state, { payload }) => {
            state.languageLoading = false
            state.languageError = payload
        });
        builder.addCase(getEthnicityOptions.pending, (state, { payload }) => {
            state.ethnicityLoading = true
        });
        builder.addCase(getEthnicityOptions.fulfilled, (state, { payload }) => {
            state.ethnicityLoading = false
            state.ethnicityOptions = payload
        });
        builder.addCase(getEthnicityOptions.rejected, (state, { payload }) => {
            state.ethnicityLoading = false
            state.ethnicityError = payload
        });
        builder.addCase(createNotes.pending, (state, { payload }) => {
            // state.singleUserLoading = true
        });
        builder.addCase(createNotes.fulfilled, (state, { payload }) => {
            state.singleUserLoading = false
            state.singleUser = payload?.userData
        });
        builder.addCase(createNotes.rejected, (state, { payload }) => {
            state.singleUserLoading = false
            state.singleUserError = payload
        });
        builder.addCase(getUserStatusHistory.pending, (state, { payload }) => {
            state.statusHistoryLoading = true
        });
        builder.addCase(getUserStatusHistory.fulfilled, (state, { payload }) => {
            state.statusHistoryLoading = false
            state.statusHistory = payload
        });
        builder.addCase(getUserStatusHistory.rejected, (state, { payload }) => {
            state.statusHistoryLoading = false
            state.statusHistoryError = payload
        });

        builder.addCase(getPAwiseCHW.pending, (state, { payload }) => {
            state.PALoading = true;
        });
        builder.addCase(getPAwiseCHW.fulfilled, (state, { payload }) => {
            state.PALoading = false;
            state.getPAwiseCHWData = payload;
        });
        builder.addCase(getPAwiseCHW.rejected, (state, { payload }) => {
            state.PALoading = false;
            state.PAError = payload;
        });

    }
});
export const { resetUser } = userSlice.actions
export default userSlice.reducer;