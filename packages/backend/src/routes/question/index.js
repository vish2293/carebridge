const express = require('express')
const { questionController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const questionRoute = express.Router()


//FOR CREATE QUESTION
questionRoute.post("/create", auth, auditMiddleware, encryptDecryptMiddleware, questionController.createQuestion)

//FOR ALL QUESTION
questionRoute.get('/allQuestion', auth, auditMiddleware, encryptDecryptMiddleware, questionController.getAllQuestion)

//FOR SEARCH QUESTION
questionRoute.post('/searchQuestion', auth, auditMiddleware, encryptDecryptMiddleware, questionController.searchQuestion)

//FOR GET SINGLE QUESTION
questionRoute.get("/singleQuestion", auth, auditMiddleware, encryptDecryptMiddleware, questionController.getSingleQuestion)

//FOR UPDATE QUESTION
questionRoute.put("/updateQuestion", auth, auditMiddleware, encryptDecryptMiddleware, questionController.updateQuestion)

//FOR DELETE QUESTION
questionRoute.delete("/deleteQuestion", auth, auditMiddleware, encryptDecryptMiddleware, questionController.deleteQuestion)

//FOR DELETE MULTIPLE QUESTION
questionRoute.delete("/delete-multiple", auth, auditMiddleware, encryptDecryptMiddleware, questionController.deleteMultipleQuestion)

module.exports = { questionRoute }