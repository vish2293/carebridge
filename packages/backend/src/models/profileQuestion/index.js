const mongoose = require("mongoose");

const ProfileQuestionSchemma = mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        category: {
            type: String,
            default: ""
        },
        isMapped: {
            type: Boolean,
            default: false
        },
        question: {
            type: String,
        },
        questionML: [
            {
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
        selected: {
            type: Boolean,
            default: false
        },
        seq: {
            type: Number
        },
        sequence: {
            type: Number
        },
        questionNumber: {
            type: Number
        }
    },
    {
        timestamps: true,
    }
);

const profileQuestion = mongoose.model("profile_question", ProfileQuestionSchemma);
module.exports = profileQuestion;
