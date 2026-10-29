const express = require('express')
const { notesController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const notesRouter = express.Router()

notesRouter.post('/create', auth, auditMiddleware, encryptDecryptMiddleware, notesController.createNotes)

notesRouter.put('/list', auth, auditMiddleware, encryptDecryptMiddleware, notesController.getAllNotes)

notesRouter.put('/update-delete', auth, auditMiddleware, encryptDecryptMiddleware, notesController.updateDeleteNotes)

module.exports = {
    notesRouter
} 
