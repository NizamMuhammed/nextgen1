import React, { useState, useEffect } from "react";
import UiCard from "./components/ui/UiCard";
import UiTextField from "./components/ui/UiTextField";
import UiButton from "./components/ui/UiButton";

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

export default function ManageProducts({ token }) {
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
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setForm({ name: "", description: "", price: "", category: "", brand: "", stock: "" });
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
      brand: product.brand || "",
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
    setForm({ name: "", description: "", price: "", category: "", brand: "", stock: "" });
    setImages([]);
    setImageFiles([]);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
        <p className="text-gray-600">Add, edit, and manage your product catalog</p>
      </div>

      <UiCard className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">{editingId ? "Edit Product" : "Add New Product"}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UiTextField label="Product Name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter product name" />
            <UiTextField label="Price (Rs.)" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required placeholder="0.00" />
          </div>

          <UiTextField label="Description" name="description" value={form.description} onChange={handleChange} required multiline minRows={3} placeholder="Enter product description" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select category</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Brand</label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select brand</option>
                {Array.isArray(brands) &&
                  brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
              </select>
            </div>

            <UiTextField label="Stock Quantity" name="stock" type="number" value={form.stock} onChange={handleChange} required placeholder="0" />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Product Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full cursor-pointer" />
              <p className="text-sm text-gray-500 mt-2">Click to select images or drag and drop</p>
            </div>
            {uploadLoading && (
              <div className="flex items-center justify-center mt-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-600 text-sm">Uploading images...</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              {imageFiles.map((file, idx) => (
                <div key={idx} className="relative">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200" />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</div>
                </div>
              ))}
              {images.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative">
                  <img src={`http://localhost:5000${url}`} alt="product" className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200" />
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-500 mr-2">⚠️</div>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-green-500 mr-2">✓</div>
                <span className="text-green-700">{success}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={uploadLoading || (!editingId && images.length === 0)} className="flex-1">
              {uploadLoading ? "Uploading..." : editingId ? "Update Product" : "Add Product"}
            </UiButton>
            {editingId && (
              <UiButton type="button" variant="outlined" color="secondary" onClick={resetForm} className="flex-1 sm:flex-none">
                Cancel
              </UiButton>
            )}
          </div>
        </form>
      </UiCard>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">All Products ({products.length})</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">No products yet</h3>
            <p className="text-gray-600">Add your first product to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {product.images && product.images.length > 0 ? (
                      <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900 mb-1">{product.name}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium text-blue-600">Rs.{product.price}</span> •<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs ml-2">{product.brand}</span> •
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs ml-2">{product.category}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${(product.stock || 0) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>Stock: {product.stock || 0}</span>
                        {product.description && <span className="text-gray-500">{product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <UiButton variant="outlined" color="primary" size="small" onClick={() => handleEdit(product)}>
                      Edit
                    </UiButton>
                    <UiButton variant="outlined" color="error" size="small" onClick={() => handleDelete(product._id)}>
                      Delete
                    </UiButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
