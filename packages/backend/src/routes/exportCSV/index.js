const express = require('express')
const { exportCSVController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const { exportAuditLogs } = require('../../controllers/exportCSV')
const exportCSVRouter = express.Router()

exportCSVRouter.put('/export-user', auth, auditMiddleware, encryptDecryptMiddleware, exportCSVController.exportUser)

exportCSVRouter.put('/export-visit', auth, auditMiddleware, encryptDecryptMiddleware, exportCSVController.exportVisits)

exportCSVRouter.put('/export-important-dates', auth, auditMiddleware, encryptDecryptMiddleware, exportCSVController.exportImportantDates)

exportCSVRouter.put('/export-request', auth, auditMiddleware, encryptDecryptMiddleware, exportCSVController.exportActionStep)

exportCSVRouter.put('/export-objectives', auth, auditMiddleware, encryptDecryptMiddleware, exportCSVController.exportObjectives)

exportCSVRouter.put('/export-resourcegiven', auth, auditMiddleware, encryptDecryptMiddleware, exportCSVController.exportResourceGiven)

exportCSVRouter.put('/export-pathways', auth, auditMiddleware, encryptDecryptMiddleware, exportCSVController.exportPathways)

exportCSVRouter.put('/export-audit-logs', auth, auditMiddleware, encryptDecryptMiddleware, exportCSVController.exportAuditLogs)

module.exports = { exportCSVRouter }