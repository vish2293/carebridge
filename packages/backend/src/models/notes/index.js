const mongoose = require("mongoose");

const notesSchemma = mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        dateOfAttempts: {
            type: Date,
            default: Date.now()
        },
        contactType: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Answered", "Not-Answered"]
        },
        description: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        modifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        isArchive: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

const notesModel = mongoose.model("notes", notesSchemma);
module.exports = notesModel;
