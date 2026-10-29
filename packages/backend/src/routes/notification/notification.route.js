const express = require('express')
const auth = require('../../middlewares/auth')
const { notificationController } = require('../../controllers')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const notificationRouter = express.Router()

notificationRouter.post('/setup-reminder', auth, encryptDecryptMiddleware, notificationController.createReminders)

notificationRouter.put('/update-reminder', auth, encryptDecryptMiddleware, notificationController.updateReminder)

notificationRouter.get("/list-reminder", auth, encryptDecryptMiddleware, notificationController.getReminderList)
notificationRouter.get("/single-reminder", auth, encryptDecryptMiddleware, notificationController.getSingleReminder)

notificationRouter.delete("/delete-reminder/:id", auth, encryptDecryptMiddleware, notificationController.deleteReminders)

module.exports = {
    notificationRouter
} 
