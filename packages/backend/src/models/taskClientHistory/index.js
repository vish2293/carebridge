const mongoose = require("mongoose");

const taskClientHistorySchema = mongoose.Schema({
    currentStatus: {
        type: String
    },
    newStatus: {
        type: String
    },
    statusReason: {
        type: String
    },
    currentDueDate: {
        type: String
    },
    newDueDate: {
        type: String
    },
    dueDateReason: {
        type: String
    },
    taskClientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task_client"
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

const taskClientHistory = mongoose.model("task_client_history", taskClientHistorySchema);
module.exports = taskClientHistory;