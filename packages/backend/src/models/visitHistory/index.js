const mongoose = require('mongoose')

const visitHistorySchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    visitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visits'
    },
    visitType: {
        type: String
    },
    visitDate: {
        type: String
    },
    lengthOfVisit: {
        type: String
    },
    clientStory: {
        type: String
    },
    clientGoal: {
        type: String
    },
    primaryNeed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'need_category'
    }],
    pathway: [{
        type: mongoose.Schema.Types.ObjectId, ref: "pathways"
    }],
    otherNeed: [{
        type: String
    }],
    followUpdate: {
        type: Date
    },
    followUpReason: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})

const visitHistory = mongoose.model("visit_history", visitHistorySchema)
module.exports = visitHistory 