import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";
import UiSearchFilter from "./components/ui/UiSearchFilter";

export default function Search({ onAddToCart, isLoggedIn, promptLogin }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

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

  return (
    <div className="space-y-8">
      <div className="text-center mb-2">
        <h1 className="heading-glass text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-glass-muted">Use filters to refine results</p>
      </div>

      <UiSearchFilter categories={categories} brands={brands} onSearch={handleSearch} onFilter={handleFilterChange} />

      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      {error && <div className="glass-subtle p-4 rounded-lg border border-red-300/30 text-center text-red-200">{error}</div>}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between glass-subtle p-4 rounded-xl border border-white/20">
            <p className="text-glass font-medium tracking-tight">
              Showing <span className="font-semibold text-glass">{products.length}</span> of
              <span className="font-semibold text-glass"> {pagination.totalProducts}</span> products
            </p>
            {pagination.totalPages > 1 && (
              <p className="text-glass-muted font-medium tracking-tight">
                Page <span className="font-semibold text-glass">{pagination.currentPage}</span> of
                <span className="font-semibold text-glass"> {pagination.totalPages}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <UiCard key={product._id} className="flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-1">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer group relative">
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
                    <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: product.images && product.images.length > 0 ? "none" : "flex" }}>
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                        <p className="text-xs text-gray-500">No Image</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="font-display font-semibold text-lg mb-3 text-glass tracking-tight leading-tight">{product.name}</h2>
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
                        onAddToCart(product);
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
    </div>
  );
}
