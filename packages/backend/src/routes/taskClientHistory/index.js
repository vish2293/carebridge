const express = require('express')
const auth = require('../../middlewares/auth')
const { taskClientHistoryController } = require('../../controllers')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const taskClientHistoryRouter = express.Router()

taskClientHistoryRouter.put("/list-history", auth, auditMiddleware, encryptDecryptMiddleware, taskClientHistoryController.listHistoryOfTaskClient)

module.exports = { taskClientHistoryRouter }