import React, { useState, useEffect, useRef } from "react";
import UiButton from "./UiButton";
import UIValidation from "./UIValidation";

export default function UiSearchFilter({ onSearch, onFilter, categories, brands }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockRange, setStockRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [inStock, setInStock] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Track previous search term to detect actual changes
  const prevSearchTermRef = useRef("");
  const searchTimeoutRef = useRef(null);

  // Handle search input changes with debouncing
  const handleSearchInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // Clear validation error when user starts typing
    if (validationErrors.searchTerm) {
      setValidationErrors((prev) => ({ ...prev, searchTerm: null }));
    }

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only search if the value actually changed
    if (newValue !== prevSearchTermRef.current) {
      // Set a short delay to avoid excessive API calls
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(newValue);
        prevSearchTermRef.current = newValue;
      }, 300);
    }
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[`price_${name}`]) {
      setValidationErrors((prev) => ({ ...prev, [`price_${name}`]: null }));
    }
  };

  const handleStockRangeChange = (e) => {
    const { name, value } = e.target;
    setStockRange((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[`stock_${name}`]) {
      setValidationErrors((prev) => ({ ...prev, [`stock_${name}`]: null }));
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const validateForm = () => {
    const errors = {};

    // Validate price range
    if (priceRange.min && priceRange.max && parseFloat(priceRange.min) > parseFloat(priceRange.max)) {
      errors.price_max = "Maximum price must be greater than minimum price.";
    }

    if (priceRange.min && parseFloat(priceRange.min) < 0) {
      errors.price_min = "Minimum price cannot be negative.";
    }

    if (priceRange.max && parseFloat(priceRange.max) < 0) {
      errors.price_max = "Maximum price cannot be negative.";
    }

    // Validate stock range
    if (stockRange.min && stockRange.max && parseInt(stockRange.min) > parseInt(stockRange.max)) {
      errors.stock_max = "Maximum stock must be greater than minimum stock.";
    }

    if (stockRange.min && parseInt(stockRange.min) < 0) {
      errors.stock_min = "Minimum stock cannot be negative.";
    }

    if (stockRange.max && parseInt(stockRange.max) < 0) {
      errors.stock_max = "Maximum stock cannot be negative.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = () => {
    // Clear any pending timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onSearch(searchTerm);
    prevSearchTermRef.current = searchTerm;
  };

  const handleFilter = () => {
    if (!validateForm()) {
      return;
    }

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
    // Clear any pending timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange({ min: "", max: "" });
    setStockRange({ min: "", max: "" });
    setSortBy("newest");
    setInStock("");
    prevSearchTermRef.current = "";
    setValidationErrors({});
    onSearch("");
    onFilter({});
  };

  return (
    <div className="glass p-6 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <label className="block text-sm font-medium text-glass-muted mb-2">Search Products</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder="Search by name, description, or brand..."
            className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <UIValidation message={validationErrors.searchTerm} position="top" type="error" visible={!!validationErrors.searchTerm} />
        </div>

        {/* Category */}
        <div className="relative">
          <label className="block text-sm font-medium text-glass-muted mb-2">Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="relative">
          <label className="block text-sm font-medium text-glass-muted mb-2">Brand</label>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Price Range */}
        <div className="relative">
          <label className="block text-sm font-medium text-glass-muted mb-2">Min Price</label>
          <input
            type="number"
            value={priceRange.min}
            onChange={handlePriceRangeChange}
            name="min"
            placeholder="0.00"
            className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <UIValidation message={validationErrors.price_min} position="top" type="error" visible={!!validationErrors.price_min} />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-glass-muted mb-2">Max Price</label>
          <input
            type="number"
            value={priceRange.max}
            onChange={handlePriceRangeChange}
            name="max"
            placeholder="1000.00"
            className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <UIValidation message={validationErrors.price_max} position="top" type="error" visible={!!validationErrors.price_max} />
        </div>

        {/* Stock Range */}
        <div className="relative">
          <label className="block text-sm font-medium text-glass-muted mb-2">Min Stock</label>
          <input
            type="number"
            value={stockRange.min}
            onChange={handleStockRangeChange}
            name="min"
            placeholder="0"
            className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <UIValidation message={validationErrors.stock_min} position="top" type="error" visible={!!validationErrors.stock_min} />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-glass-muted mb-2">Max Stock</label>
          <input
            type="number"
            value={stockRange.max}
            onChange={handleStockRangeChange}
            name="max"
            placeholder="100"
            className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <UIValidation message={validationErrors.stock_max} position="top" type="error" visible={!!validationErrors.stock_max} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-glass-muted mb-2">Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>

        {/* In Stock */}
        <div>
          <label className="block text-sm font-medium text-glass-muted mb-2">Stock Status</label>
          <select value={inStock} onChange={(e) => setInStock(e.target.value)} className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Items</option>
            <option value="true">In Stock Only</option>
            <option value="false">Out of Stock Only</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-end space-x-2">
          <UiButton onClick={handleFilter} variant="contained" color="primary" disabled={isFiltering} className="flex-1">
            {isFiltering ? "Filtering..." : "Apply Filters"}
          </UiButton>
          <UiButton onClick={handleReset} variant="outlined" color="secondary" className="flex-1">
            Reset
          </UiButton>
        </div>
      </div>
    </div>
  );
}
