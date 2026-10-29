const mongoose = require("mongoose");

const needOrCategorySchema = mongoose.Schema(
    {
        name: {
            type: String
        },
        isArchive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const needOrCategoryModel = mongoose.model("need_category", needOrCategorySchema);
module.exports = needOrCategoryModel;
