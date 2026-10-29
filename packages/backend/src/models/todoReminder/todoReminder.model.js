const mongoose = require('mongoose');

const reminderFlagSchema = new mongoose.Schema({
    todoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'todo',
    },
    reminderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notification',
    },
    sent: { type: Boolean, default: false },
}, { timestamps: true });

const reminderFlagModel = mongoose.model('reminderFlag', reminderFlagSchema);
module.exports = reminderFlagModel;