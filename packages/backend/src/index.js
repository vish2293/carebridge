const express = require('express')
const mainRouter = require('./routes')
const cors = require('cors')
const dotenv = require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') })
const { connectDb } = require('./db')
const { user } = require('./models')
const auditMiddleware = require('./middlewares/auditMiddleware')
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');
// const { requestController } = require('./controllers')

const app = express()
connectDb()
app.set('trust proxy', 1) // behind Vercel's proxy, so rate limits see the real client IP
app.use(helmet())
// CORS_ORIGINS: comma separated list of allowed frontend/admin URLs (empty = allow all, local dev only)
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean)
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined))
app.use(express.json({ limit: '1mb' }));

// slow down brute-force on credential and one-time-code endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false })
app.use(['/user/login', '/user/otp', '/user/resend-otp', '/user/forget-pwd', '/user/reset-pwd', '/admin-user/login'], authLimiter)
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw())
app.use('/', mainRouter)


// Vercel runs the exported app as a serverless function; only listen locally
if (!process.env.VERCEL) {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`server is running on port: ${process.env.PORT || 5000}`)
    })
}

module.exports = app
