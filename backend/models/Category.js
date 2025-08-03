const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    image: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
