const mongoose = require("mongoose");

const questionSchemma = mongoose.Schema(
    {
        assign_to: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        createBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        ansBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        request_by: { type: mongoose.Schema.Types.ObjectId, ref: 'request' },
        question: {
            type: String,
        },
        category: { type: String },
        answer: {
            type: String
        },
        ansOptions: {
            type: Array
        },
        isArchive: {
            type: Boolean,
            default: false
        },
        answer_type: { type: String, }

    },
    {
        timestamps: true,
    }
);

const question = mongoose.model("question", questionSchemma);
module.exports = question;
