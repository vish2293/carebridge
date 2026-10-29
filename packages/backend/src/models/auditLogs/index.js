const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    route: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    accessedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    accessedRole: {
        type: String
    },
    accessedAt: {
        type: Date,
        default: Date.now
    },
    accessedData: {
        type: mongoose.Schema.Types.Mixed
    },
}, {
    timestamps: true
});

const auditLogModel = mongoose.model("audit_log", auditLogSchema);
module.exports = auditLogModel