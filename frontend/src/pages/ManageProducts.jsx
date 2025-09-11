import React, { useState, useEffect } from "react";
import UiCard from "../components/ui/UiCard";
import UiTextField from "../components/ui/UiTextField";
import UiButton from "../components/ui/UiButton";
import UIValidation from "../components/ui/UIValidation";
import { GrAddCircle } from "react-icons/gr";

// Added categories array for use in the form
const categoriesList = [
  "Mobile Phones",
  "Pc",
  "Laptop",
  "Tablet",
  "Smart Watch",
  "Smart Home",
  "Smart TV",
  "Smart Speaker",
  "Smart Light",
  "Smart Lock",
  "Smart Thermostat",
  "Smart Camera",
  "Smart Doorbell",
  "Smart Security",
];

// Added brands array for use in the form
const brandsList = [
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

export default function ManageProducts({ token, user: currentUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", brand: "", stock: "" });
  const [images, setImages] = useState([]); // URLs after upload
  const [imageFiles, setImageFiles] = useState([]); // Local files for preview
  const [categories, setCategories] = useState(categoriesList);
  const [brands, setBrands] = useState(brandsList);
  const [editingId, setEditingId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch products");
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  useEffect(() => {
    // Try to fetch categories from backend, fallback to local if fails
    fetch("http://localhost:5000/api/products/categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(categoriesList);
        }
      })
      .catch((error) => {
        setCategories(categoriesList);
      });

    // Try to fetch brands from backend, fallback to local if fails
    fetch("http://localhost:5000/api/products/brands")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
        } else {
          setBrands(brandsList);
        }
      })
      .catch((error) => {
        setBrands(brandsList);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImages([]);
    setError(null);
    setUploadLoading(true);

    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("http://localhost:5000/api/products/upload-image", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Image upload failed");
        uploaded.push(data.imageUrl);
      }
      setImages(uploaded);
    } catch (err) {
      setError(err.message);
      setImages([]);
    } finally {
      setUploadLoading(false);
    }
  };

  const removeImageFile = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Please enter a product name.";
    } else if (form.name.trim().length < 2) {
      errors.name = "Product name must be at least 2 characters long.";
    }

    if (!form.description.trim()) {
      errors.description = "Please enter a product description.";
    } else if (form.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters long.";
    }

    if (!form.price || form.price <= 0) {
      errors.price = "Please enter a valid price greater than 0.";
    }

    if (!form.category) {
      errors.category = "Please select a product category.";
    }

    if (!form.brand) {
      errors.brand = "Please select a product brand.";
    }

    if (!form.stock || form.stock < 0) {
      errors.stock = "Please enter a valid stock quantity (0 or greater).";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      let res, data;
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        images,
      };

      if (editingId) {
        res = await fetch(`http://localhost:5000/api/products/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      } else {
        res = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      }

      data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      setSuccess(editingId ? "Product updated successfully!" : "Product added successfully!");
      setForm({ name: "", description: "", price: "", category: "", brand: "", stock: "" });
      setImages([]);
      setImageFiles([]);
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      brand: product.brand || "",
      stock: product.stock?.toString() || "0",
    });
    setImages(product.images || []);
    setImageFiles([]);
    setEditingId(product._id);
    setShowForm(true);
    setSuccess(null);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");
      setSuccess("Product deleted!");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", category: "", brand: "", stock: "" });
    setImages([]);
    setImageFiles([]);
    setEditingId(null);
    setShowForm(false);
    setError(null);
    setSuccess(null);
  };

  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesBrand = brandFilter === "all" || product.brand === brandFilter;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="glass-subtle rounded-xl p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-white/20 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/20 rounded w-1/2"></div>
          <div className="h-3 bg-white/20 rounded w-2/3"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-white/20 rounded w-16"></div>
          <div className="h-8 bg-white/20 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold heading-glass-xl mb-2">Product Management</h1>
          <p className="text-glass-muted text-lg">Add, edit, and manage your product catalog</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="glass-strong rounded-2xl p-4 mb-6 border border-green-400/30">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-glass">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-strong rounded-2xl p-4 mb-6 border border-red-400/30">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-glass">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Form Section */}
          <div className="lg:col-span-1">
            <UiCard variant="strong" className="h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-glass">{editingId ? "Edit Product" : "Add New Product"}</h2>
                {!showForm && !editingId && (
                  <UiButton variant="contained" color="primary" size="small" onClick={() => setShowForm(true)}>
                    <GrAddCircle size={40} />
                  </UiButton>
                )}
              </div>

              {(showForm || editingId) && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <UiTextField label="Product Name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter product name" />
                      <UIValidation message={validationErrors.name} position="top" type="error" visible={!!validationErrors.name} />
                    </div>

                    <div className="relative">
                      <UiTextField label="Price (Rs.)" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required placeholder="0.00" />
                      <UIValidation message={validationErrors.price} position="top" type="error" visible={!!validationErrors.price} />
                    </div>

                    <div className="relative">
                      <UiTextField label="Description" name="description" value={form.description} onChange={handleChange} required multiline minRows={3} placeholder="Enter product description" />
                      <UIValidation message={validationErrors.description} position="top" type="error" visible={!!validationErrors.description} />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-glass-muted mb-2">
                          Category <span className="text-red-300">*</span>
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          required
                          className="w-full input-glass rounded-xl px-4 py-3 text-glass focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                        >
                          <option value="">Select category</option>
                          {Array.isArray(categories) &&
                            categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                        <UIValidation message={validationErrors.category} position="top" type="error" visible={!!validationErrors.category} />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-glass-muted mb-2">
                          Brand <span className="text-red-300">*</span>
                        </label>
                        <select
                          name="brand"
                          value={form.brand}
                          onChange={handleChange}
                          required
                          className="w-full input-glass rounded-xl px-4 py-3 text-glass focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                        >
                          <option value="">Select brand</option>
                          {Array.isArray(brands) &&
                            brands.map((brand) => (
                              <option key={brand} value={brand}>
                                {brand}
                              </option>
                            ))}
                        </select>
                        <UIValidation message={validationErrors.brand} position="top" type="error" visible={!!validationErrors.brand} />
                      </div>

                      <div className="relative">
                        <UiTextField label="Stock Quantity" name="stock" type="number" value={form.stock} onChange={handleChange} required placeholder="0" />
                        <UIValidation message={validationErrors.stock} position="top" type="error" visible={!!validationErrors.stock} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-glass-muted mb-2">Product Images</label>
                      <div className="glass-subtle border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-blue-400/50 transition-all duration-300">
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full cursor-pointer opacity-0 absolute inset-0" />
                        <div className="flex flex-col items-center">
                          <svg className="w-8 h-8 text-white/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-glass-muted">Click to select images or drag and drop</p>
                        </div>
                      </div>
                      {uploadLoading && (
                        <div className="flex items-center justify-center mt-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-2"></div>
                          <span className="text-glass-muted text-sm">Uploading images...</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 mt-4">
                        {imageFiles.map((file, idx) => (
                          <div key={idx} className="relative group">
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 object-cover rounded-lg border-2 border-green-400/50" />
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</div>
                            <button
                              type="button"
                              onClick={() => removeImageFile(idx)}
                              className="absolute -top-1 -left-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {images.map((url, idx) => (
                          <div key={`existing-${idx}`} className="relative group">
                            <img src={`http://localhost:5000${url}`} alt="product" className="w-20 h-20 object-cover rounded-lg border-2 border-blue-400/50" />
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</div>
                            <button
                              type="button"
                              onClick={() => removeExistingImage(idx)}
                              className="absolute -top-1 -left-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={uploadLoading || isSubmitting || (!editingId && images.length === 0)}>
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingId ? "Updating..." : "Adding..."}
                        </div>
                      ) : uploadLoading ? (
                        "Uploading..."
                      ) : editingId ? (
                        "Update Product"
                      ) : (
                        "Add Product"
                      )}
                    </UiButton>
                    <UiButton type="button" variant="outlined" color="secondary" onClick={resetForm} disabled={isSubmitting}>
                      Cancel
                    </UiButton>
                  </div>
                </form>
              )}
            </UiCard>
          </div>

          {/* Products List Section */}
          <div className="lg:col-span-2">
            <UiCard variant="strong">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-glass rounded-xl pl-10 pr-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="input-glass rounded-xl px-4 py-2 text-glass focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                  >
                    <option value="all">All Categories</option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>

                  <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="input-glass rounded-xl px-4 py-2 text-glass focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                  >
                    <option value="all">All Brands</option>
                    {Array.isArray(brands) &&
                      brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <ProductSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="glass-subtle rounded-2xl p-8 mx-auto max-w-sm">
                      <svg className="mx-auto h-12 w-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <h3 className="mt-4 text-sm font-medium text-glass">No products found</h3>
                      <p className="mt-2 text-sm text-glass-muted">
                        {searchTerm || categoryFilter !== "all" || brandFilter !== "all" ? "Try adjusting your search or filter criteria." : "Get started by adding a new product."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <div key={product._id} className="glass-subtle rounded-xl p-4 hover:glass transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                              ) : (
                                <div className="w-16 h-16 glass-subtle rounded-lg flex items-center justify-center">
                                  <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="text-sm font-medium text-glass truncate">{product.name}</p>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    (product.stock || 0) > 0 ? "bg-green-500/20 text-green-300 border border-green-400/30" : "bg-red-500/20 text-red-300 border border-red-400/30"
                                  }`}
                                >
                                  Stock: {product.stock || 0}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-semibold text-blue-300">Rs.{product.price}</span>
                                <span className="text-white/50">•</span>
                                <span className="text-sm text-glass-muted">{product.brand}</span>
                                <span className="text-white/50">•</span>
                                <span className="text-sm text-glass-muted">{product.category}</span>
                              </div>
                              {product.description && (
                                <p className="text-sm text-white/60 truncate">{product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <UiButton variant="outlined" color="primary" size="small" onClick={() => handleEdit(product)} className="min-w-[80px]">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </UiButton>
                            {currentUser?.role === "admin" && (
                              <UiButton variant="outlined" color="error" size="small" onClick={() => handleDelete(product._id)} className="min-w-[80px]">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </UiButton>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Results Summary */}
              {!loading && filteredProducts.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="glass-subtle rounded-xl p-3 text-center">
                    <p className="text-sm text-glass-muted">
                      Showing {filteredProducts.length} of {products.length} products
                      {(searchTerm || categoryFilter !== "all" || brandFilter !== "all") && " (filtered)"}
                    </p>
                  </div>
                </div>
              )}
            </UiCard>
          </div>
        </div>
      </div>
    </div>
  );
}
