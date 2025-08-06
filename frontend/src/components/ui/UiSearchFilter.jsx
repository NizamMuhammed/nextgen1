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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Search & Filter Products</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
          <div className="flex">
            <input
              type="text"
              placeholder="Search by name, description, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <UiButton onClick={handleSearch} variant="contained" color="primary" className="rounded-l-none px-6" disabled={isFiltering}>
              Search
            </UiButton>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Brands</option>
            {brands?.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Price Range */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <span className="text-gray-500 font-medium">to</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Stock Range */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock Range</label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min Stock"
                value={stockRange.min}
                onChange={(e) => setStockRange({ ...stockRange, min: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <span className="text-gray-500 font-medium">to</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max Stock"
                value={stockRange.max}
                onChange={(e) => setStockRange({ ...stockRange, max: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="stock">Stock Low to High</option>
            <option value="stock-desc">Stock High to Low</option>
          </select>
        </div>

        {/* Stock Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock Availability</label>
          <select
            value={inStock}
            onChange={(e) => setInStock(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Products</option>
            <option value="true">In Stock Only</option>
            <option value="false">Out of Stock Only</option>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Category: {selectedCategory}</span>}
            {selectedBrand && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Brand: {selectedBrand}</span>}
            {(priceRange.min || priceRange.max) && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Price: ${priceRange.min || "0"} - ${priceRange.max || "∞"}
              </span>
            )}
            {(stockRange.min || stockRange.max) && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Stock: {stockRange.min || "0"} - {stockRange.max || "∞"}
              </span>
            )}
            {inStock && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{inStock === "true" ? "In Stock Only" : "Out of Stock Only"}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
