const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    reminders: [{
        time: { type: Number },
        unit: { type: String, enum: ['minutes', 'hours', 'days', 'weeks'] },
        direction: { type: String, enum: ['before', 'after'], default: 'before' },
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

const notificationModel = mongoose.model('notification', notificationSchema);
module.exports = notificationModel;
