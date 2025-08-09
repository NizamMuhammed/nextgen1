import React, { useState, useEffect } from "react";
import UiButton from "./UiButton";

export default function UiSearchFilter({ onSearch, onFilter, categories, brands }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockRange, setStockRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [inStock, setInStock] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        onSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleFilter = () => {
    setIsFiltering(true);
    onFilter({
      category: selectedCategory,
      brand: selectedBrand,
      priceRange,
      stockRange,
      sortBy,
      inStock,
    });
    setIsFiltering(false);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange({ min: "", max: "" });
    setStockRange({ min: "", max: "" });
    setSortBy("newest");
    setInStock("");
    onSearch("");
    onFilter({});
  };

  return (
    <div className="glass p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 glass-subtle rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="heading-glass text-xl font-semibold tracking-tight">Search & Filter Products</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-glass-muted mb-2">Search Products</label>
          <div className="flex">
            <input
              type="text"
              placeholder="Search by name, description, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 input-glass px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors placeholder:text-white/50 text-glass"
            />
            <UiButton onClick={handleSearch} variant="contained" color="primary" className="rounded-l-none px-6" disabled={isFiltering}>
              Search
            </UiButton>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-glass-muted mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors text-glass"
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category} value={category} className="bg-gray-800 text-white">
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-glass-muted mb-2">Brand</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors text-glass"
          >
            <option value="">All Brands</option>
            {brands?.map((brand) => (
              <option key={brand} value={brand} className="bg-gray-800 text-white">
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Price Range */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-glass-muted mb-2">Price Range</label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors placeholder:text-white/50 text-glass"
              />
            </div>
            <span className="text-glass-muted font-medium">to</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors placeholder:text-white/50 text-glass"
              />
            </div>
          </div>
        </div>

        {/* Stock Range */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-glass-muted mb-2">Stock Range</label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min Stock"
                value={stockRange.min}
                onChange={(e) => setStockRange({ ...stockRange, min: e.target.value })}
                className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors placeholder:text-white/50 text-glass"
              />
            </div>
            <span className="text-glass-muted font-medium">to</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max Stock"
                value={stockRange.max}
                onChange={(e) => setStockRange({ ...stockRange, max: e.target.value })}
                className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors placeholder:text-white/50 text-glass"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-glass-muted mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors text-glass"
          >
            <option value="newest" className="bg-gray-800 text-white">
              Newest First
            </option>
            <option value="oldest" className="bg-gray-800 text-white">
              Oldest First
            </option>
            <option value="name" className="bg-gray-800 text-white">
              Name A-Z
            </option>
            <option value="name-desc" className="bg-gray-800 text-white">
              Name Z-A
            </option>
            <option value="price" className="bg-gray-800 text-white">
              Price Low to High
            </option>
            <option value="price-desc" className="bg-gray-800 text-white">
              Price High to Low
            </option>
            <option value="stock" className="bg-gray-800 text-white">
              Stock Low to High
            </option>
            <option value="stock-desc" className="bg-gray-800 text-white">
              Stock High to Low
            </option>
          </select>
        </div>

        {/* Stock Availability */}
        <div>
          <label className="block text-sm font-medium text-glass-muted mb-2">Stock Availability</label>
          <select
            value={inStock}
            onChange={(e) => setInStock(e.target.value)}
            className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors text-glass"
          >
            <option value="" className="bg-gray-800 text-white">
              All Products
            </option>
            <option value="true" className="bg-gray-800 text-white">
              In Stock Only
            </option>
            <option value="false" className="bg-gray-800 text-white">
              Out of Stock Only
            </option>
          </select>
        </div>

        {/* Quick Actions */}
        <div className="flex items-end">
          <div className="flex gap-2 w-full">
            <UiButton onClick={handleFilter} variant="contained" color="primary" className="flex-1" disabled={isFiltering}>
              {isFiltering ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Applying...
                </>
              ) : (
                "Apply Filters"
              )}
            </UiButton>
            <UiButton onClick={handleReset} variant="outlined" color="secondary" className="px-4" disabled={isFiltering}>
              Reset
            </UiButton>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || selectedBrand || priceRange.min || priceRange.max || stockRange.min || stockRange.max || inStock) && (
        <div className="glass-subtle rounded-lg p-4 mb-6 border border-white/20">
          <h4 className="text-sm font-medium text-glass mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-blue-300/30">Category: {selectedCategory}</span>}
            {selectedBrand && <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-blue-300/30">Brand: {selectedBrand}</span>}
            {(priceRange.min || priceRange.max) && (
              <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-blue-300/30">
                Price: Rs.{priceRange.min || "0"} - Rs.{priceRange.max || "∞"}
              </span>
            )}
            {(stockRange.min || stockRange.max) && (
              <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-blue-300/30">
                Stock: {stockRange.min || "0"} - {stockRange.max || "∞"}
              </span>
            )}
            {inStock && (
              <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-blue-300/30">
                {inStock === "true" ? "In Stock Only" : "Out of Stock Only"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
