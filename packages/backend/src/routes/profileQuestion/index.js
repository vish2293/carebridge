const express = require('express')
const { profileQuestionController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const profileQuestionRoute = express.Router()

//FOR CREATE QUESTION
profileQuestionRoute.post("/create", auth, auditMiddleware, encryptDecryptMiddleware, profileQuestionController.createQuestion)

profileQuestionRoute.put("/update-multiple", auth, auditMiddleware, encryptDecryptMiddleware, profileQuestionController.updateMultipleQuestion)

//FOR ALL QUESTION
profileQuestionRoute.get('/allQuestion', auth, auditMiddleware, encryptDecryptMiddleware, profileQuestionController.getAllQuestionsss)

profileQuestionRoute.get('/onboarding-questions', auditMiddleware, encryptDecryptMiddleware, profileQuestionController.getAllQuestion)

//FOR UPDATE QUESTION
profileQuestionRoute.put("/updateQuestion", auth, auditMiddleware, encryptDecryptMiddleware, profileQuestionController.updateQuestion)

//FOR DELETE QUESTION
profileQuestionRoute.put("/deleteQuestion", auth, auditMiddleware, encryptDecryptMiddleware, profileQuestionController.deleteQuestion)

profileQuestionRoute.get('/check', auditMiddleware, encryptDecryptMiddleware, profileQuestionController.checkCategory)

profileQuestionRoute.put('/update-profile-question', auditMiddleware, encryptDecryptMiddleware, profileQuestionController.updateQuestionNumbers)

profileQuestionRoute.put('/add-question-number', auditMiddleware, encryptDecryptMiddleware, profileQuestionController.addQuestionNumber)

profileQuestionRoute.put('/add-sequence-number', auditMiddleware, encryptDecryptMiddleware, profileQuestionController.addSequenceNumber)

profileQuestionRoute.get('/list-demography', auditMiddleware, encryptDecryptMiddleware, profileQuestionController.getDemography)

module.exports = { profileQuestionRoute }