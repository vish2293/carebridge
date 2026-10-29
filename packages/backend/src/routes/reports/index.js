const express = require('express')
const { reportsController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const reportsRouter = express.Router()

reportsRouter.put('/report-user', auth, auditMiddleware, encryptDecryptMiddleware, reportsController.searchUser)

reportsRouter.put('/report-visit', auth, auditMiddleware, encryptDecryptMiddleware, reportsController.serachVisits)

reportsRouter.put('/report-important-dates', auth, auditMiddleware, encryptDecryptMiddleware, reportsController.searchImportantDates)

reportsRouter.put('/report-request', auth, auditMiddleware, encryptDecryptMiddleware, reportsController.serachActionStep)

reportsRouter.put('/report-objectives', auth, auditMiddleware, encryptDecryptMiddleware, reportsController.searchObjectives)

reportsRouter.put('/report-resourcegiven', auth, auditMiddleware, encryptDecryptMiddleware, reportsController.searchResourceGiven)

reportsRouter.put('/report-pathways', auth, auditMiddleware, encryptDecryptMiddleware, reportsController.searchPathways)

module.exports = { reportsRouter }