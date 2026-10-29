const { default: mongoose } = require("mongoose");

const actionPathwaySchema = new mongoose.Schema({
    pathwayId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pathways"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String
    },
    requestId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "request"
    }],
    outcomes: [{
        type: String
    }]
}, {
    timestamps: true
});

const actionPathwayModel = mongoose.model("action_pathway", actionPathwaySchema);
module.exports = actionPathwayModel