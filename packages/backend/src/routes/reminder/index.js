const express = require('express')
const auth = require('../../middlewares/auth')
const { reminderController } = require('../../controllers')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const reminderRoute = express.Router()


//FOR CREATE REMINDER
reminderRoute.post('/create', auth, auditMiddleware, encryptDecryptMiddleware, reminderController.createReminder)

//FOR UPDATE REMINDER
reminderRoute.put("/update", auth, auditMiddleware, encryptDecryptMiddleware, reminderController.updateReminder)



module.exports = { reminderRoute }