const express = require('express')
const auth = require('../../middlewares/auth')
const { listClientGoalHistory } = require('../../controllers/clientGoalHistory')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const clientGoalHistoryRouter = express.Router()

clientGoalHistoryRouter.post('/history', auth, auditMiddleware, encryptDecryptMiddleware, listClientGoalHistory)

module.exports = {
    clientGoalHistoryRouter
}