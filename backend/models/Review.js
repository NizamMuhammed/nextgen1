const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    title: { type: String, required: true },
    verified: { type: Boolean, default: false },
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    images: [String],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from same user for same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
