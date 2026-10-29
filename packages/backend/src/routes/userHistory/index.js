const express = require('express')
const auth = require('../../middlewares/auth')
const { userHistoryController } = require('../../controllers')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const userHistoryRouter = express.Router()

userHistoryRouter.put("/list-history", auth, auditMiddleware, encryptDecryptMiddleware, userHistoryController.listHistoryOfUser)

module.exports = { userHistoryRouter }