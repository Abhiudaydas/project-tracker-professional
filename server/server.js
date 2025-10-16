// server/server.js

require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import your route handlers
const projectRoutes = require("./routes/projects");
const authRoutes = require("./routes/auth");

const app = express();

// --- Core Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow server to accept and parse JSON in request bodies

// --- Route Middleware ---
// This tells Express to use these route handlers for the specified paths
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

// --- Connect to MongoDB and Start Server ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Exit the process if DB connection fails
  });
