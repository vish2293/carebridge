const express = require('express')
const { todoController } = require('../../controllers')
const auth = require('../../middlewares/auth')
const auditMiddleware = require('../../middlewares/auditMiddleware')
const encryptDecryptMiddleware = require('../../middlewares/encryptDecryptMiddleware')
const todoRoute = express.Router()

//FOR CREATE QUESTION
todoRoute.post("/create", auth, auditMiddleware, encryptDecryptMiddleware, todoController.createTodo)

//FOR ALL QUESTION
todoRoute.get('/all', auth, auditMiddleware, encryptDecryptMiddleware, todoController.getAllTodo)

//FOR ALL USER TODO
todoRoute.get("/userTodo", auth, auditMiddleware, encryptDecryptMiddleware, todoController.getllUserTodo)

//FOR SEARCH QUESTION
todoRoute.get('/search', auth, auditMiddleware, encryptDecryptMiddleware, todoController.searchTodo)

//FOR GET SINGLE QUESTION
todoRoute.get("/single", auth, auditMiddleware, encryptDecryptMiddleware, todoController.getSingleTodo)

//FOR UPDATE QUESTION
todoRoute.put("/update", auth, auditMiddleware, encryptDecryptMiddleware, todoController.updateTodo)

//FOR DELETE QUESTION
todoRoute.put("/delete", auth, auditMiddleware, encryptDecryptMiddleware, todoController.deleteTodo)

// MULTIPLE DELETE
todoRoute.delete("/multiple-delete", auth, auditMiddleware, encryptDecryptMiddleware, todoController.multipleDeleteTodos)

module.exports = { todoRoute }