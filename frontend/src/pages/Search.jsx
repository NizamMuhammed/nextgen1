import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UiButton from "../components/ui/UiButton";
import UiSearchFilter from "../components/ui/UiSearchFilter";
import UiProductModal from "../components/ui/UiProductModal";
import ProductCard from "../components/ProductCard";

export default function Search({ onAddToCart, isLoggedIn, promptLogin, refreshTrigger }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const initialFilters = useMemo(
    () => ({
      search: searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      minStock: searchParams.get("minStock") || "",
      maxStock: searchParams.get("maxStock") || "",
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
      inStock: searchParams.get("inStock") || "",
      page: Number(searchParams.get("page") || 1),
    }),
    []
  );

  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  });

  const fetchMeta = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([fetch("http://localhost:5000/api/products/categories"), fetch("http://localhost:5000/api/products/brands")]);
      if (catRes.ok) setCategories(await catRes.json());
      if (brandRes.ok) setBrands(await brandRes.json());
    } catch (e) {
      // ignore
    }
  };

  const fetchProducts = async (f = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f.search) params.append("search", f.search);
      if (f.category) params.append("category", f.category);
      if (f.brand) params.append("brand", f.brand);
      if (f.minPrice) params.append("minPrice", f.minPrice);
      if (f.maxPrice) params.append("maxPrice", f.maxPrice);
      if (f.minStock) params.append("minStock", f.minStock);
      if (f.maxStock) params.append("maxStock", f.maxStock);
      if (f.sortBy) params.append("sortBy", f.sortBy);
      if (f.sortOrder) params.append("sortOrder", f.sortOrder);
      if (f.inStock) params.append("inStock", f.inStock);
      params.append("page", f.page || 1);
      params.append("limit", 20);

      // Keep URL in sync
      setSearchParams(params);

      const res = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch products");
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
    fetchMeta();
    fetchProducts(initialFilters);
  }, []);

  // Refresh products when refreshTrigger changes (e.g., after order completion)
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log("Refreshing search products due to refresh trigger");
      fetchProducts(filters);
    }
  }, [refreshTrigger]);

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleFilterChange = (filterOptions) => {
    const newFilters = { ...filters };
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
    newFilters.page = 1;
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeProductModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-8">
      <UiSearchFilter categories={categories} brands={brands} onSearch={handleSearch} onFilter={handleFilterChange} />

      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      {error && <div className="glass-subtle p-4 rounded-lg border border-red-300/30 text-center text-red-200">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                isLoggedIn={isLoggedIn}
                promptLogin={promptLogin}
                onQuickView={openProductModal}
                showWishlist={false}
                showQuickView={true}
                showDescription={false}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
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
        </>
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
            onAddToCart(product);
          }
        }}
        isLoggedIn={isLoggedIn}
        promptLogin={promptLogin}
      />
    </div>
  );
}
