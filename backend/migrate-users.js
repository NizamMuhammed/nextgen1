const mongoose = require("mongoose");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nextgen", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateUsers() {
  try {
    console.log("Starting user migration...");

    // Update all users to have lastViewedProducts field if they don't have it
    const result = await User.updateMany({ lastViewedProducts: { $exists: false } }, { $set: { lastViewedProducts: [] } });

    console.log(`Migration completed. Updated ${result.modifiedCount} users.`);

    // Verify the migration
    const usersWithoutField = await User.countDocuments({ lastViewedProducts: { $exists: false } });
    console.log(`Users without lastViewedProducts field: ${usersWithoutField}`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.connection.close();
  }
}

migrateUsers();

