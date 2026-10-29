const express = require('express')
const { userRouter } = require('./user')
const { requestRoute } = require('./request')
const { questionRoute } = require('./question')
const { todoRoute } = require('./todo')
const { reminderRoute } = require('./reminder')
const questionCategoryRoute = require('./questionCategory')
const { emailTemplateRouter } = require('./emailTemplates')
const { notificationRouter } = require('./notification/notification.route')
const { questionClientRouter } = require('./questionClient')
const { taskClientRouter } = require('./taskClient')
const { activityRequestRouter } = require('./activityRequest')
const { adminUserRouter } = require('./adminUser')
const { profileQuestionRoute } = require('./profileQuestion')
const { visitRoute } = require('./visit')
const { visitHistoryRoute } = require('./visitHistory')
const questionObjectiveRoute = require('./questionObjective')
const { importCsvRouter } = require('./importCsv')
const { attachmentsRouter } = require('./attachments')
const { appearanceRouter } = require('./apperance')
const { clientGoalHistoryRouter } = require('./clientGoalHistory')
const { requestStatusHistoryRouter } = require('./requestStatusHistory')
const { reportsRouter } = require('./reports')
const { resourceGivenRouter } = require('./resourceGiven')
const { notesRouter } = require('./notes')
const { taskClientHistoryRouter } = require('./taskClientHistory')
const { userHistoryRouter } = require('./userHistory')
const { exportCSVRouter } = require('./exportCSV')
const { programAdminRouter } = require('./programAdmin')
const { needOrCategoryRoute } = require('./needOrCategory')
const { pathwayRouter } = require('./pathways')
const auditMiddleware = require('../middlewares/auditMiddleware')
const { auditLogRouter } = require('./auditLogs')
const encryptDecryptMiddleware = require('../middlewares/encryptDecryptMiddleware')

const mainRouter = express.Router()

// mainRouter.use(encryptDecryptMiddleware);

mainRouter.use("/user", userRouter)

mainRouter.use("/request", requestRoute)

mainRouter.use("/question", questionRoute)

mainRouter.use("/question", questionCategoryRoute)

mainRouter.use("/todo", todoRoute)

mainRouter.use("/reminder", reminderRoute)

mainRouter.use('/email', emailTemplateRouter)

mainRouter.use('/notification', notificationRouter)

mainRouter.use('/question-client', questionClientRouter)

mainRouter.use('/task-client', taskClientRouter)

mainRouter.use('/activity-request', activityRequestRouter)

mainRouter.use('/admin-user', adminUserRouter)

mainRouter.use('/profile-question', profileQuestionRoute)

mainRouter.use('/visit', visitRoute);

mainRouter.use('/visit-history', visitHistoryRoute)

mainRouter.use('/question-objective', questionObjectiveRoute)

mainRouter.use('/csv', importCsvRouter)

mainRouter.use('/attachments', attachmentsRouter)

mainRouter.use('/apperance', appearanceRouter)

mainRouter.use('/client-goal', clientGoalHistoryRouter)

mainRouter.use('/request-status', requestStatusHistoryRouter)

mainRouter.use('/reports', reportsRouter)

mainRouter.use('/resource-given', resourceGivenRouter)

mainRouter.use('/notes', notesRouter)

mainRouter.use('/task-client-history', taskClientHistoryRouter)

mainRouter.use('/client-history', userHistoryRouter)

mainRouter.use('/export-csv', exportCSVRouter)

mainRouter.use('/program-admin', programAdminRouter)

mainRouter.use('/need-category', needOrCategoryRoute)

mainRouter.use('/pathway', pathwayRouter)

mainRouter.use('/logs', auditLogRouter)

module.exports = mainRouter