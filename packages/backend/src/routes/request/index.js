const express = require('express')
const { requestController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const { totalRequestCount } = require('../../controllers/request')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const requestRoute = express.Router()

//FOR CREATE REQUEST
requestRoute.post("/createRequest", auth, auditMiddleware, encryptDecryptMiddleware, requestController.createRequest)

//FOR ALL REQUEST
requestRoute.post('/allRequest', auth, auditMiddleware, encryptDecryptMiddleware, requestController.getAllRequests)

//FOR ALL NEW REQUEST
requestRoute.get('/allNewRequest', auth, auditMiddleware, encryptDecryptMiddleware, requestController.getAllNewRequests)
//FOR SEARCH REQUEST
requestRoute.post('/search', auth, auditMiddleware, encryptDecryptMiddleware, requestController.searchRequest)

//FOR ALL SINGLE USER REQUEST
requestRoute.get('/singleUserRequest', auth, auditMiddleware, encryptDecryptMiddleware, requestController.getSingleUserRequestLists)
//FOR GET SINGLE REQUEST
requestRoute.get("/singleRequest", auth, auditMiddleware, encryptDecryptMiddleware, requestController.getSingleRequest)

//FOR UPDATE REQUEST
requestRoute.put("/updateRequest", auth, auditMiddleware, encryptDecryptMiddleware, requestController.updateRequest)

//FOR DELETE REQUEST
requestRoute.delete("/deleteRequest", auth, auditMiddleware, encryptDecryptMiddleware, requestController.deleteRequest)

// MULTIPLE DELETE REQUEST 
requestRoute.delete('/multiple-delete', auth, auditMiddleware, encryptDecryptMiddleware, requestController.multipleDeleteRequest)

requestRoute.put("/assign-chw-to-req", auth, auditMiddleware, encryptDecryptMiddleware, requestController.assignChwinRequest)

requestRoute.put('/list-previous-request/:requestId', auth, auditMiddleware, encryptDecryptMiddleware, requestController.previoudRequestData)

requestRoute.put('/remove-extra-resource', auth, auditMiddleware, encryptDecryptMiddleware, requestController.removeDeletedResourceGiven)

module.exports = { requestRoute }