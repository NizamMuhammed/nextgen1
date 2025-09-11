import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UiCard from "./UiCard";
import UiButton from "./UiButton";
import UiProductModal from "./UiProductModal";
import UiToast from "./UiToast";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { PiImageBrokenDuotone } from "react-icons/pi";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function UiWishlist({ isLoggedIn, promptLogin, token, onAddToCart }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!isLoggedIn || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users/me/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      } else {
        console.error("Failed to fetch wishlist");
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isLoggedIn, token]);

  const addToWishlist = async (product) => {
    if (!isLoggedIn) {
      promptLogin();
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/me/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (response.ok) {
        setToast({ show: true, message: "Product added to wishlist!", type: "success" });
        fetchWishlist(); // Refresh wishlist
      } else {
        const data = await response.json();
        setToast({ show: true, message: data.error || "Failed to add to wishlist", type: "error" });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setToast({ show: true, message: "Failed to add to wishlist", type: "error" });
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/me/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setToast({ show: true, message: "Product removed from wishlist", type: "success" });
        fetchWishlist(); // Refresh wishlist
      } else {
        const data = await response.json();
        setToast({ show: true, message: data.error || "Failed to remove from wishlist", type: "error" });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setToast({ show: true, message: "Failed to remove from wishlist", type: "error" });
    }
  };

  const moveToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
      setToast({ show: true, message: "Product moved to cart!", type: "success" });
    }
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

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
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

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px" sx={{ color: "primary.main" }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
          Loading wishlist...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 glass-subtle rounded-lg flex items-center justify-center">
          <MdFavorite className="w-5 h-5 text-red-500" />
        </div>
        <h1 className="heading-glass text-3xl font-semibold tracking-tight">My Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <UiCard className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <MdFavoriteBorder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          </div>
          <h3 className="heading-glass text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-glass-muted mb-6">Start adding products to your wishlist to save them for later.</p>
        </UiCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <UiCard key={product._id} className="flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex-1">
                {/* Product Image (go to details page) */}
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer group relative" onClick={() => handleProductClick(product)}>
                  {product.images && product.images.length > 0 && product.images[0] ? (
                    <img
                      src={product.images[0].startsWith("http") ? product.images[0] : `http://localhost:5000${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      onLoad={(e) => {
                        e.target.nextSibling.style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: product.images && product.images.length > 0 ? "flex" : "flex" }}>
                    <div className="text-center">
                      <PiImageBrokenDuotone className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No Image</p>
                    </div>
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product._id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-lg"
                    title="Remove from wishlist"
                  >
                    <MdFavorite className="w-5 h-5 text-red-500" />
                  </button>

                  {/* Quick View Overlay Button */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <UiButton
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductModal(product);
                      }}
                      className="w-full bg-white/90 text-gray-900 hover:bg-white border-0 font-medium"
                    >
                      Quick View
                    </UiButton>
                  </div>
                </div>

                <div className="p-4">
                  <h2
                    className="font-display font-semibold text-lg mb-3 cursor-pointer hover:text-blue-200 transition-colors text-glass tracking-tight leading-tight"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.name}
                  </h2>
                  <div className="text-sm mb-4 flex flex-wrap gap-2">
                    <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-300/30">{product.brand}</span>
                    <span className="bg-purple-400/30 text-purple-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-purple-300/30">{product.category}</span>
                  </div>
                  <p className="mb-4 text-glass-muted text-sm line-clamp-2 leading-relaxed tracking-tight">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-bold text-xl text-glass tracking-tight">Rs.{product.price}</span>
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm border ${
                        (product.stock || 0) > 0 ? "bg-green-400/30 text-green-100 border-green-300/30" : "bg-red-400/30 text-red-100 border-red-300/30"
                      }`}
                    >
                      {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <UiButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToCart(product);
                  }}
                  disabled={(product.stock || 0) === 0}
                  className="w-full"
                >
                  {(product.stock || 0) === 0 ? "Out of Stock" : "Move to Cart"}
                </UiButton>
              </div>
            </UiCard>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && <UiProductModal product={selectedProduct} open={showModal} onClose={closeProductModal} onAddToCart={moveToCart} isLoggedIn={isLoggedIn} promptLogin={promptLogin} />}

      {/* Toast Notification */}
      <UiToast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: "success" })} />
    </div>
  );
}
