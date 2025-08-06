require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  // No need for useNewUrlParser or useUnifiedTopology in modern drivers
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
    console.error("\nCheck your internet connection, firewall, or DNS settings.\nIf you are on a restricted network, try a different network or hotspot.\n");
  }
  process.exit(1);
});

db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
  runTests();
});

// Sample products for testing
const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced camera system and A17 Pro chip",
    price: 999.99,
    category: "Smartphones",
    brand: "Apple",
    stock: 50,
    images: ["/uploads/iphone15pro.jpg"],
    tags: ["smartphone", "apple", "iphone", "5g", "camera"],
    sku: "APPLE-IPHONE-15-PRO",
    weight: 187,
    dimensions: { length: 147.6, width: 71.6, height: 7.8 },
  },
  {
    name: "MacBook Pro 16-inch",
    description: "Powerful laptop with M3 Pro chip for professionals",
    price: 2499.99,
    category: "Computers",
    brand: "Apple",
    stock: 25,
    images: ["/uploads/macbook-pro.jpg"],
    tags: ["laptop", "apple", "macbook", "professional", "m3"],
    sku: "APPLE-MBP-16-M3",
    weight: 2200,
    dimensions: { length: 355.7, width: 248.1, height: 16.8 },
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen and advanced AI features",
    price: 1199.99,
    category: "Smartphones",
    brand: "Samsung",
    stock: 40,
    images: ["/uploads/galaxy-s24-ultra.jpg"],
    tags: ["smartphone", "samsung", "android", "5g", "ai"],
    sku: "SAMSUNG-GALAXY-S24-ULTRA",
    weight: 232,
    dimensions: { length: 163.4, width: 79.0, height: 8.6 },
  },
  {
    name: "Dell XPS 13",
    description: "Ultra-thin laptop with InfinityEdge display",
    price: 1299.99,
    category: "Computers",
    brand: "Dell",
    stock: 30,
    images: ["/uploads/dell-xps13.jpg"],
    tags: ["laptop", "dell", "xps", "ultrabook", "windows"],
    sku: "DELL-XPS-13-2024",
    weight: 1200,
    dimensions: { length: 302, width: 199, height: 14.8 },
  },
  {
    name: "Sony WH-1000XM5",
    description: "Premium noise-cancelling headphones with exceptional sound quality",
    price: 399.99,
    category: "Accessories",
    brand: "Sony",
    stock: 60,
    images: ["/uploads/sony-wh1000xm5.jpg"],
    tags: ["headphones", "sony", "noise-cancelling", "wireless", "audio"],
    sku: "SONY-WH1000XM5",
    weight: 250,
    dimensions: { length: 167, width: 185, height: 71 },
  },
  {
    name: "LG OLED C3 65-inch",
    description: "4K OLED TV with perfect blacks and infinite contrast",
    price: 2499.99,
    category: "Home Appliances",
    brand: "LG",
    stock: 15,
    images: ["/uploads/lg-oled-c3.jpg"],
    tags: ["tv", "lg", "oled", "4k", "smart-tv"],
    sku: "LG-OLED-C3-65",
    weight: 25000,
    dimensions: { length: 1449, width: 830, height: 46 },
  },
  {
    name: "Nintendo Switch OLED",
    description: "Handheld gaming console with vibrant OLED screen",
    price: 349.99,
    category: "Gaming",
    brand: "Nintendo",
    stock: 100,
    images: ["/uploads/nintendo-switch-oled.jpg"],
    tags: ["gaming", "nintendo", "switch", "portable", "oled"],
    sku: "NINTENDO-SWITCH-OLED",
    weight: 420,
    dimensions: { length: 242, width: 102, height: 13.9 },
  },
  {
    name: "Apple Watch Series 9",
    description: "Advanced smartwatch with health monitoring and fitness tracking",
    price: 399.99,
    category: "Wearables",
    brand: "Apple",
    stock: 75,
    images: ["/uploads/apple-watch-series9.jpg"],
    tags: ["smartwatch", "apple", "health", "fitness", "wearable"],
    sku: "APPLE-WATCH-SERIES-9",
    weight: 31.9,
    dimensions: { length: 41, width: 35, height: 10.7 },
  },
  {
    name: "Razer Blade 15",
    description: "Gaming laptop with RTX 4070 and high refresh rate display",
    price: 1999.99,
    category: "Computers",
    brand: "Razer",
    stock: 20,
    images: ["/uploads/razer-blade15.jpg"],
    tags: ["gaming", "laptop", "razer", "rtx", "gaming-laptop"],
    sku: "RAZER-BLADE-15-2024",
    weight: 2100,
    dimensions: { length: 355, width: 235, height: 16.8 },
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    description: "Large tablet with S Pen and powerful performance",
    price: 1099.99,
    category: "Tablets",
    brand: "Samsung",
    stock: 35,
    images: ["/uploads/galaxy-tab-s9-ultra.jpg"],
    tags: ["tablet", "samsung", "android", "s-pen", "large-screen"],
    sku: "SAMSUNG-TAB-S9-ULTRA",
    weight: 732,
    dimensions: { length: 326.4, width: 208.6, height: 5.5 },
  },
];

