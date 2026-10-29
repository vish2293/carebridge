const express = require('express')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const { listAuditLogs } = require('../../controllers/auditLogs')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const auditLogRouter = express.Router()

auditLogRouter.post('/list', auth, auditMiddleware, encryptDecryptMiddleware, listAuditLogs)

module.exports = { auditLogRouter }