const mongoose = require("mongoose")

const resourceCategorySchema = mongoose.Schema({
    resource_category: {
        type: String
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

const resourceCategoryModel = mongoose.model('resorurce_category', resourceCategorySchema)
module.exports = resourceCategoryModel 