const express = require('express')
const auth = require('../../middlewares/auth')
const { emailTemplateController } = require('../../controllers')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const emailTemplateRouter = express.Router()

// CRAETE EMAIL TEMPLATE 
emailTemplateRouter.post('/create-email-temp', auth, encryptDecryptMiddleware,  emailTemplateController.saveTemplate)

emailTemplateRouter.put("/update/:id", encryptDecryptMiddleware, emailTemplateController.updateTemplate)

emailTemplateRouter.get("/get", encryptDecryptMiddleware, emailTemplateController.getTemplate)
//contact Us
emailTemplateRouter.post('/contact-us', encryptDecryptMiddleware, emailTemplateController.contactUsMail)

module.exports = {
    emailTemplateRouter
}
