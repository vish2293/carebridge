const express = require('express')
const auth = require('../../middlewares/auth')
const requireRole = require('../../middlewares/requireRole')
const { emailTemplateController } = require('../../controllers')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const emailTemplateRouter = express.Router()

// CRAETE EMAIL TEMPLATE 
emailTemplateRouter.post('/create-email-temp', auth, requireRole('Super_Admin'), encryptDecryptMiddleware,  emailTemplateController.saveTemplate)

emailTemplateRouter.put("/update/:id", auth, requireRole('Super_Admin'), encryptDecryptMiddleware, emailTemplateController.updateTemplate)

emailTemplateRouter.get("/get", encryptDecryptMiddleware, emailTemplateController.getTemplate)
//contact Us
emailTemplateRouter.post('/contact-us', encryptDecryptMiddleware, emailTemplateController.contactUsMail)

module.exports = {
    emailTemplateRouter
}
