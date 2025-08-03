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
  "Smart Thermostat",
  "Smart Camera",
  "Smart Doorbell",
  "Smart Security",
];

export default function AddProduct() {
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });
  const [images, setImages] = useState([]); // URLs after upload
  const [imageFiles, setImageFiles] = useState([]); // Local files for preview
  const [categories, setCategories] = useState(categoriesList); // Default to local categories
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImages([]);
    setError(null);
    // Upload each image
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("http://localhost:5000/api/products/upload-image", {
          method: "POST",
          headers: { Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined },
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined,
        },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");
      setSuccess("Product added successfully!");
      setForm({ name: "", description: "", price: "", category: "" });
      setImages([]);
      setImageFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <UiCard>
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-2">Add Product</h2>
          <UiTextField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <UiTextField label="Description" name="description" value={form.description} onChange={handleChange} required multiline minRows={2} />
          <UiTextField label="Price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
          <div>
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
          </div>
          <div>
            <label className="block font-medium mb-1">Product Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full" />
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, idx) => (
                <img key={idx} src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={loading || images.length === 0}>
            {loading ? "Adding..." : "Add Product"}
          </UiButton>
        </form>
      </UiCard>
    </div>
  );
}
