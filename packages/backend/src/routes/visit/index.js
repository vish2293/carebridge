const express = require('express')
const { visitController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const visitRoute = express.Router()

//FOR CREATE QUESTION
visitRoute.post("/create", auth, auditMiddleware, encryptDecryptMiddleware, visitController.createVisit)

//FOR ALL QUESTION
visitRoute.post('/all', auth, auditMiddleware, encryptDecryptMiddleware, visitController.getAllVisit)

//FOR SEARCH QUESTION
visitRoute.get('/search', auth, auditMiddleware, encryptDecryptMiddleware, visitController.searchVisit)

//FOR GET SINGLE QUESTION
visitRoute.get("/single", auth, auditMiddleware, encryptDecryptMiddleware, visitController.getSingleVisit)

//FOR GET USER VISIT LIST
visitRoute.get("/userVisit", auth, auditMiddleware, encryptDecryptMiddleware, visitController.getUserVisitList)

//FOR UPDATE QUESTION
visitRoute.put("/update", auth, auditMiddleware, encryptDecryptMiddleware, visitController.updateVisit)

//FOR DELETE QUESTION
visitRoute.put("/delete", auth, auditMiddleware, encryptDecryptMiddleware, visitController.deleteVisit)

// MULTIPLE DELETE
visitRoute.delete("/multiple-delete", auth, auditMiddleware, encryptDecryptMiddleware, visitController.multipleDeleteVisit)

// MULTIPLE DELETE
visitRoute.get("/visit-type", auth, auditMiddleware, encryptDecryptMiddleware, visitController.getAllVisitByType)

visitRoute.put('/update-todo', auditMiddleware, encryptDecryptMiddleware, visitController.assignTodos)

visitRoute.put('/add-id-of-category', auditMiddleware, encryptDecryptMiddleware, visitController.addIdOfCategory)

module.exports = { visitRoute }