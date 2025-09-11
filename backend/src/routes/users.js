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

// Staff or Admin middleware
const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "staff" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ error: "Staff or Admin access required" });
  }
};

// GET /api/users - List all users
router.get("/users", protect, staffOrAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "_id name email role createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST /api/users - Add a new user
router.post("/users", protect, staffOrAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Staff cannot create admin users
    if (req.user.role === "staff" && role === "admin") {
      return res.status(403).json({ error: "Staff cannot create admin users" });
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
router.put("/users/:id", protect, staffOrAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Get the existing user to check their current role
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Staff cannot edit admin users or change users to admin
    if (req.user.role === "staff") {
      if (existingUser.role === "admin" || role === "admin") {
        return res.status(403).json({ error: "Staff cannot edit admin users or change users to admin" });
      }
    }

    const update = { name, email, role };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
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

// GET /api/users/me - Get current user profile
router.get("/users/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
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
            $position: 0, // Add to beginning
          },
        },
      },
      {
        new: true,
        upsert: false,
        setDefaultsOnInsert: true,
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

// ===== WISHLIST MANAGEMENT =====

// Get current user's wishlist
router.get("/users/me/wishlist", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get wishlist product IDs
    const wishlistIds = user.wishlist || [];

    if (wishlistIds.length === 0) {
      return res.json([]);
    }

    // Fetch products separately to avoid populate issues
    const products = await Product.find({ _id: { $in: wishlistIds } });
    res.json(products);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// Add product to wishlist
router.post("/users/me/wishlist", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if product is already in wishlist
    const existingUser = await User.findById(req.user.id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Initialize wishlist if it doesn't exist
    if (!existingUser.wishlist) {
      existingUser.wishlist = [];
    }

    // Convert productId to string for comparison
    const productIdStr = productId.toString();

    // Check if product is already in wishlist (convert to string for comparison)
    const isInWishlist = existingUser.wishlist.some((id) => id.toString() === productIdStr);
    if (isInWishlist) {
      return res.status(409).json({ error: "Product already in wishlist" });
    }

    // Add to wishlist using findByIdAndUpdate to avoid validation issues
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $push: { wishlist: productId } }, { new: true, runValidators: false });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({ message: "Product added to wishlist", product });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ error: "Failed to add product to wishlist" });
  }
});

// Remove product from wishlist
router.delete("/users/me/wishlist/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    // Check if product is in wishlist first
    const existingUser = await User.findById(req.user.id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Initialize wishlist if it doesn't exist
    if (!existingUser.wishlist) {
      existingUser.wishlist = [];
    }

    // Convert productId to string for comparison
    const productIdStr = productId.toString();

    // Check if product is in wishlist (convert to string for comparison)
    const isInWishlist = existingUser.wishlist.some((id) => id.toString() === productIdStr);
    if (!isInWishlist) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }

    // Remove from wishlist using findByIdAndUpdate to avoid validation issues
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: productId } }, { new: true, runValidators: false });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ error: "Failed to remove product from wishlist" });
  }
});

// Check if product is in wishlist
router.get("/users/me/wishlist/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Convert productId to string for comparison
    const productIdStr = productId.toString();
    const isInWishlist = user.wishlist.some((id) => id.toString() === productIdStr);
    res.json({ isInWishlist });
  } catch (err) {
    console.error("Error checking wishlist status:", err);
    res.status(500).json({ error: "Failed to check wishlist status" });
  }
});

// ===== SHIPPING ADDRESS MANAGEMENT =====

// Get current user's shipping addresses
router.get("/users/me/shipping-addresses", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.shippingAddresses || []);
  } catch (err) {
    console.error("Error fetching shipping addresses:", err);
    res.status(500).json({ error: "Failed to fetch shipping addresses" });
  }
});

