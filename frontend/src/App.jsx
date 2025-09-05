import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Home from "./Home";
import Cart from "./Cart";
import ManageProducts from "./ManageProducts";
import ManageUsers from "./ManageUsers";
import StaffOrders from "./StaffOrders";
import Dashboard from "./Dashboard";
import UiWishlist from "./components/ui/UiWishlist";
import UiOrderTracking from "./components/ui/UiOrderTracking";
import Checkout from "./Checkout";
import Orders from "./Orders";
import ProductDetails from "./ProductDetails";
import Search from "./Search";
import UserSettings from "./UserSettings";
import UiDialog from "./components/ui/UiDialog";
import UiButton from "./components/ui/UiButton";
import UiFooter from "./components/ui/UiFooter";
import UiNavBar from "./components/ui/UiNavBar";
import UiToast from "./components/ui/UiToast";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [cart, setCart] = useState([]); // [{...product, quantity}]
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [productRefreshTrigger, setProductRefreshTrigger] = useState(0); // Trigger for product refreshes
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Check token and fetch user data on app initialization
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await fetch("http://localhost:5000/api/users/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("token");
            setToken("");
            setUser(null);
          }
        } catch (err) {
          console.error("Failed to verify token:", err);
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Add to cart handler
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        const updatedCart = prev.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
        setToast({ show: true, message: `${product.name} quantity updated in cart`, type: "success" });
        return updatedCart;
      } else {
        const updatedCart = [...prev, { ...product, quantity: 1 }];
        setToast({ show: true, message: `${product.name} added to cart`, type: "success" });
        return updatedCart;
      }
    });
  };

  // Remove from cart handler
  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // Clear cart handler
  const handleClearCart = () => {
    setCart([]);
  };

  // Refresh products handler (to be called after order completion)
  const handleRefreshProducts = () => {
    // Increment the trigger to cause child components to refresh
    setProductRefreshTrigger((prev) => prev + 1);
    console.log("Product refresh triggered");
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
  };

  // Protected Route component for admin pages
  const ProtectedRoute = ({ children, adminOnly = false, staffOrAdmin = false }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    if (adminOnly && user.role !== "admin") {
      return (
        <div className="glass p-8 rounded-xl text-center max-w-md mx-auto mt-16">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="heading-glass text-3xl font-bold mb-4 tracking-tight">Access Denied</h2>
          <p className="text-glass-muted text-lg leading-relaxed">This page is restricted to administrators only.</p>
        </div>
      );
    }
    if (staffOrAdmin && user.role !== "staff" && user.role !== "admin") {
      return (
        <div className="glass p-8 rounded-xl text-center max-w-md mx-auto mt-16">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="heading-glass text-3xl font-bold mb-4 tracking-tight">Access Denied</h2>
          <p className="text-glass-muted text-lg leading-relaxed">This page is restricted to staff and administrators only.</p>
        </div>
      );
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }}></div>
        </div>

        <UiNavBar user={user} cart={cart} onShowLogin={() => setShowLogin(true)} onShowSignup={() => setShowSignup(true)} onLogout={handleLogout} />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 relative z-10">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} isLoggedIn={!!user} promptLogin={promptLogin} token={token} refreshTrigger={productRefreshTrigger} />} />
            <Route path="/search" element={<Search onAddToCart={handleAddToCart} isLoggedIn={!!user} promptLogin={promptLogin} refreshTrigger={productRefreshTrigger} />} />
            <Route
              path="/product/:productId"
              element={<ProductDetails onAddToCart={handleAddToCart} isLoggedIn={!!user} promptLogin={promptLogin} token={token} refreshTrigger={productRefreshTrigger} />}
            />
            <Route path="/cart" element={<Cart cart={cart} onRemove={handleRemoveFromCart} isLoggedIn={!!user} promptLogin={promptLogin} />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout cart={cart} token={token} onClearCart={handleClearCart} onRefreshProducts={handleRefreshProducts} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders token={token} user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-orders"
              element={
                <ProtectedRoute staffOrAdmin={true}>
                  <StaffOrders token={token} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <UiWishlist isLoggedIn={!!user} promptLogin={promptLogin} token={token} onAddToCart={handleAddToCart} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <UserSettings token={token} user={user} />
                </ProtectedRoute>
              }
            />
            <Route path="/tracking" element={<UiOrderTracking />} />
            <Route
              path="/manage-products"
              element={
                <ProtectedRoute staffOrAdmin={true}>
                  <ManageProducts token={token} user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute staffOrAdmin={true}>
                  <ManageUsers token={token} user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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

        {/* Toast Notification */}
        <UiToast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: "success" })} />
      </div>
    </Router>
  );
}

export default App;
