import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Home from "./Home";
import Cart from "./Cart";
import ManageProducts from "./ManageProducts";
import ManageUsers from "./ManageUsers";
import UiWishlist from "./components/ui/UiWishlist";
import UiOrderTracking from "./components/ui/UiOrderTracking";
import Checkout from "./Checkout";
import Orders from "./Orders";
import ProductDetails from "./ProductDetails";
import UiDialog from "./components/ui/UiDialog";
import UiButton from "./components/ui/UiButton";
import UiFooter from "./components/ui/UiFooter";
import UiNavBar from "./components/ui/UiNavBar";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [cart, setCart] = useState([]); // [{...product, quantity}]
  const [view, setView] = useState("home"); // 'home' | 'cart' | 'manageProducts' | 'manageUsers' | 'wishlist'
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

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

  // Checkout handler now routes to checkout view
  const handleCheckout = () => {
    setView("checkout");
  };

  // Prompt login/signup if not logged in
  const promptLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    setCart([]);
    setView("home");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }}></div>
      </div>

      <UiNavBar user={user} cart={cart} onViewChange={setView} onShowLogin={() => setShowLogin(true)} onShowSignup={() => setShowSignup(true)} onLogout={handleLogout} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 relative z-10">
        {view === "home" && (
          <Home
            onAddToCart={handleAddToCart}
            isLoggedIn={!!user}
            promptLogin={promptLogin}
            token={token}
            onOpenProduct={(product) => {
              setSelectedProductId(product._id);
              setView("product");
            }}
          />
        )}
        {view === "product" && (
          <ProductDetails productId={selectedProductId} onBack={() => setView("home")} onAddToCart={handleAddToCart} isLoggedIn={!!user} promptLogin={promptLogin} token={token} />
        )}
        {view === "cart" && <Cart cart={cart} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} isLoggedIn={!!user} promptLogin={promptLogin} />}
        {view === "checkout" && (
          <Checkout
            cart={cart}
            token={token}
            onOrderSuccess={() => {
              setCart([]);
              setView("orders");
            }}
          />
        )}
        {view === "orders" && <Orders token={token} />}
        {view === "wishlist" && user && <UiWishlist isLoggedIn={!!user} promptLogin={promptLogin} />}
        {view === "tracking" && <UiOrderTracking />}
        {view === "manageProducts" && user && user.role === "admin" && <ManageProducts token={token} />}
        {view === "manageUsers" && user && user.role === "admin" && <ManageUsers token={token} />}
        {/* If not admin, don't show admin pages */}
        {(view === "manageProducts" || view === "manageUsers") && (!user || user.role !== "admin") && (
          <div className="glass p-8 rounded-xl text-center max-w-md mx-auto mt-16">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="heading-glass text-3xl font-bold mb-4 tracking-tight">Access Denied</h2>
            <p className="text-glass-muted text-lg leading-relaxed">This page is restricted to administrators only.</p>
          </div>
        )}
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