// Add new shipping address for current user
router.post("/users/me/shipping-addresses", protect, async (req, res) => {
  try {
    const { fullName, address, city, postalCode, country, phone, isDefault, label } = req.body;

    // Validate required fields
    if (!fullName || !address || !city || !postalCode || !country) {
      return res.status(400).json({ error: "Full name, address, city, postal code, and country are required" });
    }

    // Additional validation
    if (fullName.length < 2 || fullName.length > 50) {
      return res.status(400).json({ error: "Full name must be between 2 and 50 characters" });
    }
    if (address.length < 5 || address.length > 200) {
      return res.status(400).json({ error: "Address must be between 5 and 200 characters" });
    }
    if (city.length < 2 || city.length > 50) {
      return res.status(400).json({ error: "City must be between 2 and 50 characters" });
    }
    if (postalCode.length < 3 || postalCode.length > 10) {
      return res.status(400).json({ error: "Postal code must be between 3 and 10 characters" });
    }
    if (country.length < 2 || country.length > 50) {
      return res.status(400).json({ error: "Country must be between 2 and 50 characters" });
    }
    if (phone && (phone.length < 10 || phone.length > 15)) {
      return res.status(400).json({ error: "Phone number must be between 10 and 15 characters" });
    }
    if (label && label.length > 30) {
      return res.status(400).json({ error: "Label must be less than 30 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If this is the first address, set it as default
    const isFirstAddress = !user.shippingAddresses || user.shippingAddresses.length === 0;
    const shouldBeDefault = isFirstAddress || isDefault;

    // If setting as default, unset other addresses as default
    if (shouldBeDefault && user.shippingAddresses && user.shippingAddresses.length > 0) {
      user.shippingAddresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      fullName: fullName.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      phone: phone ? phone.trim() : "",
      isDefault: shouldBeDefault,
      label: label ? label.trim() : "",
      createdAt: new Date(),
    };

    if (!user.shippingAddresses) {
      user.shippingAddresses = [];
    }

    user.shippingAddresses.push(newAddress);
    await user.save();

    res.status(201).json(newAddress);
  } catch (err) {
    console.error("Error adding shipping address:", err);
    res.status(500).json({ error: "Failed to add shipping address" });
  }
});

// Update shipping address for current user
router.put("/users/me/shipping-addresses/:addressId", protect, async (req, res) => {
  try {
    const { fullName, address, city, postalCode, country, phone, isDefault, label } = req.body;

    // Validate required fields
    if (!fullName || !address || !city || !postalCode || !country) {
      return res.status(400).json({ error: "Full name, address, city, postal code, and country are required" });
    }

    // Additional validation
    if (fullName.length < 2 || fullName.length > 50) {
      return res.status(400).json({ error: "Full name must be between 2 and 50 characters" });
    }
    if (address.length < 5 || address.length > 200) {
      return res.status(400).json({ error: "Address must be between 5 and 200 characters" });
    }
    if (city.length < 2 || city.length > 50) {
      return res.status(400).json({ error: "City must be between 2 and 50 characters" });
    }
    if (postalCode.length < 3 || postalCode.length > 10) {
      return res.status(400).json({ error: "Postal code must be between 3 and 10 characters" });
    }
    if (country.length < 2 || country.length > 50) {
      return res.status(400).json({ error: "Country must be between 2 and 50 characters" });
    }
    if (phone && (phone.length < 10 || phone.length > 15)) {
      return res.status(400).json({ error: "Phone number must be between 10 and 15 characters" });
    }
    if (label && label.length > 30) {
      return res.status(400).json({ error: "Label must be less than 30 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const addressIndex = user.shippingAddresses.findIndex((addr) => addr._id.toString() === req.params.addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: "Shipping address not found" });
    }

    // If setting as default, unset other addresses as default
    if (isDefault && user.shippingAddresses.length > 0) {
      user.shippingAddresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update the address
    user.shippingAddresses[addressIndex] = {
      ...user.shippingAddresses[addressIndex],
      fullName: fullName.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      phone: phone ? phone.trim() : "",
      isDefault: isDefault || false,
      label: label ? label.trim() : "",
      updatedAt: new Date(),
    };

    await user.save();
    res.json(user.shippingAddresses[addressIndex]);
  } catch (err) {
    console.error("Error updating shipping address:", err);
    res.status(500).json({ error: "Failed to update shipping address" });
  }
});

// Delete shipping address for current user
router.delete("/users/me/shipping-addresses/:addressId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const addressIndex = user.shippingAddresses.findIndex((addr) => addr._id.toString() === req.params.addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: "Shipping address not found" });
    }

    const deletedAddress = user.shippingAddresses[addressIndex];
    const wasDefault = deletedAddress.isDefault;

    // Remove the address
    user.shippingAddresses.splice(addressIndex, 1);

    // If we deleted the default address and there are other addresses, set the first one as default
    if (wasDefault && user.shippingAddresses.length > 0) {
      user.shippingAddresses[0].isDefault = true;
    }

    await user.save();
    res.json({ message: "Shipping address deleted successfully" });
  } catch (err) {
    console.error("Error deleting shipping address:", err);
    res.status(500).json({ error: "Failed to delete shipping address" });
  }
});

// Set shipping address as default for current user
router.put("/users/me/shipping-addresses/:addressId/default", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const addressIndex = user.shippingAddresses.findIndex((addr) => addr._id.toString() === req.params.addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: "Shipping address not found" });
    }

    // Unset all addresses as default
    user.shippingAddresses.forEach((addr) => {
      addr.isDefault = false;
    });

    // Set the selected address as default
    user.shippingAddresses[addressIndex].isDefault = true;
    await user.save();

    res.json({ message: "Default address updated successfully" });
  } catch (err) {
    console.error("Error setting default address:", err);
    res.status(500).json({ error: "Failed to set default address" });
  }
});

module.exports = router;
