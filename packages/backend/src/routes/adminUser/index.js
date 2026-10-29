const express = require('express')
const { adminUserController } = require('../../controllers')
const auth = require('../../middlewares/auth');
const auditMiddleware = require('../../middlewares/auditMiddleware');
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware');
const adminUserRouter = express.Router()

//FOR CREATE CHW
adminUserRouter.post("/create-user", auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.createUser);
//FOR UPDATE USER
adminUserRouter.put("/update-user", auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.updateUser);
//FOR DELETE USER
adminUserRouter.put("/delete-user", auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.deleteUser);
// RESET PASSWORD
adminUserRouter.post('/change-password', auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.resetPassword);
// RESET EAMIL
adminUserRouter.post('/change-email', auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.changeEmail);
// RESET EAMIL
adminUserRouter.post('/verify-change-email', auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.verifyChangeEmail);
//FOR ALL CHW USERS
adminUserRouter.put('/all-user', auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.getUserByTypeList);
//FOR SEARCH USERS
adminUserRouter.get('/search', auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.searchUser);
//FOR LOGIN Admin
adminUserRouter.post("/login", auditMiddleware, encryptDecryptMiddleware, adminUserController.loginUser)

//FOR GET  USER DETAILS
adminUserRouter.get("/logedInUser", auth, auditMiddleware, encryptDecryptMiddleware, adminUserController.getUserDetails)

module.exports = { adminUserRouter }