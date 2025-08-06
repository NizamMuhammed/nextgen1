import React from "react";
import UiButton from "./UiButton";
import Logo from "../../pics/NextGen Electronics.png";

export default function UiNavBar({ user, cart, onViewChange, onShowLogin, onShowSignup, onLogout }) {
  const handleLogout = () => {
    onLogout();
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="w-full flex justify-between items-center glass backdrop-blur-xl shadow-lg p-4 sticky top-0 z-50 border-b border-white/20">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3 font-display font-bold text-xl cursor-pointer heading-glass animate-glow tracking-tight" onClick={() => onViewChange("home")}>
        <img src={Logo} alt="NextGen Electronics" className="w-10 h-10" />
        <span>NextGen Electronics</span>
      </div>

      {/* Navigation Actions */}
      <div className="flex gap-3 items-center flex-wrap">
        {/* Cart Button */}
        <UiButton className="relative font-medium tracking-tight" onClick={() => onViewChange("cart")}>
          🛒 Cart
          {cart.length > 0 && (
            <span className="ml-2 bg-red-400/90 text-white rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm border border-red-300/50 shadow-lg">{cartItemCount}</span>
          )}
        </UiButton>

        {/* Wishlist Button - Only for logged in users */}
        {user && (
          <UiButton className="font-medium tracking-tight" onClick={() => onViewChange("wishlist")}>
            💝 Wishlist
          </UiButton>
        )}

        {/* Order Tracking Button */}
        <UiButton className="font-medium tracking-tight" onClick={() => onViewChange("tracking")}>
          📦 Track Order
        </UiButton>

        {/* Admin Controls - Only for admin users */}
        {user && user.role === "admin" && (
          <>
            <UiButton className="font-medium tracking-tight" onClick={() => onViewChange("manageProducts")}>
              ⚙️ Manage Products
            </UiButton>
            <UiButton className="font-medium tracking-tight" onClick={() => onViewChange("manageUsers")}>
              👥 Manage Users
            </UiButton>
          </>
        )}

        {/* User Authentication Section */}
        {user ? (
          <>
            {/* User Greeting */}
            <span className="text-glass-muted text-sm font-medium tracking-tight">
              Hi, <span className="text-glass font-semibold">{user.name || user.email}</span>
            </span>

            {/* Logout Button */}
            <UiButton className="font-medium tracking-tight" onClick={handleLogout}>
              Logout
            </UiButton>
          </>
        ) : (
          <>
            {/* Login/Signup Buttons */}
            <UiButton className="font-medium tracking-tight" onClick={onShowLogin}>
              Login
            </UiButton>
            <UiButton className="font-medium tracking-tight" onClick={onShowSignup}>
              Sign Up
            </UiButton>
          </>
        )}
      </div>
    </nav>
  );
}
