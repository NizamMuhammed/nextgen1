import React, { useState, useEffect } from "react";
import UiCard from "./UiCard";
import UiButton from "./UiButton";
import UiProductModal from "./UiProductModal";

export default function UiWishlist({ isLoggedIn, promptLogin }) {
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const addToWishlist = (product) => {
    if (!isLoggedIn) {
      promptLogin();
      return;
    }

    const updatedWishlist = [...wishlist];
    const existingIndex = updatedWishlist.findIndex((item) => item._id === product._id);

    if (existingIndex === -1) {
      updatedWishlist.push(product);
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    }
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const moveToCart = (product) => {
    // This would typically call the add to cart function
    // For now, we'll just remove from wishlist
    removeFromWishlist(product._id);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeProductModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
        <p className="text-gray-600 mb-6">Please log in to view your wishlist.</p>
        <UiButton onClick={promptLogin} variant="contained" color="primary">
          Login
        </UiButton>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <UiCard className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Start adding products to your wishlist to save them for later.</p>
        </UiCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <UiCard key={product._id} className="flex flex-col h-full">
              <div className="flex-1">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => openProductModal(product)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg cursor-pointer hover:text-blue-600" onClick={() => openProductModal(product)}>
                    {product.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {product.brand} • {product.category}
                  </div>
                  <div className="text-xl font-bold text-blue-600">${product.price}</div>
                  <div className="text-sm text-gray-600">Stock: {product.stock || 0} units</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <UiButton onClick={() => moveToCart(product)} variant="contained" color="primary" size="small" fullWidth disabled={(product.stock || 0) === 0}>
                  Move to Cart
                </UiButton>
                <UiButton onClick={() => removeFromWishlist(product._id)} variant="outlined" color="error" size="small">
                  Remove
                </UiButton>
              </div>
            </UiCard>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && <UiProductModal product={selectedProduct} open={showModal} onClose={closeProductModal} onAddToCart={moveToCart} isLoggedIn={isLoggedIn} promptLogin={promptLogin} />}
    </div>
  );
}
