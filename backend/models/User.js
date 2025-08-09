const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
  lastViewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Array of last 4 viewed products
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
