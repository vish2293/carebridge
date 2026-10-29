const mongoose = require('mongoose')

const objectiveSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    
    label: {
        type: String
    },
    fromValue: {
        type: String
    },
    value: {
        type: String
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

const objective = mongoose.model("question_objective", objectiveSchema);
module.exports = objective;