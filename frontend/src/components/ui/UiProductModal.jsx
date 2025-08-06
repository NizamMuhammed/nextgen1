import React, { useState } from "react";
import UiButton from "./UiButton";
import UiDialog from "./UiDialog";

export default function UiProductModal({ product, open, onClose, onAddToCart, isLoggedIn, promptLogin }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      promptLogin();
      return;
    }
    onAddToCart({ ...product, quantity });
    onClose();
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 999)) {
      setQuantity(newQuantity);
    }
  };

  return (
    <UiDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img src={`http://localhost:5000${product.images[selectedImage]}`} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-blue-500" : "border-gray-200"}`}
                  >
                    <img src={`http://localhost:5000${image}`} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{product.brand}</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{product.category}</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">${product.price}</div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description || "No description available."}</p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Brand:</span>
                  <span className="ml-2 font-medium">{product.brand}</span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span className={`ml-2 font-medium ${(product.stock || 0) > 0 ? "text-green-600" : "text-red-600"}`}>{product.stock || 0} units</span>
                </div>
                <div>
                  <span className="text-gray-500">SKU:</span>
                  <span className="ml-2 font-medium">{product._id?.slice(-8)}</span>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 py-1 text-gray-600 hover:text-gray-800" disabled={quantity <= 1}>
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.stock || 999}
                    className="w-16 text-center border-none focus:outline-none"
                  />
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="px-3 py-1 text-gray-600 hover:text-gray-800" disabled={quantity >= (product.stock || 999)}>
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <UiButton onClick={handleAddToCart} variant="contained" color="primary" fullWidth disabled={(product.stock || 0) === 0}>
                  {isLoggedIn ? "Add to Cart" : "Login to Add to Cart"}
                </UiButton>
                <UiButton onClick={onClose} variant="outlined" color="secondary">
                  Close
                </UiButton>
              </div>

              {/* Stock Status */}
              {(product.stock || 0) === 0 && <div className="text-red-600 text-sm font-medium">Out of Stock</div>}
            </div>
          </div>
        </div>
      </div>
    </UiDialog>
  );
}
