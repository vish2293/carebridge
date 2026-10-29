const mongoose = require("mongoose")

const resourceGivenSchema = mongoose.Schema({
    resource_name: {
        type: String
    },
    organization: {
        type: String
    },
    resource_details: {
        type: String
    },
    website: {
        type: String
    },
    website: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "resorurce_category"
    },
    eligibility: {
        type: String
    },
    attachments: {
        name: { type: String },
        files: [{
            type: String,
            default: ""
        }],
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    isArchive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const resourceGiven = mongoose.model('resource_given', resourceGivenSchema)
module.exports = resourceGiven 