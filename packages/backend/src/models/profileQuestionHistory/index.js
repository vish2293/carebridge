const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    answer: {
        type: String,
    },
    _id: false
});

const profileQuestionSchema = new mongoose.Schema({
    _id: false,
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile_question'
    },
    answer: [answerSchema]
});

const profileQuestionHistorySchema = new mongoose.Schema({
    profileQuestion: [profileQuestionSchema],
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    submittedBy: {
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

const profileQuestionHistory = mongoose.model('profile_question_history', profileQuestionHistorySchema)
module.exports = profileQuestionHistory