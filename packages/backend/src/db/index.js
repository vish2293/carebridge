const mongoose = require('mongoose')

// One shared connection attempt per function instance. A failed attempt is dropped so the next
// request retries, instead of leaving the instance stuck with queries buffering for 10s.
let connecting
const connectDb = () => {
    if (mongoose.connection.readyState === 1) return Promise.resolve()
    if (!connecting) {
        connecting = mongoose
            .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 })
            .then(() => console.log('Database connected successfully'))
            .catch((error) => {
                connecting = null
                console.log('error: ', error.message)
                throw error
            })
    }
    return connecting
}
module.exports = { connectDb }
