const express = require('express')
const { resourceGivenController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const { imageUpload } = require('../../services/file')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const resourceGivenRouter = express.Router()

resourceGivenRouter.post('/create', auth, imageUpload.array('files', 10000), auditMiddleware, resourceGivenController.createResource)

resourceGivenRouter.put('/update', auth, imageUpload.array('files', 10000), auditMiddleware, resourceGivenController.updateResource)

resourceGivenRouter.put('/list', auth, auditMiddleware,  encryptDecryptMiddleware, resourceGivenController.getAll)

resourceGivenRouter.get('/list-one/:id', auth, auditMiddleware,  encryptDecryptMiddleware, resourceGivenController.getSingleResource)

resourceGivenRouter.post('/create-category', auth, auditMiddleware,  encryptDecryptMiddleware, resourceGivenController.craeteCategory)

resourceGivenRouter.put('/update-category', auth, auditMiddleware,  encryptDecryptMiddleware, resourceGivenController.updateCategory)

resourceGivenRouter.put('/list-category', auth, auditMiddleware,  encryptDecryptMiddleware, resourceGivenController.getAllCategory)

resourceGivenRouter.put('/list-resoruce-category', auditMiddleware,  encryptDecryptMiddleware, resourceGivenController.listResoruceCategory)

resourceGivenRouter.put('/list-resoruce-name', auditMiddleware,  encryptDecryptMiddleware, resourceGivenController.listResoruceNames)

resourceGivenRouter.put('/list-organization', auditMiddleware,  encryptDecryptMiddleware, resourceGivenController.listResourceOrganization)

module.exports = { resourceGivenRouter }