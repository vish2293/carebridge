const express = require('express')
const auth = require('../../middlewares/auth')
const { createPA, verifyKey, updatePA, getAllPA, deletePA, getSinglePA, getPAwiseCHW, assignPAIdtoCHW, listAndSerchPA, setPasswordForPA } = require('../../controllers/programAdmin')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const programAdminRouter = express.Router()

programAdminRouter.post('/create', auth, auditMiddleware, encryptDecryptMiddleware, createPA)

programAdminRouter.get("/verify-key/:token", auditMiddleware, encryptDecryptMiddleware, verifyKey)

programAdminRouter.put('/set-pa-password', auditMiddleware, encryptDecryptMiddleware, setPasswordForPA)

programAdminRouter.put('/update', auth, auditMiddleware, encryptDecryptMiddleware, updatePA)

programAdminRouter.put('/get-all', auth, auditMiddleware, encryptDecryptMiddleware, getAllPA)

programAdminRouter.put("/delete/:id", auth, auditMiddleware, encryptDecryptMiddleware, deletePA)

programAdminRouter.get('/get-single/:id', auth, auditMiddleware, encryptDecryptMiddleware, getSinglePA)

programAdminRouter.put('/get-chw-list', auth, auditMiddleware, encryptDecryptMiddleware, getPAwiseCHW)

programAdminRouter.put("/assign-paid", auditMiddleware, encryptDecryptMiddleware, assignPAIdtoCHW)

programAdminRouter.put('/list-pa', auth, auditMiddleware, encryptDecryptMiddleware, listAndSerchPA)

module.exports = { programAdminRouter }