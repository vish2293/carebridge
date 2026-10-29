const express = require('express')
const mainRouter = require('./routes')
const cors = require('cors')
const cron = require('node-cron')
const dotenv = require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') })
const { connectDb } = require('./db')
const { sendReminder } = require('./services/croneServices')
const { handleDynamicReminders } = require('./services/croneServices/postPreScheduler')
const { user } = require('./models')
const auditMiddleware = require('./middlewares/auditMiddleware')
const morgan = require('morgan');
const requestIp = require('request-ip');
// const { scheduleEmails } = require('./services/croneServices/postPreScheduler')
// const { requestController } = require('./controllers')

const app = express()
connectDb()
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw())
app.use('/', mainRouter)
// sendReminder()
// scheduleEmails(requestController.getAllRequests)
handleDynamicReminders()


// Vercel runs the exported app as a serverless function; only listen locally
if (!process.env.VERCEL) {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`server is running on port: ${process.env.PORT || 5000}`)
    })
}

module.exports = app
