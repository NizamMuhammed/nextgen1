const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// Middleware to protect routes (example - needs refinement)
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

// Admin check middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// GET /api/products - Get all products (or search/filter)
router.get("/products", async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search by name
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/categories - Get all product categories
router.get("/products/categories", (req, res) => {
  const categories = ["Electronics", "Computers", "Smartphones", "Accessories", "Home Appliances", "Gaming", "Wearables", "Other"];
  res.json(categories);
});

// POST /api/products/upload-image - Upload a product image
router.post("/products/upload-image", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return the relative path to the uploaded file
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// GET /api/products/:id - Get a single product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /api/products - Add a new product (Admin only)
router.post("/products", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, images, stock } = req.body;
    if (!name || !price || !category || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Name, price, category, and at least one image are required." });
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      stock,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Failed to add product" });
  }
});

// PUT /api/products/:id - Update a product by ID (Admin only)
router.put("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Failed to update product" });
  }
});

// DELETE /api/products/:id - Delete a product by ID (Admin only)
router.delete("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
