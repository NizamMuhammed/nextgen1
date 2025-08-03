import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Home from "./Home";
import Cart from "./Cart";
import AddProduct from "./AddProduct";
import ManageUsers from "./ManageUsers";
import UiDialog from "./components/ui/UiDialog";
import UiButton from "./components/ui/UiButton";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [cart, setCart] = useState([]); // [{...product, quantity}]
  const [view, setView] = useState("home"); // 'home' | 'cart' | 'addProduct' | 'manageUsers'
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
    <nav className="w-full flex justify-between items-center bg-white shadow p-4 mb-6">
      <div className="font-bold text-xl cursor-pointer" onClick={() => setView("home")}>
        NextGen Electronics
      </div>
      <div className="flex gap-4 items-center">
        <UiButton className="relative" onClick={() => setView("cart")}>
          Cart
          {cart.length > 0 && <span className="ml-1 bg-blue-600 text-white rounded-full px-2 text-xs">{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>}
        </UiButton>
        {user && user.role === "admin" && (
          <>
            <UiButton onClick={() => setView("addProduct")}>Add Product</UiButton>
            <UiButton onClick={() => setView("manageUsers")}>Manage Users</UiButton>
          </>
        )}
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.name || user.email}</span>
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
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-4xl mx-auto">
        {view === "home" && <Home onAddToCart={handleAddToCart} isLoggedIn={!!user} promptLogin={promptLogin} />}
        {view === "cart" && <Cart cart={cart} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} isLoggedIn={!!user} promptLogin={promptLogin} />}
        {view === "addProduct" && user && user.role === "admin" && <AddProduct token={token} />}
        {view === "manageUsers" && user && user.role === "admin" && <ManageUsers token={token} />}
        {/* If not admin, don't show admin pages */}
        {(view === "addProduct" || view === "manageUsers") && (!user || user.role !== "admin") && <div className="p-6 text-red-500">Access denied. Admins only.</div>}
      </div>
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
    </div>
  );
}

export default App;
