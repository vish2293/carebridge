const express = require('express')
const auth = require('../../middlewares/auth')
const { listHistoryOfStatus, listActionStepHistory } = require('../../controllers/requestStatusHistory')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const requestStatusHistoryRouter = express.Router()

requestStatusHistoryRouter.post("/history", auth, auditMiddleware, encryptDecryptMiddleware, listHistoryOfStatus)

requestStatusHistoryRouter.post('/all-history', auth, auditMiddleware, encryptDecryptMiddleware, listActionStepHistory)

module.exports = { requestStatusHistoryRouter }