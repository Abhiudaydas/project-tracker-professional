const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  isDone: { type: Boolean, default: false },
  note: { type: String, default: "" },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }, // <-- Project Checklist
  tasks: [taskSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
