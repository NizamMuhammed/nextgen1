import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UiButton from "./UiButton";
import Logo from "../../pics/NextGen Electronics.png";

export default function UiNavBar({ user, cart, onShowLogin, onShowSignup, onLogout }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

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

  return (
    <nav className="w-full glass backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 font-display font-bold text-xl cursor-pointer heading-glass" onClick={() => handleNavigation("/")}>
            <img src={Logo} alt="NextGen Electronics" className="w-10 h-10" />
            <span className="hidden sm:block">NextGen Electronics</span>
            <span className="sm:hidden">NextGen</span>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center h-full">
            {/* Menu Items Container */}
            <div className="flex items-center h-full">
              {/* Search */}
              <div className="h-full flex items-center">
                <div
                  onClick={() => handleNavigation("/search")}
                  className="flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-200 font-medium tracking-tight cursor-pointer border-b-2 border-transparent hover:border-white/20"
                >
                  🔎 Search
                </div>
              </div>

              {/* Cart */}
              <div className="relative h-full flex items-center">
                <div
                  onClick={() => handleNavigation("/cart")}
                  className="flex items-center gap-2 px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-200 font-medium tracking-tight cursor-pointer border-b-2 border-transparent hover:border-white/20"
                >
                  <span>🛒 Cart</span>
                  {cart.length > 0 && (
                    <span className="bg-red-400/90 text-white rounded-full px-2 py-0.5 text-xs font-semibold backdrop-blur-sm border border-red-300/50 shadow-lg">{cartItemCount}</span>
                  )}
                </div>
              </div>

              {/* Orders */}
              {user && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/orders")}
                    className="flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-200 font-medium tracking-tight cursor-pointer border-b-2 border-transparent hover:border-white/20"
                  >
                    📄 Orders
                  </div>
                </div>
              )}

              {/* Wishlist */}
              {user && (
                <div className="h-full flex items-center">
                  <div
                    onClick={() => handleNavigation("/wishlist")}
                    className="flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-200 font-medium tracking-tight cursor-pointer border-b-2 border-transparent hover:border-white/20"
                  >
                    💝 Wishlist
                  </div>
                </div>
              )}

              {/* Track Order */}
              <div className="h-full flex items-center">
                <div
                  onClick={() => handleNavigation("/tracking")}
                  className="flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-200 font-medium tracking-tight cursor-pointer border-b-2 border-transparent hover:border-white/20"
                >
                  📦 Track
                </div>
              </div>

              {/* Admin Menu */}
              {user && user.role === "admin" && (
                <div className="relative h-full flex items-center group">
                  <div className="flex items-center px-6 h-full text-glass-muted hover:text-glass hover:bg-white/5 transition-all duration-200 font-medium tracking-tight cursor-pointer border-b-2 border-transparent hover:border-white/20">
                    <span className="flex items-center gap-1">
                      ⚙️ Admin
                      <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                  <div className="absolute top-full left-0 w-48 glass-strong rounded-b-lg shadow-xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top">
                    <div className="py-1">
                      <div
                        onClick={() => handleNavigation("/manage-products")}
                        className="block w-full text-left px-4 py-2 text-glass-muted hover:text-glass hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                      >
                        Manage Products
                      </div>
                      <div
                        onClick={() => handleNavigation("/manage-users")}
                        className="block w-full text-left px-4 py-2 text-glass-muted hover:text-glass hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                      >
                        Manage Users
                      </div>
                    </div>
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
                  <div className="absolute right-0 mt-2 w-56 glass-strong rounded-lg shadow-xl border border-white/20 animate-in slide-in-from-top-2">
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-glass font-semibold">{user.name || "User"}</p>
                        <p className="text-glass-muted text-sm">{user.email}</p>
                        {user.role === "admin" && <span className="inline-block mt-1 px-2 py-1 bg-purple-400/20 text-purple-300 text-xs rounded-full border border-purple-300/30">Administrator</span>}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <div
                          onClick={() => {
                            console.log("Settings clicked");
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-glass-muted hover:text-glass hover:bg-white/10 transition-colors duration-150 cursor-pointer"
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
                onClick={() => handleNavigation("/search")}
                className="flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer"
              >
                🔎 Search
              </div>

              <div
                onClick={() => handleNavigation("/cart")}
                className="flex items-center justify-between w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  🛒 Cart
                  {cart.length > 0 && <span className="bg-red-400/90 text-white rounded-full px-2 py-0.5 text-xs font-semibold">{cartItemCount}</span>}
                </span>
              </div>

              {user && (
                <div
                  onClick={() => handleNavigation("/orders")}
                  className="flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                >
                  📄 My Orders
                </div>
              )}

              {user && (
                <div
                  onClick={() => handleNavigation("/wishlist")}
                  className="flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                >
                  💝 Wishlist
                </div>
              )}

              <div
                onClick={() => handleNavigation("/tracking")}
                className="flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer"
              >
                📦 Track Order
              </div>

              {user && user.role === "admin" && (
                <>
                  <div className="border-t border-white/10 my-1"></div>
                  <div
                    onClick={() => handleNavigation("/manage-products")}
                    className="flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                  >
                    ⚙️ Manage Products
                  </div>
                  <div
                    onClick={() => handleNavigation("/manage-users")}
                    className="flex items-center w-full px-3 py-2 text-glass-muted hover:text-glass hover:bg-white/10 rounded-lg transition-all duration-200 font-medium cursor-pointer"
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
