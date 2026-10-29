const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subjectTemplate: {
    type: String,
    required: true,
  },
  bodyTemplate: {
    type: String,
    required: true,
  },
  craetedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
}, {
  timestamps: true
});

const emailTemplate = mongoose.model('emailTemplate', templateSchema);

module.exports = emailTemplate;
