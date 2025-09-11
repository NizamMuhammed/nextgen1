const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nextgen", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema (same as in models/User.js)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "staff", "admin"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
  lastViewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  shippingAddresses: [],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createStaffUser() {
  try {
    // Check if staff user already exists
    const existingStaff = await User.findOne({ email: "staff@nextgen.com" });
    if (existingStaff) {
      console.log("Staff user already exists:", existingStaff.email);
      return;
    }

    // Create staff user
    const hashedPassword = await bcrypt.hash("staff123", 10);
    const staffUser = new User({
      name: "Staff User",
      email: "staff@nextgen.com",
      password: hashedPassword,
      role: "staff",
    });

    await staffUser.save();
    console.log("Staff user created successfully:", {
      name: staffUser.name,
      email: staffUser.email,
      role: staffUser.role,
    });

    console.log("\nStaff login credentials:");
    console.log("Email: staff@nextgen.com");
    console.log("Password: staff123");
    console.log("\nYou can now log in with these credentials to test staff functionality.");
  } catch (error) {
    console.error("Error creating staff user:", error);
  } finally {
    mongoose.connection.close();
  }
}

createStaffUser();
