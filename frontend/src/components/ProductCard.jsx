import React from "react";
import { useNavigate } from "react-router-dom";
import UiCard from "./ui/UiCard";
import UiButton from "./ui/UiButton";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { PiImageBrokenDuotone } from "react-icons/pi";

const ProductCard = ({
  product,
  onAddToCart,
  isLoggedIn,
  promptLogin,
  onWishlistToggle,
  isInWishlist,
  onQuickView,
  showWishlist = true,
  showQuickView = true,
  showDescription = false,
  className = "",
  onProductClick,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product._id}`);
    }
  };

  const handleWishlistToggle = async (product, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      promptLogin();
      return;
    }

    if (onWishlistToggle) {
      try {
        await onWishlistToggle(product, e);
      } catch (error) {
        console.error("Wishlist toggle error:", error);
      }
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      promptLogin();
    } else {
      onAddToCart(product);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <UiCard className={`flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="flex-1">
        {/* Product Image */}
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
          <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: product.images && product.images.length > 0 ? "none" : "flex" }}>
            <div className="text-center">
              <PiImageBrokenDuotone className="w-16 h-16 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>

          {/* Wishlist Heart Button */}
          {showWishlist && (
            <button
              onClick={(e) => handleWishlistToggle(product, e)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-lg"
              title={isInWishlist && isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isInWishlist && isInWishlist(product._id) ? <MdFavorite className="w-5 h-5 text-red-500" /> : <MdFavoriteBorder className="w-5 h-5 text-gray-600" />}
            </button>
          )}

          {/* Quick View Overlay Button */}
          {showQuickView && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <UiButton variant="contained" color="secondary" size="small" onClick={handleQuickView} className="w-full bg-white/90 text-gray-900 hover:bg-white border-0 font-medium">
                Quick View
              </UiButton>
            </div>
          )}
        </div>

        <div className="p-4">
          <h2
            className="font-display font-semibold text-lg mb-3 cursor-pointer hover:text-blue-200 transition-colors text-glass tracking-tight leading-tight"
            onClick={() => handleProductClick(product)}
          >
            {product.name}
          </h2>

          <div className="text-sm mb-4 flex flex-nowrap gap-2 items-center">
            <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-300/30">{product.brand}</span>
            <span className="text-nowrap bg-purple-400/30 text-purple-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-purple-300/30">{product.category}</span>
          </div>

          {showDescription && product.description && <p className="mb-4 text-glass-muted text-sm line-clamp-2 leading-relaxed tracking-tight">{product.description}</p>}

          <div className="flex items-center justify-between mb-4 whitespace-nowrap">
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
        <UiButton variant="contained" color="primary" size="small" onClick={handleAddToCart} disabled={(product.stock || 0) === 0} className="w-full">
          {(product.stock || 0) === 0 ? "Out of Stock" : "Add to Cart"}
        </UiButton>
      </div>
    </UiCard>
  );
};

export default ProductCard;
