require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const reviewsRouter = require("./routes/reviews");
const Product = require("./models/Product");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
  // No need for useNewUrlParser or useUnifiedTopology in modern drivers
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
    console.error("\nCheck your internet connection, firewall, or DNS settings.\nIf you are on a restricted network, try a different network or hotspot.\n");
  }
});
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

// Basic route
app.get("/", (req, res) => {
  res.send("NextGen Electronics Backend API");
});

// Remove old example /api/users route
// app.get("/api/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// Example API route for products using MongoDB
app.get("/api/products-db", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api", usersRouter);
app.use("/api", ordersRouter);
app.use("/api", reviewsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
