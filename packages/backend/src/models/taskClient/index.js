const mongoose = require("mongoose");

const taskClientSchemma = mongoose.Schema(
    {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        createdby: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        assign_to: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        visitId: { type: mongoose.Schema.Types.ObjectId, ref: "visits" },
        // requestId:{ type: mongoose.Schema.Types.ObjectId, ref:'request' },
        task: {
            // taskId:{ type: mongoose.Schema.Types.ObjectId, ref:'task' },
            category: [{ type: mongoose.Schema.Types.ObjectId, ref: "need_category" }],
            task_name: { type: String },
            task_description: { type: String },
            status: { type: String, default: 'Pending', enum: ["Pending", "Completed", "In-Progress", "Canceled"], },
        },
        dueDate: { type: Date },
        // status: { type: String, default: "" },
        isArchive: {
            type: Boolean,
            default: false
        },                                                                                                            
        isOverdue: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const taskClient = mongoose.model("task_client", taskClientSchemma);
module.exports = taskClient;
