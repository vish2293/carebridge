const express = require('express')
const auth = require('../../middlewares/auth')
const { questionObjectiveController } = require('../../controllers')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const questionObjectiveRoute = express.Router()

questionObjectiveRoute.get("/list-objective-history/:id", auth, auditMiddleware, encryptDecryptMiddleware, questionObjectiveController.listObjectives)

module.exports = questionObjectiveRoute