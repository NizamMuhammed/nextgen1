import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";
import UiToast from "./components/ui/UiToast";
import { useWishlist } from "./hooks/useWishlist";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import ReviewSubmission from "./components/ReviewSubmission";
import ReviewDisplay from "./components/ReviewDisplay";

export default function ProductDetails({ onAddToCart, isLoggedIn, promptLogin, token, refreshTrigger }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);
  const { productId } = useParams();
  const navigate = useNavigate();

  // Wishlist functionality
  const { toggleWishlist, isInWishlist } = useWishlist(isLoggedIn, token);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load product");
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  // Refresh product when refreshTrigger changes (e.g., after order completion)
  useEffect(() => {
    if (refreshTrigger > 0 && productId) {
      console.log("Refreshing product details due to refresh trigger");
      fetchProduct();
    }
  }, [refreshTrigger, productId]);

  // Update last viewed on load (persist for logged-in users and guests)
  useEffect(() => {
    const updateLastViewed = async () => {
      try {
        if (!productId) return;

        console.log("Updating last viewed product:", productId);

        // For guests, update local storage
        try {
          const existingIds = JSON.parse(localStorage.getItem("lastViewedProductIds") || "[]");
          console.log("Existing local IDs:", existingIds);
          // Remove if already exists to avoid duplicates
          const filteredIds = existingIds.filter((id) => id !== productId);
          // Add to beginning (most recent first)
          const updatedIds = [productId, ...filteredIds].slice(0, 4); // Keep only last 4
          localStorage.setItem("lastViewedProductIds", JSON.stringify(updatedIds));
          console.log("Updated local IDs:", updatedIds);
        } catch (err) {
          console.error("Error updating local storage:", err);
        }

        // If logged in, also update on server
        if (token) {
          console.log("Updating server with product ID:", productId);
          const res = await fetch("http://localhost:5000/api/users/me/last-viewed", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId }),
          });
          const data = await res.json();
          console.log("Server update response:", data);
        }
      } catch (err) {
        console.error("Error updating last viewed product:", err);
      }
    };
    updateLastViewed();
  }, [token, productId]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 999)) {
      setQuantity(newQuantity);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      promptLogin();
      return;
    }

    try {
      const result = await toggleWishlist(product);
      setToast({ show: true, message: result.message, type: result.success ? "success" : "error" });
    } catch (error) {
      setToast({ show: true, message: "Please log in to use wishlist", type: "error" });
    }
  };

  const handleReviewSubmitted = () => {
    // Trigger refresh of reviews and product data
    setReviewsRefreshTrigger((prev) => prev + 1);
    fetchProduct(); // Refresh product to update rating averages
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-glass-muted">Loading product...</p>
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="text-center glass p-8 rounded-xl max-w-md mx-auto">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="heading-glass text-2xl font-bold mb-3">Product not found</h2>
        <p className="text-glass-muted mb-4">{error || "We couldn't find the product you're looking for."}</p>
        <UiButton variant="outlined" color="secondary" onClick={handleBack}>
          Go Back
        </UiButton>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading-glass text-3xl font-bold tracking-tight">{product.name}</h1>
        <UiButton variant="outlined" color="secondary" onClick={handleBack}>
          ← Back
        </UiButton>
      </div>

      <UiCard variant="strong">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage].startsWith("http") ? product.images[selectedImage] : `http://localhost:5000${product.images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
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
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                  <p className="text-xs text-gray-500">No Image Available</p>
                </div>
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-blue-500" : "border-gray-200"}`}
                  >
                    <img
                      src={image.startsWith("http") ? image : `http://localhost:5000${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      onLoad={(e) => {
                        e.target.nextSibling.style.display = "none";
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs" style={{ display: "flex" }}>
                      Error
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full border border-blue-300/30">{product.brand}</span>
                <span className="bg-purple-400/30 text-purple-100 px-3 py-1 rounded-full border border-purple-300/30">{product.category}</span>
              </div>
              <div className="heading-glass text-3xl font-bold">Rs.{product.price}</div>
              {product.ratings && product.ratings.count > 0 && (
                <div className="text-sm text-glass-muted">
                  Rating: {product.ratings.average} / 5 ({product.ratings.count})
                </div>
              )}
            </div>

            <div>
              <h3 className="text-glass font-semibold mb-2">Description</h3>
              <p className="text-glass-muted leading-relaxed">{product.description || "No description available."}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-glass-muted">Stock:</span>
                <span className={`ml-2 font-medium ${(product.stock || 0) > 0 ? "text-green-200" : "text-red-200"}`}>{product.stock || 0} units</span>
              </div>
              {product.sku && (
                <div>
                  <span className="text-glass-muted">SKU:</span>
                  <span className="ml-2 font-medium text-glass">{product.sku}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-glass">Quantity:</label>
                <div className="flex items-center border border-white/20 rounded-lg glass-subtle">
                  <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 py-1 text-glass-muted hover:text-glass" disabled={quantity <= 1}>
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.stock || 999}
                    className="w-16 text-center border-none focus:outline-none glass bg-transparent text-glass"
                  />
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="px-3 py-1 text-glass-muted hover:text-glass" disabled={quantity >= (product.stock || 999)}>
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <UiButton
                  onClick={() => {
                    if (!isLoggedIn) return promptLogin();
                    onAddToCart && onAddToCart({ ...product, quantity });
                  }}
                  variant="contained"
                  color="primary"
                  disabled={(product.stock || 0) === 0}
                  className="flex-1"
                >
                  {(product.stock || 0) === 0 ? "Out of Stock" : "Add to Cart"}
                </UiButton>

                <UiButton onClick={handleWishlistToggle} variant="outlined" color="secondary" className="px-4" title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}>
                  {isInWishlist(product._id) ? <MdFavorite className="w-5 h-5 text-red-500" /> : <MdFavoriteBorder className="w-5 h-5" />}
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </UiCard>

      {/* Reviews Section */}
      <div className="space-y-6">
        <h2 className="heading-glass text-2xl font-bold tracking-tight">Reviews & Ratings</h2>

        {/* Review Submission */}
        <ReviewSubmission productId={productId} isLoggedIn={isLoggedIn} token={token} onReviewSubmitted={handleReviewSubmitted} />

        {/* Review Display */}
        <ReviewDisplay
          productId={productId}
          isLoggedIn={isLoggedIn}
          token={token}
          key={reviewsRefreshTrigger} // Force re-render when reviews are updated
        />
      </div>

      {/* Toast Notification */}
      <UiToast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: "success" })} />
    </div>
  );
}
