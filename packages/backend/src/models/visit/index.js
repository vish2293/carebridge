const mongoose = require("mongoose");

const visitSchema = mongoose.Schema(
    {
        visitType: {
            type: String,
            required: true
        },
        lengthOfvisit: {
            type: Number,
            required: true
        },
        lengthOfvisitUnit: {
            type: String,
            required: true
        },
        clientStory: {
            type: String,
        },
        primaryNeed: [{ type: mongoose.Schema.Types.ObjectId, ref: "need_category" }],
        pathway: [{ type: mongoose.Schema.Types.ObjectId, ref: "pathways" }],
        otherNeed: [],
        nextSteps: {
            type: String,
        },
        visitDate: { type: Date },
        followupDate: { type: Date },
        followupReason: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        isArchive: {
            type: Boolean,
            default: false
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        assign_to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        createdDate: { type: String },
    },
    {
        timestamps: true,
    }
);

const visit = mongoose.model("visits", visitSchema);
module.exports = visit;
