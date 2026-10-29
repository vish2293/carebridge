const mongoose = require("mongoose");

const attachmentSchema = mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        name: {
            type: String
        },
        files: [{ 
            type: String,
            default: ""
        }],
        isArchive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const attachmentsModel = mongoose.model("attachments", attachmentSchema);
module.exports = attachmentsModel;
