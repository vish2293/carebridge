const express = require('express')
const { questionCategoryController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')

const questionCategoryRoute = express.Router()

//FOR CREATE CATEGORY ROUTE
questionCategoryRoute.post("/createCategory", auth, auditMiddleware, encryptDecryptMiddleware, questionCategoryController.createCategory)
//FOR GET ALL CATEGORY ROUTE
questionCategoryRoute.get("/allCategory", auth, auditMiddleware, encryptDecryptMiddleware, questionCategoryController.allCategory)
//FOR GET SINGLE CATEGORY ROUTE
questionCategoryRoute.get("/singleCategory", auth, auditMiddleware, encryptDecryptMiddleware, questionCategoryController.singleCategory)
//FOR GET UPDATE CATEGORY ROUTE
questionCategoryRoute.put("/updateCategory", auth, auditMiddleware, encryptDecryptMiddleware, questionCategoryController.updateCategory)
//FOR GET DELETE CATEGORY ROUTE
questionCategoryRoute.delete("/deleteCategory", auth, auditMiddleware, encryptDecryptMiddleware, questionCategoryController.deleteCategory)

module.exports = questionCategoryRoute