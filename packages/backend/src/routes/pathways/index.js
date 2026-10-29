const express = require('express')
const auth = require('../../middlewares/auth')
const { createPathway, updatePathway, deletePathway, listSinglePathway, listAllPathways, listPathwayOnBaseOfNeed, listPathwayNames, getNeedName, fetchOutcomes } = require('../../controllers/pathways')
const { updatePathwayData } = require('../../controllers/request')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const pathwayRouter = express.Router()

pathwayRouter.post('/create', auth, auditMiddleware, encryptDecryptMiddleware, createPathway)

pathwayRouter.put('/update', auth, auditMiddleware, encryptDecryptMiddleware, updatePathway)

pathwayRouter.put('/delete/:id', auth, auditMiddleware, encryptDecryptMiddleware, deletePathway)

pathwayRouter.get('/get-single/:id', auth, auditMiddleware, encryptDecryptMiddleware, listSinglePathway)

pathwayRouter.post('/get-all', auth, auditMiddleware, encryptDecryptMiddleware, listAllPathways)

pathwayRouter.put('/get-need', auth, auditMiddleware, encryptDecryptMiddleware, listPathwayOnBaseOfNeed)

pathwayRouter.put("/list-pathways", auth, auditMiddleware, encryptDecryptMiddleware, listPathwayNames)

pathwayRouter.put('/get-need-name', auth, auditMiddleware, encryptDecryptMiddleware, getNeedName)

pathwayRouter.put('/outcomes', auth, auditMiddleware, encryptDecryptMiddleware, fetchOutcomes)

pathwayRouter.put('/outcome-result', auth, auditMiddleware, encryptDecryptMiddleware, updatePathwayData)

module.exports = {
    pathwayRouter
} 
