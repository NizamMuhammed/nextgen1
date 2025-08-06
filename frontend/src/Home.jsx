import React, { useEffect, useState } from "react";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";
import UiSearchFilter from "./components/ui/UiSearchFilter";
import UiProductModal from "./components/ui/UiProductModal";

export default function Home({ onAddToCart, isLoggedIn, promptLogin }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

      // Handle the new API response format
      setProducts(data.products || []);
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
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/brands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    fetchProducts(newFilters, 1);
  };

  const handleFilter = (filterOptions) => {
    const newFilters = {
      ...filters,
      category: filterOptions.category || "",
      brand: filterOptions.brand || "",
      minPrice: filterOptions.priceRange?.min || "",
      maxPrice: filterOptions.priceRange?.max || "",
      minStock: filterOptions.stockRange?.min || "",
      maxStock: filterOptions.stockRange?.max || "",
      inStock: filterOptions.inStock || "",
      sortBy: filterOptions.sortBy || "createdAt",
      sortOrder:
        filterOptions.sortBy === "name"
          ? "asc"
          : filterOptions.sortBy === "name-desc"
          ? "desc"
          : filterOptions.sortBy === "price"
          ? "asc"
          : filterOptions.sortBy === "price-desc"
          ? "desc"
          : filterOptions.sortBy === "stock"
          ? "asc"
          : filterOptions.sortBy === "stock-desc"
          ? "desc"
          : filterOptions.sortBy === "newest"
          ? "desc"
          : filterOptions.sortBy === "oldest"
          ? "asc"
          : "desc",
    };

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <UiSearchFilter onSearch={handleSearch} onFilter={handleFilter} categories={categories} brands={brands} />

      {/* Results Summary */}
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
          <UiCard key={product._id} className="flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex-1">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer group" onClick={() => openProductModal(product)}>
                {product.images && product.images.length > 0 ? (
                  <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2
                  className="font-display font-semibold text-lg mb-3 cursor-pointer hover:text-blue-200 transition-colors text-glass tracking-tight leading-tight"
                  onClick={() => openProductModal(product)}
                >
                  {product.name}
                </h2>
                <div className="text-sm mb-4 flex flex-wrap gap-2">
                  <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-300/30">{product.brand}</span>
                  <span className="bg-purple-400/30 text-purple-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-purple-300/30">{product.category}</span>
                </div>
                <p className="mb-4 text-glass-muted text-sm line-clamp-2 leading-relaxed tracking-tight">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-bold text-xl text-glass tracking-tight">${product.price}</span>
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
              <div className="flex gap-2">
                <UiButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    if (!isLoggedIn) {
                      promptLogin();
                    } else {
                      onAddToCart(product);
                    }
                  }}
                  disabled={(product.stock || 0) === 0}
                  className="flex-1"
                >
                  {(product.stock || 0) === 0 ? "Out of Stock" : "Add to Cart"}
                </UiButton>
                <UiButton variant="outlined" color="secondary" size="small" onClick={() => openProductModal(product)} className="px-3">
                  View
                </UiButton>
              </div>
            </div>
          </UiCard>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <UiButton variant="outlined" color="secondary" onClick={() => handlePageChange(pagination.prevPage)} disabled={!pagination.hasPrevPage} className="px-4 py-2">
            Previous
          </UiButton>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
              if (page > pagination.totalPages) return null;

              return (
                <UiButton key={page} variant={page === pagination.currentPage ? "contained" : "outlined"} color="primary" onClick={() => handlePageChange(page)} className="px-3 py-2 min-w-[40px]">
                  {page}
                </UiButton>
              );
            })}
          </div>

          <UiButton variant="outlined" color="secondary" onClick={() => handlePageChange(pagination.nextPage)} disabled={!pagination.hasNextPage} className="px-4 py-2">
            Next
          </UiButton>
        </div>
      )}

      {/* No Results */}
      {products.length === 0 && !loading && (
        <div className="text-center py-16 glass p-8 rounded-xl max-w-md mx-auto">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="heading-glass text-3xl font-bold mb-4 tracking-tight">No products found</h3>
          <p className="text-glass-muted text-lg leading-relaxed">Try adjusting your search or filter criteria to discover more products.</p>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && <UiProductModal product={selectedProduct} open={showModal} onClose={closeProductModal} onAddToCart={onAddToCart} isLoggedIn={isLoggedIn} promptLogin={promptLogin} />}
    </div>
  );
}
