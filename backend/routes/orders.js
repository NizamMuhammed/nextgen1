const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Auth middleware
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
  return res.status(401).json({ error: "Not authorized, no token" });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ error: "Admin access required" });
};

// Create order (checkout)
router.post("/orders", protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: "Shipping address and payment method are required" });
    }

    // Validate stock and prepare items
    const preparedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ error: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      preparedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: item.price ?? product.price,
        name: product.name,
        image: (product.images && product.images[0]) || "",
      });
    }

    // Decrement stock
    for (const p of preparedItems) {
      await Product.updateOne({ _id: p.product, stock: { $gte: p.quantity } }, { $inc: { stock: -p.quantity } });
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems: preparedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get current user's orders
router.get("/orders/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get order by id (owner or admin)
router.get("/orders/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.product", "name price images");
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (String(order.user) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Admin: list all orders
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Mark order as paid
router.put("/orders/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (String(order.user) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = req.body.paymentResult || order.paymentResult;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

// Admin: update order status / delivery
router.put("/orders/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status, trackingNumber, estimatedDelivery, isDelivered } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (typeof isDelivered === "boolean") {
      order.isDelivered = isDelivered;
      order.deliveredAt = isDelivered ? new Date() : undefined;
    }
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
