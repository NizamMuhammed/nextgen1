const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const emailService = require("../services/emailService");
const router = express.Router();

const User = require("../models/User");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register
router.post("/signup", async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate OTP and set expiration (10 minutes from now)
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      username,
      email,
      password: hashed,
      role: role || "customer",
      otp,
      otpExpires,
    });

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(email, otp, name);
    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      // Don't fail the registration, just log the error
    }

    res.status(201).json({
      message: "User registered successfully. Please check your email for verification code.",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ error: "No OTP found. Please request a new one." });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Verify the email
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send welcome email
    const emailResult = await emailService.sendWelcomeEmail(email, user.name);
    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
    }

    res.json({
      message: "Email verified successfully! Welcome to NextGen Electronics!",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP email
    const emailResult = await emailService.sendOTPEmail(email, otp, user.name);
    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

    res.json({
      message: "New OTP sent to your email address",
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
});

module.exports = router;
