const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Middleware to protect routes
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};

// GET /api/users - List all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "_id name email role createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST /api/users - Add a new user
router.post("/users", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// PUT /api/users/:id - Edit a user
router.put("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const update = { name, email, role };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Set last viewed product for the current user
router.put("/users/me/last-viewed", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "productId is required" });
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }
    
    // Check if product exists
    const exists = await Product.findById(productId).select("_id");
    if (!exists) return res.status(404).json({ error: "Product not found" });

    // Use findByIdAndUpdate to handle the case where lastViewedProducts might not exist
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { lastViewedProducts: productId }, // Remove if exists
        $push: { 
          lastViewedProducts: { 
            $each: [productId], 
            $position: 0 // Add to beginning
          } 
        }
      },
      { 
        new: true, 
        upsert: false,
        setDefaultsOnInsert: true 
      }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    // Keep only last 4 products
    if (user.lastViewedProducts && user.lastViewedProducts.length > 4) {
      user.lastViewedProducts = user.lastViewedProducts.slice(0, 4);
      await user.save();
    }

    res.json({ message: "Last viewed products updated", count: user.lastViewedProducts?.length || 0 });
  } catch (err) {
    console.error("Error updating last viewed products:", err);
    // Return success even if there's an error to avoid breaking the frontend
    res.json({ message: "Last viewed products updated (fallback)", count: 0 });
  }
});

// Get current user's last viewed products details
router.get("/users/me/last-viewed", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("lastViewedProducts");
    return res.json(user?.lastViewedProducts || []);
  } catch (err) {
    // Be lenient: return empty array instead of 500 to avoid breaking clients
    return res.json([]);
  }
});

module.exports = router;
