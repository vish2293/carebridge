const cron = require("node-cron")
const { todos, sendTodos } = require("../../models")
const { cronScheduler } = require("./cronScheduler")

const sendReminder = async () => {
    try {
        // cron.schedule("*/1 * * * *",cronScheduler)
        // cron.schedule("* * * * * *",cronScheduler)
    } catch (error) {
        console.log('error', error)
    }
}
module.exports = { sendReminder }

