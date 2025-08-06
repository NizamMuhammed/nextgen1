import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Home from "./Home";
import Cart from "./Cart";
import ManageProducts from "./ManageProducts";
import ManageUsers from "./ManageUsers";
import UiWishlist from "./components/ui/UiWishlist";
import UiOrderTracking from "./components/ui/UiOrderTracking";
import UiDialog from "./components/ui/UiDialog";
import UiButton from "./components/ui/UiButton";
import UiFooter from "./components/ui/UiFooter";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [cart, setCart] = useState([]); // [{...product, quantity}]
  const [view, setView] = useState("home"); // 'home' | 'cart' | 'manageProducts' | 'manageUsers' | 'wishlist'
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Add to cart handler
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove from cart handler
  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // Checkout handler (dummy)
  const handleCheckout = () => {
    alert("Checkout successful! (not implemented)");
    setCart([]);
  };

  // Prompt login/signup if not logged in
  const promptLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  // Navigation bar
  const NavBar = () => (
    <nav className="w-full flex justify-between items-center bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="font-bold text-xl cursor-pointer text-blue-600" onClick={() => setView("home")}>
        NextGen Electronics
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <UiButton className="relative" onClick={() => setView("cart")}>
          Cart
          {cart.length > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-2 text-xs">{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>}
        </UiButton>
        {user && <UiButton onClick={() => setView("wishlist")}>Wishlist</UiButton>}
        <UiButton onClick={() => setView("tracking")}>Track Order</UiButton>
        {user && user.role === "admin" && (
          <>
            <UiButton onClick={() => setView("manageProducts")}>Manage Products</UiButton>
            <UiButton onClick={() => setView("manageUsers")}>Manage Users</UiButton>
          </>
        )}
        {user ? (
          <>
            <span className="text-gray-700 text-sm">Hi, {user.name || user.email}</span>
            <UiButton
              onClick={() => {
                setUser(null);
                setToken("");
                localStorage.removeItem("token");
                setCart([]);
                setView("home");
              }}
            >
              Logout
            </UiButton>
          </>
        ) : (
          <>
            <UiButton onClick={() => setShowLogin(true)}>Login</UiButton>
            <UiButton onClick={() => setShowSignup(true)}>Sign Up</UiButton>
          </>
        )}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {view === "home" && <Home onAddToCart={handleAddToCart} isLoggedIn={!!user} promptLogin={promptLogin} />}
        {view === "cart" && <Cart cart={cart} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} isLoggedIn={!!user} promptLogin={promptLogin} />}
        {view === "wishlist" && user && <UiWishlist isLoggedIn={!!user} promptLogin={promptLogin} />}
        {view === "tracking" && <UiOrderTracking />}
        {view === "manageProducts" && user && user.role === "admin" && <ManageProducts token={token} />}
        {view === "manageUsers" && user && user.role === "admin" && <ManageUsers token={token} />}
        {/* If not admin, don't show admin pages */}
        {(view === "manageProducts" || view === "manageUsers") && (!user || user.role !== "admin") && <div className="p-6 text-red-500">Access denied. Admins only.</div>}
      </main>

      <UiDialog open={showLogin} onClose={() => setShowLogin(false)} title="Log In">
        <LoginForm
          onLogin={(data) => {
            setUser(data.user || data);
            if (data.token) {
              setToken(data.token);
              localStorage.setItem("token", data.token);
            }
            setShowLogin(false);
          }}
          switchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      </UiDialog>
      <UiDialog open={showSignup} onClose={() => setShowSignup(false)} title="Sign Up">
        <SignupForm
          onSignup={(data) => {
            setUser(data.user || data);
            if (data.token) {
              setToken(data.token);
              localStorage.setItem("token", data.token);
            }
            setShowSignup(false);
          }}
          switchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      </UiDialog>

      {/* Footer */}
      <UiFooter />
    </div>
  );
}

export default App;
