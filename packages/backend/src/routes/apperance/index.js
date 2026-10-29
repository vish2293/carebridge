const express = require('express')
const { adminUserController, apperanceController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const appearanceRouter = express.Router()

appearanceRouter.post('/create', auth, auditMiddleware, encryptDecryptMiddleware, apperanceController.createApperance)

appearanceRouter.put('/update', auth, auditMiddleware, encryptDecryptMiddleware, apperanceController.updateApperance)

appearanceRouter.get('/list', auth, auditMiddleware, encryptDecryptMiddleware, apperanceController.getApperance)

module.exports = { appearanceRouter }