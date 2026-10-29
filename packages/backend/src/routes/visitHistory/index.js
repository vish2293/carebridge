const express = require('express')
const { visitHistoryController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const visitHistoryRoute = express.Router()

visitHistoryRoute.get("/list-history/:id", auth, auditMiddleware, encryptDecryptMiddleware, visitHistoryController.listVisitHistory)

module.exports = { visitHistoryRoute }