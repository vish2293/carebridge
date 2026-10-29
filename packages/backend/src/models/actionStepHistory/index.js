const mongoose = require("mongoose");

const actionStepHistorySchema = mongoose.Schema(
    {
        request_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        assign_to: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        requestId: { type: mongoose.Schema.Types.ObjectId, ref: "request" },
        request_details: {
            type: String
        },
        request_status: {
            type: String
        },
        notWorkedResoruces: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "resource_given"
        }],
        resources_given: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "resource_given"
        }],
        request_type: {
            type: mongoose.Schema.Types.ObjectId, ref: "need_category"
        },
        pathway: {
            type: mongoose.Schema.Types.ObjectId, ref: "pathways"
        },
        urgent: {
            type: Boolean,
            default: false
        },
        isArchive: {
            type: Boolean,
            default: false
        },
        reason: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId, ref: "user"
        },
        modifiedBy: {
            type: mongoose.Schema.Types.ObjectId, ref: "user"
        }
    },
    {
        timestamps: true,
    }
);

const actionStepHistoryModel = mongoose.model("action_step_history", actionStepHistorySchema);
module.exports = actionStepHistoryModel;
