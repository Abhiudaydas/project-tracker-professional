// server/routes/projects.js

const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/auth");

// 🛡️ CRITICAL STEP: APPLY THE MIDDLEWARE 🛡️
// This line MUST be here, and it MUST be before your other routes.
// It ensures that no unauthenticated user can even attempt to access these routes.
router.use(authMiddleware);

// --- GET all projects FOR THE LOGGED-IN USER ---
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects." });
  }
});

// --- POST a new project FOR THE LOGged-in user ---
router.post("/", async (req, res) => {
  try {
    const defaultTasks = [
      {
        id: `task-${Date.now()}-1`,
        title: "Navigation",
        note: "",
        isDone: false,
      },
      {
        id: `task-${Date.now()}-2`,
        title: "Thank You and Form Settings",
        note: "",
        isDone: false,
      },
      { id: `task-${Date.now()}-3`, title: "Review", note: "", isDone: false },
      {
        id: `task-${Date.now()}-4`,
        title: "Our Team",
        note: "",
        isDone: false,
      },
      {
        id: `task-${Date.now()}-5`,
        title: "Pages / Premium Pages / Blogs",
        note: "",
        isDone: false,
      },
      {
        id: `task-${Date.now()}-6`,
        title: "Custom Content",
        note: "",
        isDone: false,
      },
      { id: `task-${Date.now()}-7`, title: "Gallery", note: "", isDone: false },
      {
        id: `task-${Date.now()}-8`,
        title: "Expendable Footer {service area}",
        note: "",
        isDone: false,
      },
      { id: `task-${Date.now()}-9`, title: "Coupons", note: "", isDone: false },
      {
        id: `task-${Date.now()}-10`,
        title: "Redirection",
        note: "",
        isDone: false,
      },
      {
        id: `task-${Date.now()}-11`,
        title: "QA URL Sheet",
        note: "",
        isDone: false,
      },
      {
        id: `task-${Date.now()}-12`,
        title: "Dummy Pages DLT",
        note: "",
        isDone: false,
      },
    ];

    const project = new Project({
      name: req.body.name,
      user: req.user.id, // This is the critical line
      tasks: defaultTasks,
      isCompleted: false,
    });
    const newProject = await project.save();

    res.status(201).json(newProject);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create project.", error: err.message });
  }
});
// --- PUT (Update) a specific project OWNED BY THE LOGGED-IN USER ---
router.put("/:id", async (req, res) => {
  try {
    const projectToUpdate = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!projectToUpdate) {
      return res
        .status(404)
        .json({ message: "Project not found or you do not have permission." });
    }

    // Update the fields from the request body
    if (req.body.name) projectToUpdate.name = req.body.name;
    if (req.body.tasks) projectToUpdate.tasks = req.body.tasks;
    if (typeof req.body.isCompleted === "boolean") {
      projectToUpdate.isCompleted = req.body.isCompleted;
    }

    const updatedProject = await projectToUpdate.save();
    res.json(updatedProject);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update project.", error: err.message });
  }
});

// --- DELETE a specific project OWNED BY THE LOGGED-IN USER ---
router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedProject) {
      return res
        .status(404)
        .json({ message: "Project not found or you do not have permission." });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project." });
  }
});

module.exports = router;
