const express = require('express')
const { activityRequestController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const activityRequestRouter = express.Router()

activityRequestRouter.post("/get-activity", auth, auditMiddleware, encryptDecryptMiddleware, activityRequestController.getActivityRequest)
activityRequestRouter.put("/add-activity", auth, auditMiddleware, encryptDecryptMiddleware, activityRequestController.addActivityRequest)

module.exports = { activityRequestRouter }