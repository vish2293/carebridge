const express = require('express')
const { userController } = require('../../controllers')
const { imageUpload } = require("../../services/file");
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole')
const auditMiddleware = require('../../middlewares/auditMiddleware');
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware');
const userRouter = express.Router()

//FOR CREATE USER
userRouter.post("/register", userController.createUser)
//FOR CREATE CHW
userRouter.post("/createChw", auth, requireRole('Super_Admin', 'Program_Administrator'), auditMiddleware, encryptDecryptMiddleware, userController.createChwAndClient)

userRouter.post("/createClient", auditMiddleware, encryptDecryptMiddleware, userController.createClient)

//FOR VERIFY USER
userRouter.put("/verify", auth, requireRole('Super_Admin'), encryptDecryptMiddleware, userController.verifyEmail)
//FOR LOGIN USER
userRouter.post("/login", encryptDecryptMiddleware, userController.loginUser)
userRouter.post('/otp', encryptDecryptMiddleware, userController.verifyOTP)
userRouter.post('/resend-otp', encryptDecryptMiddleware, userController.resendOTP)
//FOGET PASSWORD
userRouter.post('/forget-pwd', encryptDecryptMiddleware, userController.forgetPwd)
// RESET PASSWORD
userRouter.post('/reset-pwd', encryptDecryptMiddleware, userController.resetPassword)
//FOR ALL USER
userRouter.get('/allUsers', auth, auditMiddleware, encryptDecryptMiddleware, userController.getAllUser)
//FOR ALL CHW USERS
userRouter.get('/allChwUsers', auth, auditMiddleware, encryptDecryptMiddleware, userController.getChwClientList)
//FOR ALL PENDING USERS
userRouter.post("/allClients", auth, auditMiddleware, encryptDecryptMiddleware, userController.getAllClients)
//FOR ALL PENDING USERS
userRouter.post("/allChw", auth, auditMiddleware, encryptDecryptMiddleware, userController.getAllChw)
//FOR SEARCH USERS
userRouter.put('/search', auth, auditMiddleware, encryptDecryptMiddleware, userController.searchUser)
//FOR SEARCH ALL CLIENT
userRouter.post("/searchClient", auth, auditMiddleware, encryptDecryptMiddleware, userController.searchClient)
//FOR SEARCH ALL CHW
userRouter.post("/searchChw", auth, auditMiddleware, encryptDecryptMiddleware, userController.searchChw)
//FOR SEARCH ALL CHW CLIENT
userRouter.post("/searchChwClient", auth, auditMiddleware, encryptDecryptMiddleware, userController.searchChwClient)
//FOR GET  USER DETAILS
userRouter.get("/logedInUser", auth, auditMiddleware, encryptDecryptMiddleware, userController.getUserDetails)
//FOR GET SINGLE USER
userRouter.get("/singleUser", auth, auditMiddleware, encryptDecryptMiddleware, userController.getSingleUser)
//FOR UPDATE USER

userRouter.put("/updateUser", auth, auditMiddleware, imageUpload.single("profileImage"), userController.updateUser)
//FOR DELETE USER
userRouter.delete("/deleteUser", auth, auditMiddleware, encryptDecryptMiddleware, userController.deleteUser)
//FOR DELETE MULTIPLE USER
userRouter.delete("/delete-multiple", auth, requireRole('Super_Admin', 'Program_Administrator'), auditMiddleware, encryptDecryptMiddleware, userController.deleteMultiUser)

//FOR active user
userRouter.put("/get-user-by-active", auth, auditMiddleware, encryptDecryptMiddleware, userController.getUserByActive)

//FOR active user
userRouter.put("/get-user-by-time", auth, auditMiddleware, encryptDecryptMiddleware, userController.getUserByTime)

userRouter.post('/new-signup', auditMiddleware, encryptDecryptMiddleware, userController.newSignUp)
userRouter.get('/profile-history', auth, auditMiddleware, encryptDecryptMiddleware, userController.profileHistory)

userRouter.get('/verify-key/:token', auditMiddleware, encryptDecryptMiddleware, userController.verifyAccessTimeLimit)
userRouter.get('/verify-forget-pwd/:token', auditMiddleware, encryptDecryptMiddleware, userController.verifyForgetLink)
userRouter.put('/set-password', auditMiddleware, encryptDecryptMiddleware, userController.setPassword)
userRouter.put('/change-password', auditMiddleware, encryptDecryptMiddleware, userController.ChangePassword)

userRouter.put('/assign-chw', auth, auditMiddleware, encryptDecryptMiddleware, userController.chwAssign)
userRouter.put('/list-search-chw', auth, auditMiddleware, encryptDecryptMiddleware, userController.listAndSerchCHW)
userRouter.put('/list-search-user', auth, auditMiddleware, encryptDecryptMiddleware, userController.listAndSerchUser)
userRouter.put('/list-search-zipcode', auth, auditMiddleware, encryptDecryptMiddleware, userController.listAndSerchZipCode)
userRouter.put('/list-search-resoruce-given', auth, auditMiddleware, encryptDecryptMiddleware, userController.listAndSerchResourceGiven)
userRouter.get('/list-prononuce', auth, auditMiddleware, encryptDecryptMiddleware, userController.listPrononuce)
userRouter.get('/list-language', auth, auditMiddleware, encryptDecryptMiddleware, userController.listLanaguage)
userRouter.get('/list-ethnicity', auth, auditMiddleware, encryptDecryptMiddleware, userController.listEthinicty)
userRouter.put('/list-assigned-clients', auth, auditMiddleware, encryptDecryptMiddleware, userController.listAssignedClient)

// MERGE ROUTES
userRouter.get('/list-duplicate/:id', auth, auditMiddleware, encryptDecryptMiddleware, userController.listDuplicateUser)
userRouter.put('/merge-data', auth, auditMiddleware, encryptDecryptMiddleware, userController.mergeData)

userRouter.put('/reassessment-date', auth, auditMiddleware, encryptDecryptMiddleware, userController.setReassessmentDateScript)

module.exports = { userRouter }