const mongoose = require("mongoose");

const reuqestStatusHistorySchema = mongoose.Schema({
    currentStatus: {
        type: String
    },
    newStatus: {
        type: String
    },
    reason: {
        type: String
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "request"
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

const requestStatusHistory = mongoose.model("request_status", reuqestStatusHistorySchema);
module.exports = requestStatusHistory;