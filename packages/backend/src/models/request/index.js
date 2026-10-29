const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
    {
        createdby: {
            type: mongoose.Schema.Types.ObjectId, ref: "user"
        },
        pathway: { type: mongoose.Schema.Types.ObjectId, ref: "pathways" },
        request_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        notWorkedResoruces: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "resource_given"
        }],
        assign_to: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        assigned_chw: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        visitId: { type: mongoose.Schema.Types.ObjectId, ref: "visits" },
        request_details: {
            type: String
        },
        request_status: {
            type: String
        },
        resources_given: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "resource_given"
        }],
        request_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'need_category'
        },
        urgent: {
            type: Boolean,
            default: false
        },
        is_question_assign: {
            type: Boolean,
            default: false
        },
        is_answer_given: {
            type: Boolean,
            default: false
        },
        is_task_assing: {
            type: Boolean,
            default: false
        },
        isArchive: {
            type: Boolean,
            default: false
        },
        oldStatus: {
            type: String
        }
        // reason: {
        //     type: String
        // }
    },
    {
        timestamps: true,
    }
);

const request = mongoose.model("request", requestSchema);
module.exports = request;
