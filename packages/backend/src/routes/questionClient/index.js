const express = require('express')
const { questionClientController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const questionClientRouter = express.Router()

questionClientRouter.post("/assign-question", auth, auditMiddleware, encryptDecryptMiddleware, questionClientController.assignQuestion)
questionClientRouter.put("/request-question", auth, auditMiddleware, encryptDecryptMiddleware, questionClientController.getRequestQuestion)
questionClientRouter.put("/answer-question", auth, auditMiddleware, encryptDecryptMiddleware, questionClientController.answerQuestion)

module.exports = { questionClientRouter }