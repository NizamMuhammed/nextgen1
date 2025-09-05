import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";
import UiSearchFilter from "./components/ui/UiSearchFilter";
import UiProductModal from "./components/ui/UiProductModal";
import UiToast from "./components/ui/UiToast";
import { useWishlist } from "./hooks/useWishlist";
import { MdOutlineRemoveRedEye, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { PiImageBrokenDuotone } from "react-icons/pi";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function Home({ onAddToCart, isLoggedIn, promptLogin, token, refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [lastViewedProducts, setLastViewedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  // Wishlist functionality
  const { toggleWishlist, isInWishlist } = useWishlist(isLoggedIn, token);

  // Utility function to randomize array using Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  });

  // Search and filter state
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    minStock: "",
    maxStock: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    inStock: "",
  });

  const fetchProducts = async (newFilters = filters, page = 1) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (newFilters.search) params.append("search", newFilters.search);
      if (newFilters.category) params.append("category", newFilters.category);
      if (newFilters.brand) params.append("brand", newFilters.brand);
      if (newFilters.minPrice) params.append("minPrice", newFilters.minPrice);
      if (newFilters.maxPrice) params.append("maxPrice", newFilters.maxPrice);
      if (newFilters.minStock) params.append("minStock", newFilters.minStock);
      if (newFilters.maxStock) params.append("maxStock", newFilters.maxStock);
      if (newFilters.sortBy) params.append("sortBy", newFilters.sortBy);
      if (newFilters.sortOrder) params.append("sortOrder", newFilters.sortOrder);
      if (newFilters.inStock) params.append("inStock", newFilters.inStock);
      params.append("page", page);
      params.append("limit", 20);

      const res = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch products");

      // Handle the new API response format and randomize products
      const fetchedProducts = data.products || [];
      const randomizedProducts = shuffleArray(fetchedProducts);
      setProducts(randomizedProducts);
      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
        }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/categories");
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/brands");
        const data = await res.json();
        if (res.ok) {
          setBrands(data);
        }
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, []);

  // Refresh products when refreshTrigger changes (e.g., after order completion)
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log("Refreshing products due to refresh trigger");
      fetchProducts();
    }
  }, [refreshTrigger]);

  // Load last viewed products from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lastViewedProducts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLastViewedProducts(parsed.slice(0, 4)); // Show only last 4 products
      } catch (err) {
        console.error("Failed to parse last viewed products:", err);
      }
    }
  }, []);

  const handleAddToCartAndTrack = (product) => {
    // Add to cart
    onAddToCart(product);

    // Track last viewed product
    const saved = localStorage.getItem("lastViewedProducts");
    let lastViewed = [];
    if (saved) {
      try {
        lastViewed = JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse last viewed products:", err);
      }
    }

    // Remove if already exists and add to front
    lastViewed = lastViewed.filter((p) => p._id !== product._id);
    lastViewed.unshift(product);

    // Keep only last 10 products
    lastViewed = lastViewed.slice(0, 10);

    localStorage.setItem("lastViewedProducts", JSON.stringify(lastViewed));
    setLastViewedProducts(lastViewed.slice(0, 4));
  };

  const handleFilterChange = (filterOptions) => {
    const newFilters = { ...filters };

    // Map frontend filter names to backend names
    if (filterOptions.search !== undefined) newFilters.search = filterOptions.search;
    if (filterOptions.category !== undefined) newFilters.category = filterOptions.category;
    if (filterOptions.brand !== undefined) newFilters.brand = filterOptions.brand;
    if (filterOptions.minPrice !== undefined) newFilters.minPrice = filterOptions.minPrice;
    if (filterOptions.maxPrice !== undefined) newFilters.maxPrice = filterOptions.maxPrice;
    if (filterOptions.minStock !== undefined) newFilters.minStock = filterOptions.minStock;
    if (filterOptions.maxStock !== undefined) newFilters.maxStock = filterOptions.maxStock;
    if (filterOptions.inStock !== undefined) newFilters.inStock = filterOptions.inStock;
    if (filterOptions.sortBy !== undefined) newFilters.sortBy = filterOptions.sortBy;
    if (filterOptions.sortOrder !== undefined) newFilters.sortOrder = filterOptions.sortOrder;

    // Convert sortBy to backend format
    if (filterOptions.sortBy === "name" || filterOptions.sortBy === "name-desc") {
      newFilters.sortBy = "name";
    } else if (filterOptions.sortBy === "price" || filterOptions.sortBy === "price-desc") {
      newFilters.sortBy = "price";
    } else if (filterOptions.sortBy === "stock" || filterOptions.sortBy === "stock-desc") {
      newFilters.sortBy = "stock";
    } else if (filterOptions.sortBy === "newest" || filterOptions.sortBy === "oldest") {
      newFilters.sortBy = "createdAt";
    }

    setFilters(newFilters);
    fetchProducts(newFilters, 1);
  };

  const handlePageChange = (page) => {
    fetchProducts(filters, page);
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

  const handleWishlistToggle = async (product, e) => {
    e.stopPropagation(); // Prevent triggering the card click
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

  if (loading)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px" sx={{ color: "primary.main" }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
          Loading products...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px" sx={{ color: "error.main" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          ⚠️
        </Typography>
        <Typography variant="body1" color="error.main" sx={{ fontWeight: 500 }}>
          {error}
        </Typography>
      </Box>
    );

  return (
    <div className="space-y-8">
      {/* Last Viewed Products Section */}
      {lastViewedProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 glass-subtle rounded-lg flex items-center justify-center">
              <MdOutlineRemoveRedEye className="w-5 h-5 text-white" />
            </div>
            <h2 className="heading-glass text-xl font-semibold tracking-tight">Last Checked Products</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lastViewedProducts.map((product) => (
              <UiCard key={product._id} className="flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-1">
                  {/* Product Image (go to details page) */}
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer group relative" onClick={() => handleProductClick(product)}>
                    {product.images && product.images.length > 0 ? (
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
                      onClick={(e) => handleWishlistToggle(product, e)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-lg"
                      title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isInWishlist(product._id) ? <MdFavorite className="w-5 h-5 text-red-500" /> : <MdFavoriteBorder className="w-5 h-5 text-gray-600" />}
                    </button>

                    {/* Quick View Overlay Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <UiButton
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the image click
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
                    onClick={() => {
                      if (!isLoggedIn) {
                        promptLogin();
                      } else {
                        handleAddToCartAndTrack(product);
                      }
                    }}
                    disabled={(product.stock || 0) === 0}
                    className="w-full"
                  >
                    {(product.stock || 0) === 0 ? "Out of Stock" : "Add to Cart"}
                  </UiButton>
                </div>
              </UiCard>
            ))}
          </div>
        </div>
      )}
      {products.length > 0 && (
        <div className="flex items-center justify-between glass-subtle p-4 rounded-xl border border-white/20">
          <p className="text-glass font-medium tracking-tight">
            Showing <span className="font-semibold text-glass">{products.length}</span> of <span className="font-semibold text-glass">{pagination.totalProducts}</span> products
          </p>
          {pagination.totalPages > 1 && (
            <p className="text-glass-muted font-medium tracking-tight">
              Page <span className="font-semibold text-glass">{pagination.currentPage}</span> of <span className="font-semibold text-glass">{pagination.totalPages}</span>
            </p>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <UiCard key={product._id} className="flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => handleProductClick(product)}>
            <div className="flex-1">
              {/* Product Image (go to details page) */}
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer group relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].startsWith("http") ? product.images[0] : `http://localhost:5000${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.warn(`Failed to load image for ${product.name}:`, e.target.src);
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                    onLoad={(e) => {
                      console.log(`Successfully loaded image for ${product.name}:`, e.target.src);
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
                <button
                  onClick={(e) => handleWishlistToggle(product, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 shadow-lg"
                  title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isInWishlist(product._id) ? <MdFavorite className="w-5 h-5 text-red-500" /> : <MdFavoriteBorder className="w-5 h-5 text-gray-600" />}
                </button>

                {/* Quick View Overlay Button */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <UiButton
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the image click
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
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
                  if (!isLoggedIn) {
                    promptLogin();
                  } else {
                    handleAddToCartAndTrack(product);
                  }
                }}
                disabled={(product.stock || 0) === 0}
                className="w-full"
              >
                {(product.stock || 0) === 0 ? "Out of Stock" : "Add to Cart"}
              </UiButton>
            </div>
          </UiCard>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <UiButton onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage} className="px-4 py-2">
            Previous
          </UiButton>
          <span className="flex items-center px-4 py-2 text-glass">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <UiButton onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage} className="px-4 py-2">
            Next
          </UiButton>
        </div>
      )}

      {/* Product Modal */}
      <UiProductModal
        product={selectedProduct}
        open={showModal}
        onClose={closeProductModal}
        onAddToCart={(product) => {
          if (!isLoggedIn) {
            promptLogin();
          } else {
            handleAddToCartAndTrack(product);
          }
        }}
        isLoggedIn={isLoggedIn}
        promptLogin={promptLogin}
        token={token}
      />

      {/* Toast Notification */}
      <UiToast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: "success" })} />
    </div>
  );
}
