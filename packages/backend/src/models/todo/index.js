const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    assign_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    category: {
      type: String,
    },
    task_name: { type: String },
    task_description: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Completed", "In-Progress"],
      default: "Pending",
    },
    dueDate: { type: Date },
    isArchive: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const todo = mongoose.model("todo", todoSchema);
module.exports = todo;
