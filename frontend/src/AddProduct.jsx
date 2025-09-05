import React, { useState, useEffect } from "react";
import UiCard from "./components/ui/UiCard";
import UiTextField from "./components/ui/UiTextField";
import UiButton from "./components/ui/UiButton";
import UIValidation from "./components/ui/UIValidation";
import imageCompression from "browser-image-compression";

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

export default function ManageProducts({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });
  const [images, setImages] = useState([]); // URLs after upload
  const [imageFiles, setImageFiles] = useState([]); // Local files for preview
  const [categories, setCategories] = useState(categoriesList);
  const [editingId, setEditingId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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
      setProducts(data);
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

    const compressionOptions = {
      maxSizeMB: 1, // Max file size in MB
      maxWidthOrHeight: 1920, // Max width/height
      useWebWorker: true,
      fileType: "image/jpeg", // Convert all images to JPEG
      initialQuality: 0.8, // Initial compression quality
    };

    try {
      const uploaded = [];
      for (const file of files) {
        // Skip compression for small images (less than 1MB)
        const shouldCompress = file.size > 1024 * 1024;

        let compressedFile = file;
        if (shouldCompress) {
          try {
            compressedFile = await imageCompression(file, compressionOptions);
          } catch (compressionError) {
            console.warn("Image compression failed, using original file:", compressionError);
          }
        }

        const formData = new FormData();
        formData.append("image", compressedFile);

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

      setSuccess(editingId ? "Product updated!" : "Product added!");
      setForm({ name: "", description: "", price: "", category: "", stock: "" });
      setImages([]);
      setImageFiles([]);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      stock: product.stock?.toString() || "0",
    });
    setImages(product.images || []);
    setImageFiles([]);
    setEditingId(product._id);
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
    setForm({ name: "", description: "", price: "", category: "", stock: "" });
    setImages([]);
    setImageFiles([]);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <UiCard>
        <h2 className="text-2xl font-bold mb-4 text-center">{editingId ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <UiTextField label="Name" name="name" value={form.name} onChange={handleChange} required />
              <UIValidation message={validationErrors.name} position="top" type="error" visible={!!validationErrors.name} />
            </div>
            <div className="relative">
              <UiTextField label="Price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
              <UIValidation message={validationErrors.price} position="top" type="error" visible={!!validationErrors.price} />
            </div>
          </div>

          <div className="relative">
            <UiTextField label="Description" name="description" value={form.description} onChange={handleChange} required multiline minRows={2} />
            <UIValidation message={validationErrors.description} position="top" type="error" visible={!!validationErrors.description} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block font-medium mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} required className="w-full rounded-lg border px-3 py-2">
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
              <UiTextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} required />
              <UIValidation message={validationErrors.stock} position="top" type="error" visible={!!validationErrors.stock} />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Product Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full" />
            {uploadLoading && <div className="text-blue-600 text-sm mt-1">Uploading images...</div>}
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, idx) => (
                <img key={idx} src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded" />
              ))}
              {images.map((url, idx) => (
                <img key={`existing-${idx}`} src={`http://localhost:5000${url}`} alt="product" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}

          <div className="flex gap-3">
            <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={uploadLoading || (!editingId && images.length === 0)}>
              {uploadLoading ? "Uploading..." : editingId ? "Update Product" : "Add Product"}
            </UiButton>
            {editingId && (
              <UiButton type="button" variant="outlined" color="secondary" onClick={resetForm}>
                Cancel
              </UiButton>
            )}
          </div>
        </form>

        <div className="mt-8">
          <h3 className="font-semibold mb-4 text-lg">All Products</h3>
          {loading ? (
            <div className="text-center py-4">Loading products...</div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {product.images && product.images.length > 0 && <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-12 h-12 object-cover rounded" />}
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          Rs.{product.price} • {product.category} • Stock: {product.stock || 0}
                        </div>
                        {product.description && (
                          <div className="text-xs text-gray-500 mt-1">{product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <UiButton variant="outlined" color="primary" size="small" onClick={() => handleEdit(product)}>
                      Edit
                    </UiButton>
                    <UiButton variant="outlined" color="error" size="small" onClick={() => handleDelete(product._id)}>
                      Delete
                    </UiButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </UiCard>
    </div>
  );
}
