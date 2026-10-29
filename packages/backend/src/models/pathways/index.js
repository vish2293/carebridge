const mongoose = require('mongoose');

const pathwaySchema = new mongoose.Schema({
    name: {
        type: String
    },
    need: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'need_category'
    },
    description: [{
        type: String
    }],
    isArchive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const pathwayModel = mongoose.model('pathways', pathwaySchema);
module.exports = pathwayModel;
