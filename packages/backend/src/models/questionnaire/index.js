const mongoose = require("mongoose")

const questionnaireSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    category: {
        type: String,
        default: ""
    },
    question: {
        type: String
    },
    questionML: [
        {
            _id: false,
            key: {
                type: String,
            },
            value: {
                type: String,
            },
        }
    ],
    answers:
    {
        answer_type: { type: String },
        answersML: { type: mongoose.Schema.Types.Mixed },
    },
    short_desc: [
        {
            key: {
                type: String,
            },
            value: {
                type: String,
            },
        }
    ],
    isArchive: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
})

const questionnaireModel = mongoose.model("questionnaire", questionnaireSchema)
module.exports = questionnaireModel