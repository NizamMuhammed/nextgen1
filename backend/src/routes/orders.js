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

const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "staff" || req.user.role === "admin")) return next();
  return res.status(403).json({ error: "Staff or admin access required" });
};

// Create order (checkout)
router.post("/orders", protect, async (req, res) => {
  try {
    console.log("Order creation request received:", {
      userId: req.user.id,
      body: req.body,
    });

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      console.log("Order validation failed: No order items");
      return res.status(400).json({ error: "No order items" });
    }
    if (!shippingAddress || !paymentMethod) {
      console.log("Order validation failed: Missing shipping address or payment method");
      return res.status(400).json({ error: "Shipping address and payment method are required" });
    }

    // Validate required shipping address fields
    const requiredFields = ["fullName", "address", "city", "postalCode", "country"];
    const missingFields = requiredFields.filter((field) => !shippingAddress[field]);
    if (missingFields.length > 0) {
      console.log("Order validation failed: Missing shipping fields:", missingFields);
      return res.status(400).json({ error: `Missing required shipping fields: ${missingFields.join(", ")}` });
    }

    // Validate stock and prepare items
    console.log("Validating products and stock...");
    const preparedItems = [];
    for (const item of orderItems) {
      console.log(`Checking product: ${item.product}, quantity: ${item.quantity}`);
      const product = await Product.findById(item.product);
      if (!product) {
        console.log(`Product not found: ${item.product}`);
        return res.status(404).json({ error: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        console.log(`Insufficient stock for ${product.name}: requested ${item.quantity}, available ${product.stock}`);
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
    console.log(`Prepared ${preparedItems.length} items for order`);

    console.log("Creating order...");
    const orderData = {
      user: req.user.id,
      orderItems: preparedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      status: "pending",
    };
    console.log("Order data to create:", orderData);

    const order = await Order.create(orderData);
    console.log("Order created successfully:", order._id);

    // Decrement stock AFTER successful order creation
    console.log("Decrementing stock for products...");
    const stockUpdateResults = [];
    for (const p of preparedItems) {
      try {
        // Get current stock before update
        const currentProduct = await Product.findById(p.product);
        const currentStock = currentProduct ? currentProduct.stock : 0;

        const updateResult = await Product.updateOne({ _id: p.product, stock: { $gte: p.quantity } }, { $inc: { stock: -p.quantity } });

        if (updateResult.modifiedCount > 0) {
          const newStock = currentStock - p.quantity;
          console.log(`Stock updated for ${p.name}: ${currentStock} → ${newStock} (-${p.quantity})`);
          stockUpdateResults.push({
            product: p.name,
            success: true,
            quantity: p.quantity,
            oldStock: currentStock,
            newStock: newStock,
          });
        } else {
          console.log(`Stock update failed for ${p.name}: insufficient stock or product not found`);
          stockUpdateResults.push({ product: p.name, success: false, quantity: p.quantity });
        }
      } catch (stockError) {
        console.error(`Error updating stock for ${p.name}:`, stockError);
        stockUpdateResults.push({ product: p.name, success: false, error: stockError.message });
      }
    }

    // Log stock update summary
    const successfulUpdates = stockUpdateResults.filter((r) => r.success);
    const failedUpdates = stockUpdateResults.filter((r) => !r.success);

    console.log(`Stock updates: ${successfulUpdates.length} successful, ${failedUpdates.length} failed`);
    if (failedUpdates.length > 0) {
      console.warn("Failed stock updates:", failedUpdates);
    }

    // Return order with stock update information
    const orderResponse = {
      ...order.toObject(),
      stockUpdates: {
        successful: successfulUpdates,
        failed: failedUpdates,
        summary: `${successfulUpdates.length} products updated, ${failedUpdates.length} failed`,
      },
    };

    res.status(201).json(orderResponse);
  } catch (err) {
    console.error("Create order error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      error: "Failed to create order",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Get orders based on user role
router.get("/orders/my", protect, async (req, res) => {
  try {
    let orders;

    // If user is staff or admin, show all orders
    if (req.user.role === "staff" || req.user.role === "admin") {
      orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    } else {
      // Regular users only see their own orders
      orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
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
    if (String(order.user) !== String(req.user.id) && req.user.role !== "admin" && req.user.role !== "staff") {
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

// Admin/Staff: update order status / delivery
router.put("/orders/:id/status", protect, staffOrAdmin, async (req, res) => {
  try {
    const { status, trackingNumber, estimatedDelivery, isDelivered, isPaid } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status) {
      order.status = status;
      // Automatically set isDelivered based on status
      if (status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      } else if (status === "pending" || status === "packing" || status === "on_delivery") {
        order.isDelivered = false;
        order.deliveredAt = undefined;
      }
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (typeof isDelivered === "boolean") {
      order.isDelivered = isDelivered;
      order.deliveredAt = isDelivered ? new Date() : undefined;
    }
    if (typeof isPaid === "boolean") {
      order.isPaid = isPaid;
      order.paidAt = isPaid ? new Date() : undefined;
    }
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
