const mongoose = require("mongoose");

const clientGoalHistorySchema =  mongoose.Schema({
    visitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visit'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    from_client_goal: {
        type: String
    },
    to_client_goal: {
        type: String
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
}, {
    timestamps: true
})

const client_goal_history = mongoose.model("client_goal_history", clientGoalHistorySchema);
module.exports = client_goal_history;
