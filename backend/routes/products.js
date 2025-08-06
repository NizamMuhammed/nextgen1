const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

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

// Multer setup for image uploads with memory storage
const storage = multer.memoryStorage(); // Use memory storage for processing
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Enhanced GET /api/products - Get all products with advanced search, filtering, and sorting
router.get("/products", async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, minStock, maxStock, sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 20, inStock } = req.query;

    // Build query object
    let query = {};

    // Search functionality - search across name, description, and brand
    if (search && search.trim()) {
      query.$or = [{ name: { $regex: search.trim(), $options: "i" } }, { description: { $regex: search.trim(), $options: "i" } }, { brand: { $regex: search.trim(), $options: "i" } }];
    }

    // Category filter
    if (category && category.trim()) {
      query.category = { $regex: category.trim(), $options: "i" };
    }

    // Brand filter
    if (brand && brand.trim()) {
      query.brand = { $regex: brand.trim(), $options: "i" };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Stock range filter
    if (minStock || maxStock) {
      query.stock = {};
      if (minStock) query.stock.$gte = parseInt(minStock);
      if (maxStock) query.stock.$lte = parseInt(maxStock);
    }

    // In stock filter
    if (inStock === "true") {
      query.stock = { $gt: 0 };
    } else if (inStock === "false") {
      query.stock = { $lte: 0 };
    }

    // Build sort object
    let sort = {};
    const validSortFields = ["name", "price", "stock", "createdAt", "brand", "category"];
    const validSortOrders = ["asc", "desc"];

    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by newest first
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const products = await Product.find(query).sort(sort).skip(skip).limit(limitNum).lean();

    // Get total count for pagination info
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Calculate pagination metadata
    const pagination = {
      currentPage: pageNum,
      totalPages,
      totalProducts,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      nextPage: pageNum < totalPages ? pageNum + 1 : null,
      prevPage: pageNum > 1 ? pageNum - 1 : null,
    };

    res.json({
      products,
      pagination,
      filters: {
        search: search || "",
        category: category || "",
        brand: brand || "",
        minPrice: minPrice || "",
        maxPrice: maxPrice || "",
        minStock: minStock || "",
        maxStock: maxStock || "",
        sortBy,
        sortOrder,
        inStock: inStock || "",
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/categories - Get all product categories dynamically
router.get("/products/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const filteredCategories = categories.filter((cat) => cat && cat.trim() !== "");
    res.json(filteredCategories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    // Fallback to static categories if database query fails
    const fallbackCategories = ["Electronics", "Computers", "Smartphones", "Accessories", "Home Appliances", "Gaming", "Wearables", "Other"];
    res.json(fallbackCategories);
  }
});

// GET /api/products/brands - Get all product brands dynamically
router.get("/products/brands", async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    const filteredBrands = brands.filter((brand) => brand && brand.trim() !== "");
    res.json(filteredBrands);
  } catch (err) {
    console.error("Error fetching brands:", err);
    // Fallback to static brands if database query fails
    const fallbackBrands = [
      "Apple",
      "Samsung",
      "Sony",
      "LG",
      "Panasonic",
      "Philips",
      "Sharp",
      "Toshiba",
      "Dell",
      "HP",
      "Lenovo",
      "Asus",
      "Acer",
      "MSI",
      "Razer",
      "Alienware",
      "Xiaomi",
      "Huawei",
      "OnePlus",
      "Google",
      "Nokia",
      "Motorola",
      "BlackBerry",
      "Nintendo",
      "Microsoft",
      "Sega",
      "Atari",
      "Valve",
      "Steam",
      "Fitbit",
      "Garmin",
      "Polar",
      "Suunto",
      "Withings",
      "Amazfit",
      "Nest",
      "Ring",
      "Arlo",
      "Eufy",
      "Wyze",
      "Blink",
      "SimpliSafe",
      "ADT",
      "Other",
    ];
    res.json(fallbackBrands);
  }
});

// GET /api/products/search-suggestions - Get search suggestions
router.get("/products/search-suggestions", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const suggestions = await Product.find({
      $or: [{ name: { $regex: q.trim(), $options: "i" } }, { brand: { $regex: q.trim(), $options: "i" } }, { category: { $regex: q.trim(), $options: "i" } }],
    })
      .select("name brand category")
      .limit(10)
      .lean();

    // Create unique suggestions
    const uniqueSuggestions = [];
    const seen = new Set();

    suggestions.forEach((item) => {
      if (!seen.has(item.name)) {
        uniqueSuggestions.push({ type: "product", value: item.name });
        seen.add(item.name);
      }
      if (!seen.has(item.brand)) {
        uniqueSuggestions.push({ type: "brand", value: item.brand });
        seen.add(item.brand);
      }
      if (!seen.has(item.category)) {
        uniqueSuggestions.push({ type: "category", value: item.category });
        seen.add(item.category);
      }
    });

    res.json(uniqueSuggestions.slice(0, 10));
  } catch (err) {
    console.error("Error fetching search suggestions:", err);
    res.json([]);
  }
});

// GET /api/products/stats - Get product statistics
router.get("/products/stats", async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: "$price" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $min: "$price" },
          totalStock: { $sum: "$stock" },
          inStockProducts: {
            $sum: { $cond: [{ $gt: ["$stock", 0] }, 1, 0] },
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $lte: ["$stock", 0] }, 1, 0] },
          },
        },
      },
    ]);

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const brandStats = await Product.aggregate([
      {
        $group: {
          _id: "$brand",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      overall: stats[0] || {
        totalProducts: 0,
        totalValue: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        totalStock: 0,
        inStockProducts: 0,
        outOfStockProducts: 0,
      },
      categories: categoryStats,
      brands: brandStats,
    });
  } catch (err) {
    console.error("Error fetching product stats:", err);
    res.status(500).json({ error: "Failed to fetch product statistics" });
  }
});

// POST /api/products/upload-image - Upload and process product image
router.post("/products/upload-image", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate unique filename
    const filename = `${uuidv4()}.jpg`;
    const outputPath = path.join(__dirname, "../uploads", filename);

    // Process image with sharp
    await sharp(req.file.buffer)
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside", // Maintain aspect ratio
        withoutEnlargement: true, // Don't enlarge if image is smaller
      })
      .jpeg({
        quality: 80,
        progressive: true,
        chromaSubsampling: "4:4:4",
      })
      .toFile(outputPath);

    // Return the relative path to the processed file
    res.json({ imageUrl: `/uploads/${filename}` });
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
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
    const { name, description, price, category, brand, images, stock } = req.body;
    if (!name || !price || !category || !brand || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Name, price, category, brand, and at least one image are required." });
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
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
