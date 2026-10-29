const mongoose = require('mongoose')

const clientStatusHistorySchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    newstatus: {
        type: String
    },
    oldStatus: {
        type: String
    },
    statusReason: {
        type: String
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})

const clientStatusHistoryModel = mongoose.model("client_status_history", clientStatusHistorySchema)
module.exports = clientStatusHistoryModel 