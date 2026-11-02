const express = require('express')
const { handleDynamicReminders } = require('../services/croneServices/postPreScheduler')

const cronRouter = express.Router()

// Vercel Cron calls this with "Authorization: Bearer $CRON_SECRET"
cronRouter.get('/reminders', async (req, res) => {
    if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    await handleDynamicReminders()
    res.json({ message: 'Reminders processed' })
})

module.exports = { cronRouter }
