const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

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

// Middleware to protect admin routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

// Get dashboard statistics
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get order statistics
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const completedOrders = orders.filter((order) => order.status === "completed").length;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
});

// Get recent orders
router.get("/recent-orders", protect, adminOnly, async (req, res) => {
  try {
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email");

    const formattedOrders = recentOrders.map((order) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.user?.name || order.user?.email || "Unknown Customer",
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Error fetching recent orders" });
  }
});

// Get recent users
router.get("/recent-users", protect, adminOnly, async (req, res) => {
  try {
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select("name email role createdAt");

    res.json(recentUsers);
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({ message: "Error fetching recent users" });
  }
});

// Get recent products
router.get("/recent-products", protect, adminOnly, async (req, res) => {
  try {
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(10).select("name price image createdAt");

    res.json(recentProducts);
  } catch (error) {
    console.error("Error fetching recent products:", error);
    res.status(500).json({ message: "Error fetching recent products" });
  }
});

// Get low stock products
router.get("/low-stock-products", protect, adminOnly, async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 })
      .limit(5)
      .select("name price stock image");

    res.json(lowStockProducts);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ message: "Error fetching low stock products" });
  }
});

module.exports = router;
