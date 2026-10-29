const mongoose = require("mongoose");

const questionClientSchemma = mongoose.Schema(
    {        
        clientId:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },
        paid:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },
        chwid:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },        
        requestId:{ type: mongoose.Schema.Types.ObjectId, ref:'request' },
        question: {
            questionId:{ type: mongoose.Schema.Types.ObjectId, ref:'question' },
            question: { type: String },
            category: { type:String },
            answer: { type:String },
            ansOptions: { type:Array },
            answer_type: { type:String }
        },
        category: { type: String },
        answer: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

const questionClient = mongoose.model("question_client", questionClientSchemma);
module.exports = questionClient;
