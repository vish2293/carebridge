const express = require('express')
const auth = require('../../middlewares/auth')
const { importCsvController } = require('../../controllers')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const importCsvRouter = express.Router()

importCsvRouter.post('/import-csv', auth, auditMiddleware, encryptDecryptMiddleware, importCsvController.importCsv)

importCsvRouter.get('/get-csv', auth, auditMiddleware, encryptDecryptMiddleware, importCsvController.getCsvData)

module.exports = {
    importCsvRouter
} 
