const mongoose = require("mongoose");

// Shipping address sub-schema
const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String },
  isDefault: { type: Boolean, default: false },
  label: { type: String }, // e.g., "Home", "Work", "Office"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "staff", "admin"], default: "customer" },
  isEmailVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  lastViewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Array of last 4 viewed products
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Array of wishlist products
  shippingAddresses: [shippingAddressSchema], // Array of shipping addresses
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