async function seedDatabase() {
  try {
    console.log("Clearing existing products...");
    await Product.deleteMany({});

    console.log("Adding sample products...");
    await Product.insertMany(sampleProducts);

    console.log("Database seeded successfully!");
    console.log(`Added ${sampleProducts.length} products`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

async function testSearchFunctionality() {
  try {
    console.log("\n=== Testing Search Functionality ===\n");

    // Test 1: Basic search
    console.log("1. Testing basic search for 'iPhone'...");
    const searchResults = await Product.find({
      $or: [{ name: { $regex: "iPhone", $options: "i" } }, { description: { $regex: "iPhone", $options: "i" } }, { brand: { $regex: "iPhone", $options: "i" } }],
    });
    console.log(`Found ${searchResults.length} products containing 'iPhone'`);

    // Test 2: Category filter
    console.log("\n2. Testing category filter for 'Smartphones'...");
    const categoryResults = await Product.find({ category: { $regex: "Smartphones", $options: "i" } });
    console.log(`Found ${categoryResults.length} smartphones`);

    // Test 3: Price range filter
    console.log("\n3. Testing price range filter ($500-$1500)...");
    const priceResults = await Product.find({
      price: { $gte: 500, $lte: 1500 },
    });
    console.log(`Found ${priceResults.length} products in price range $500-$1500`);

    // Test 4: Brand filter
    console.log("\n4. Testing brand filter for 'Apple'...");
    const brandResults = await Product.find({ brand: { $regex: "Apple", $options: "i" } });
    console.log(`Found ${brandResults.length} Apple products`);

    // Test 5: Stock filter
    console.log("\n5. Testing in-stock filter...");
    const stockResults = await Product.find({ stock: { $gt: 0 } });
    console.log(`Found ${stockResults.length} products in stock`);

    // Test 6: Complex search
    console.log("\n6. Testing complex search (Apple + Smartphones + Price > $800)...");
    const complexResults = await Product.find({
      brand: { $regex: "Apple", $options: "i" },
      category: { $regex: "Smartphones", $options: "i" },
      price: { $gte: 800 },
    });
    console.log(`Found ${complexResults.length} Apple smartphones over $800`);

    // Test 7: Sorting
    console.log("\n7. Testing sorting by price (descending)...");
    const sortedResults = await Product.find({}).sort({ price: -1 }).limit(5);
    console.log("Top 5 most expensive products:");
    sortedResults.forEach((product) => {
      console.log(`  - ${product.name}: $${product.price}`);
    });

    // Test 8: Pagination
    console.log("\n8. Testing pagination (page 1, limit 3)...");
    const paginatedResults = await Product.find({}).sort({ createdAt: -1 }).skip(0).limit(3);
    console.log(`Retrieved ${paginatedResults.length} products for page 1`);

    // Test 9: Get categories
    console.log("\n9. Testing categories endpoint...");
    const categories = await Product.distinct("category");
    console.log("Available categories:", categories);

    // Test 10: Get brands
    console.log("\n10. Testing brands endpoint...");
    const brands = await Product.distinct("brand");
    console.log("Available brands:", brands);

    // Test 11: Search suggestions
    console.log("\n11. Testing search suggestions for 'apple'...");
    const suggestions = await Product.find({
      $or: [{ name: { $regex: "apple", $options: "i" } }, { brand: { $regex: "apple", $options: "i" } }, { category: { $regex: "apple", $options: "i" } }],
    })
      .select("name brand category")
      .limit(10);

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

    console.log("Search suggestions:", uniqueSuggestions.slice(0, 5));

    // Test 12: Statistics
    console.log("\n12. Testing statistics...");
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: "$price" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
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

    if (stats.length > 0) {
      const overall = stats[0];
      console.log("Overall statistics:");
      console.log(`  - Total products: ${overall.totalProducts}`);
      console.log(`  - Total value: $${overall.totalValue.toFixed(2)}`);
      console.log(`  - Average price: $${overall.avgPrice.toFixed(2)}`);
      console.log(`  - Price range: $${overall.minPrice} - $${overall.maxPrice}`);
      console.log(`  - Total stock: ${overall.totalStock}`);
      console.log(`  - In stock: ${overall.inStockProducts}`);
      console.log(`  - Out of stock: ${overall.outOfStockProducts}`);
    }

    console.log("\n=== All tests completed successfully! ===");
  } catch (error) {
    console.error("Error testing search functionality:", error);
  }
}

async function runTests() {
  try {
    await seedDatabase();
    await testSearchFunctionality();
  } catch (error) {
    console.error("Error running tests:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Only run tests if this file is executed directly
if (require.main === module) {
  // Tests will be run after database connection is established
  console.log("Starting search functionality tests...");
}

module.exports = { seedDatabase, testSearchFunctionality };
