import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UiButton from "./UiButton";
import Logo from "../../assets/NextGen Electronics.png";
import { FaSearch } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GoChecklist } from "react-icons/go";
import { MdManageAccounts, MdInventory } from "react-icons/md";
import { BsFillChatSquareHeartFill } from "react-icons/bs";

export default function UiNavBar({ user, cart, onShowLogin, onShowSignup, onLogout }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    setIsProfileOpen(false);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (user && user.role === "staff") {
      handleNavigation("/orders");
    } else {
      handleNavigation("/");
    }
  };

  return (
    <nav className="w-full glass backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div
            className={`flex items-center gap-3 font-display font-bold text-xl cursor-pointer heading-glass transition-all duration-300 ease-in-out hover:scale-105 transform ${
              location.pathname === "/" ? "text-glass" : "text-glass-muted"
            }`}
            onClick={handleLogoClick}
          >
            <img src={Logo} alt="NextGen Electronics" className="w-10 h-10 transition-transform duration-300 ease-in-out hover:scale-110" />
            <span className="hidden sm:block transition-all duration-300 ease-in-out">NextGen Electronics</span>
            <span className="sm:hidden transition-all duration-300 ease-in-out">NextGen</span>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center h-full">
            {/* Menu Items Container */}
            <div className="flex items-center h-full">
              {/* Dashboard - Admin Only */}
              {user && user.role === "admin" && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/dashboard")}
                    onMouseEnter={() => setHoveredItem("dashboard")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                      location.pathname === "/dashboard" ? "border-white/20" : "border-transparent"
                    } hover:scale-105 transform`}
                  >
                    <LuLayoutDashboard size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                    {hoveredItem === "dashboard" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Dashboard</span>}
                  </div>
                </div>
              )}

              {/* Cart */}
              {user && user.role === "customer" && (
                <div className="relative h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/cart")}
                    onMouseEnter={() => setHoveredItem("cart")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center gap-2 px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                      location.pathname === "/cart" ? "border-white/20" : "border-transparent"
                    } hover:scale-105 transform`}
                  >
                    <AiOutlineShoppingCart size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                    {hoveredItem === "cart" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Cart</span>}
                    {cart.length > 0 && (
                      <span className="bg-red-400/90 text-white rounded-full px-2 py-0.5 text-xs font-semibold backdrop-blur-sm border border-red-300/50 shadow-lg transition-all duration-300 ease-in-out hover:scale-110">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Orders */}
              {user && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/orders")}
                    onMouseEnter={() => setHoveredItem("orders")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                      location.pathname === "/orders" ? "border-white/20" : "border-transparent"
                    } hover:scale-105 transform`}
                  >
                    <GoChecklist size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                    {hoveredItem === "orders" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Orders</span>}
                  </div>
                </div>
              )}

              {/* Wishlist */}
              {user && user.role === "customer" && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/wishlist")}
                    onMouseEnter={() => setHoveredItem("wishlist")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                      location.pathname === "/wishlist" ? "border-white/20" : "border-transparent"
                    } hover:scale-105 transform`}
                  >
                    <BsFillChatSquareHeartFill size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                    {hoveredItem === "wishlist" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Wishlist</span>}
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="h-full flex items-center">
                <div
                  onClick={() => handleNavigation("/search")}
                  onMouseEnter={() => setHoveredItem("search")}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                    location.pathname === "/search" ? "border-white/20" : "border-transparent"
                  } hover:scale-105 transform`}
                >
                  <FaSearch size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                  {hoveredItem === "search" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Search</span>}
                </div>
              </div>
              <div className="h-full flex items-center">
                <div
                  onClick={() => handleNavigation("/tracking")}
                  onMouseEnter={() => setHoveredItem("tracking")}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                    location.pathname === "/tracking" ? "border-white/20" : "border-transparent"
                  } hover:scale-105 transform`}
                >
                  <GoPackage size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                  {hoveredItem === "tracking" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Track Order</span>}
                </div>
              </div>

              {/* Admin - Manage Products */}
              {user && user.role === "admin" && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/manage-products")}
                    onMouseEnter={() => setHoveredItem("admin-manage-products")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                      location.pathname === "/manage-products" ? "border-white/20" : "border-transparent"
                    } hover:scale-105 transform`}
                  >
                    <MdInventory size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                    {hoveredItem === "admin-manage-products" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Manage Products</span>}
                  </div>
                </div>
              )}

              {/* Admin - Manage Users */}
              {user && user.role === "admin" && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/manage-users")}
                    onMouseEnter={() => setHoveredItem("admin-manage-users")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                      location.pathname === "/manage-users" ? "border-white/20" : "border-transparent"
                    } hover:scale-105 transform`}
                  >
                    <MdManageAccounts size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                    {hoveredItem === "admin-manage-users" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Manage Users</span>}
                  </div>
                </div>
              )}

              {/* Staff - Manage Products */}
              {user && user.role === "staff" && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/manage-products")}
                    onMouseEnter={() => setHoveredItem("manage-products")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                      location.pathname === "/manage-products" ? "border-white/20" : "border-transparent"
                    } hover:scale-105 transform`}
                  >
                    <MdInventory size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                    {hoveredItem === "manage-products" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Manage Products</span>}
                  </div>
                </div>
              )}

              {/* Staff - Manage Users */}
              {user && user.role === "staff" && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/manage-users")}
                    onMouseEnter={() => setHoveredItem("manage-users")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-300 ease-in-out font-medium tracking-tight cursor-pointer border-b-2 ${
                      location.pathname === "/manage-users" ? "border-white/20" : "border-transparent"
                    } hover:scale-105 transform`}
                  >
                    <MdManageAccounts size={20} className="transition-transform duration-300 ease-in-out hover:scale-110" />
                    {hoveredItem === "manage-users" && <span className="ml-2 whitespace-nowrap animate-in slide-in-from-left-2 duration-300 ease-out">Manage Users</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={profileRef}>
                {/* Profile Button */}
                <div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium tracking-tight cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.name || user.email}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-purple-800 rounded-lg shadow-xl border border-white/20 animate-in slide-in-from-top-2">
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-glass font-semibold">{user.name || "User"}</p>
                        <p className="text-glass-muted text-sm">{user.email}</p>
                        {user.role === "admin" && <span className="inline-block mt-1 px-2 py-1 bg-purple-400/20 text-purple-300 text-xs rounded-full border border-purple-300/30">Administrator</span>}
                        {user.role === "staff" && <span className="inline-block mt-1 px-2 py-1 bg-blue-400/20 text-blue-300 text-xs rounded-full border border-blue-300/30">Staff</span>}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <div
                          onClick={() => {
                            handleNavigation("/settings");
                            setIsProfileOpen(false);
                          }}
                          className={`flex items-center w-full px-4 py-2 transition-colors duration-150 cursor-pointer ${
                            location.pathname === "/settings" ? "text-glass bg-white/10" : "text-glass-muted hover:text-glass hover:bg-white/10"
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </div>

                        <div
                          onClick={() => {
                            console.log("Help clicked");
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-glass-muted hover:text-glass hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Help & Support
                        </div>

                        <div className="border-t border-white/10 my-1"></div>

                        <div onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-400/10 transition-colors duration-150 cursor-pointer">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <UiButton className="font-medium tracking-tight text-sm px-3 py-2" onClick={onShowLogin}>
                  Login
                </UiButton>
                <UiButton className="font-medium tracking-tight text-sm px-3 py-2 btn-glass-primary" onClick={onShowSignup}>
                  Sign Up
                </UiButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-strong rounded-lg mt-2 border border-white/20 animate-in slide-in-from-top-2">
            <div className="px-2 py-2 space-y-1">
              <div
                onClick={handleLogoClick}
                className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  location.pathname === "/" ? "bg-white/10" : ""
                }`}
              >
                🏠 Home
              </div>
              {user && user.role === "admin" && (
                <div
                  onClick={() => handleNavigation("/dashboard")}
                  className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                    location.pathname === "/dashboard" ? "bg-white/10" : ""
                  }`}
                >
                  📊 Dashboard
                </div>
              )}

              {user && user.role === "customer" && (
                <div
                  onClick={() => handleNavigation("/cart")}
                  className={`flex items-center justify-between w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                    location.pathname === "/cart" ? "bg-white/10" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    🛒 Cart
                    {cart.length > 0 && <span className="bg-red-400/90 text-white rounded-full px-2 py-0.5 text-xs font-semibold">{cartItemCount}</span>}
                  </span>
                </div>
              )}

              {user && user.role === "customer" && (
                <div
                  onClick={() => handleNavigation("/orders")}
                  className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                    location.pathname === "/orders" ? "bg-white/10" : ""
                  }`}
                >
                  📄 My Orders
                </div>
              )}

              {user && user.role === "customer" && (
                <div
                  onClick={() => handleNavigation("/wishlist")}
                  className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                    location.pathname === "/wishlist" ? "bg-white/10" : ""
                  }`}
                >
                  💝 Wishlist
                </div>
              )}

              <div
                onClick={() => handleNavigation("/search")}
                className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  location.pathname === "/search" ? "bg-white/10" : ""
                }`}
              >
                🔍 Search
              </div>

              <div
                onClick={() => handleNavigation("/tracking")}
                className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  location.pathname === "/tracking" ? "bg-white/10" : ""
                }`}
              >
                📦 Track Order
              </div>

              {user && user.role === "admin" && (
                <>
                  <div className="border-t border-white/10 my-1"></div>
                  <div
                    onClick={() => handleNavigation("/manage-products")}
                    className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                      location.pathname === "/manage-products" ? "bg-white/10" : ""
                    }`}
                  >
                    📦 Manage Products
                  </div>
                  <div
                    onClick={() => handleNavigation("/manage-users")}
                    className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                      location.pathname === "/manage-users" ? "bg-white/10" : ""
                    }`}
                  >
                    👥 Manage Users
                  </div>
                </>
              )}

              {user && user.role === "staff" && (
                <>
                  <div
                    onClick={() => handleNavigation("/orders")}
                    className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                      location.pathname === "/orders" ? "bg-white/10" : ""
                    }`}
                  >
                    📄 Orders
                  </div>
                  <div className="border-t border-white/10 my-1"></div>
                  <div
                    onClick={() => handleNavigation("/manage-products")}
                    className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                      location.pathname === "/manage-products" ? "bg-white/10" : ""
                    }`}
                  >
                    📦 Manage Products
                  </div>
                  <div
                    onClick={() => handleNavigation("/manage-users")}
                    className={`flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                      location.pathname === "/manage-users" ? "bg-white/10" : ""
                    }`}
                  >
                    👥 Manage Users
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
