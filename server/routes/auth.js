// server/routes/auth.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure this path is correct

const router = express.Router();

// Helper function to sign a JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// --- REGISTRATION ROUTE ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if all fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    // 3. Create new user (password will be hashed by the pre-save middleware in User.js)
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // 4. Generate token
    const token = signToken(newUser._id);

    // 5. Remove password from output
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    // Find the user and explicitly select the password field
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const token = signToken(user._id);

    // ✅ THE KEY CHANGE: Remove password from the user object before sending
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      // ✅ AND SEND THE USER DATA BACK
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

// IMPORTANT: Make sure this is at the end
module.exports = router;
