const express = require('express')
const { createNeedOrCategory, listNeedOrCategory, samenameRemove } = require('../../controllers/needOrCategory')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const needOrCategoryRoute = express.Router()

needOrCategoryRoute.post('/create', auth, auditMiddleware, encryptDecryptMiddleware, createNeedOrCategory)

needOrCategoryRoute.get('/get', auth, auditMiddleware, encryptDecryptMiddleware, listNeedOrCategory)

needOrCategoryRoute.put('/remove', samenameRemove)

module.exports = {
    needOrCategoryRoute
} 
