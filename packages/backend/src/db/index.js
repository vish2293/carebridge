const mongoose = require('mongoose')
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log('Database connected successfully')
    } catch (error) {
        console.log("error: ", error)
    }

}
module.exports = { connectDb }