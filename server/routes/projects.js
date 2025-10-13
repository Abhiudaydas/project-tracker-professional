const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Default tasks
const DEFAULT_TASKS = [
  { id: "1", title: "navigation", isDone: false, note: "" },
  { id: "2", title: "thank you and form settings", isDone: false, note: "" },
  { id: "3", title: "review", isDone: false, note: "" },
  { id: "4", title: "our team", isDone: false, note: "" },
  { id: "5", title: "pages /premium pages/blogs", isDone: false, note: "" },
  { id: "6", title: "custom content", isDone: false, note: "" },
  { id: "7", title: "gallery", isDone: false, note: "" },
  {
    id: "8",
    title: "expendable footer{service area}",
    isDone: false,
    note: "",
  },
  { id: "9", title: "coupons", isDone: false, note: "" },
  { id: "10", title: "redirection", isDone: false, note: "" },
  { id: "11", title: "qa url sheet", isDone: false, note: "" },
  { id: "12", title: "dummy pages dlt", isDone: false, note: "" },
];

// GET All Projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST New Project
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name required" });

  try {
    const newProject = new Project({
      name,
      tasks: DEFAULT_TASKS,
    });
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT Update Project (Tasks OR Completion Status)
router.put("/:id", async (req, res) => {
  const { tasks, isCompleted } = req.body; // Can send either tasks or isCompleted

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...(tasks !== undefined && { tasks }),
        ...(isCompleted !== undefined && { isCompleted }),
      },
      { new: true }
    );
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Project
router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
