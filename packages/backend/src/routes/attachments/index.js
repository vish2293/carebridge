const express = require('express')
const { adminUserController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const { addAttachments, updateAttachments, deleteAttachments, listAllAttachments, getSingleAttachmentRecord } = require('../../controllers/attachments')
const { imageUpload } = require('../../services/file')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const attachmentsRouter = express.Router()

attachmentsRouter.post('/add', auth, auditMiddleware, imageUpload.array('files', 10000), addAttachments)

attachmentsRouter.put('/update', auth, auditMiddleware, imageUpload.array('files', 10000), updateAttachments)

attachmentsRouter.put('/delete', auth, auditMiddleware, encryptDecryptMiddleware, deleteAttachments)

attachmentsRouter.put('/list-all', auth, auditMiddleware, encryptDecryptMiddleware, listAllAttachments)

attachmentsRouter.put('/list-one', auth, auditMiddleware, encryptDecryptMiddleware, getSingleAttachmentRecord)

module.exports = { attachmentsRouter }