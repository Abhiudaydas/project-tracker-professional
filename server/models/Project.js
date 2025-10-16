// server/models/Project.js

const mongoose = require("mongoose");

// 1. DEFINE THE BLUEPRINT FOR A SINGLE TASK
// This tells Mongoose what fields a task object has and their data types.
const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  note: { type: String, default: "" },
  isDone: { type: Boolean, default: false },
});

// 2. DEFINE THE BLUEPRINT FOR A PROJECT
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // 3. TELL THE PROJECT SCHEMA THAT 'tasks' IS AN ARRAY OF TASK DOCUMENTS
    // This is the line that fixes the problem. It links the two schemas.
    tasks: [taskSchema],

    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); // Using timestamps is good practice

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
