const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Review = require("../models/Review");
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

// Create or update a review
router.post("/reviews", protect, async (req, res) => {
  try {
    const { productId, rating, title, comment, images } = req.body;
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ error: "Product, rating, title, and comment are required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Check if user has delivered orders for this product
    const Order = require("../models/Order");
    const deliveredOrders = await Order.find({
      user: req.user.id,
      isDelivered: true,
      "orderItems.product": productId,
    });

    if (deliveredOrders.length === 0) {
      return res.status(403).json({
        error: "You must have a delivered order to review this product",
        code: "REVIEW_NOT_ELIGIBLE",
      });
    }

    let review = await Review.findOne({ user: req.user.id, product: productId });
    if (review) {
      review.rating = rating;
      review.title = title;
      review.comment = comment;
      review.images = Array.isArray(images) ? images : review.images;
      review.verified = true; // Mark as verified since user has delivered order
      await review.save();
    } else {
      review = await Review.create({
        user: req.user.id,
        product: productId,
        rating,
        title,
        comment,
        images: Array.isArray(images) ? images : [],
        verified: true, // Mark as verified since user has delivered order
      });
    }

    // Update product rating aggregates
    const agg = await Review.aggregate([{ $match: { product: product._id } }, { $group: { _id: "$product", average: { $avg: "$rating" }, count: { $sum: 1 } } }]);
    const stats = agg[0] || { average: 0, count: 0 };
    product.ratings.average = Number(stats.average.toFixed(2));
    product.ratings.count = stats.count;
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// List reviews for a product
router.get("/reviews/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name").sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Check if user can review a product (has delivered orders)
router.get("/reviews/can-review/:productId", protect, async (req, res) => {
  try {
    const Order = require("../models/Order");

    // Check if user has any delivered orders containing this product
    const deliveredOrders = await Order.find({
      user: req.user.id,
      isDelivered: true,
      "orderItems.product": req.params.productId,
    });

    const canReview = deliveredOrders.length > 0;

    res.json({
      canReview,
      deliveredOrdersCount: deliveredOrders.length,
      message: canReview ? "You can review this product" : "You must have a delivered order to review this product",
    });
  } catch (err) {
    console.error("Check review eligibility error:", err);
    res.status(500).json({ error: "Failed to check review eligibility" });
  }
});

// Mark review as helpful
router.post("/reviews/:id/helpful", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (!review.helpful.includes(req.user.id)) {
      review.helpful.push(req.user.id);
      await review.save();
    }
    res.json({ helpfulCount: review.helpful.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to update helpful vote" });
  }
});

module.exports = router;
