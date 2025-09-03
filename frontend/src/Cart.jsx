import React from "react";
import { useNavigate } from "react-router-dom";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";

export default function Cart({ cart, onRemove, isLoggedIn, promptLogin }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      promptLogin();
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="heading-glass-xl text-4xl md:text-5xl font-bold mb-4 tracking-tight">Your Shopping Cart</h1>
        <p className="text-glass-muted text-xl leading-relaxed tracking-tight">Review your items and proceed to checkout</p>
      </div>

      {cart.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center glass p-8 rounded-xl max-w-md">
            <div className="text-6xl mb-6">🛒</div>
            <h3 className="heading-glass text-3xl font-bold mb-4 tracking-tight">Your cart is empty</h3>
            <p className="text-glass-muted text-lg leading-relaxed">Add some products to get started with your shopping!</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cart Items */}
          <div className="glass rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 glass-subtle rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <h2 className="heading-glass text-xl font-semibold tracking-tight">Cart Items ({cart.length})</h2>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="glass-subtle border border-white/20 rounded-lg p-4 hover:glass transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 glass-subtle rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-glass-muted" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-semibold text-lg text-glass mb-2 tracking-tight">{item.name}</div>
                        <div className="text-sm mb-3 flex flex-wrap gap-2">
                          <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-300/30">{item.brand}</span>
                          <span className="bg-purple-400/30 text-purple-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-purple-300/30">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="bg-green-400/30 text-green-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-green-300/30">Qty: {item.quantity}</span>
                          <span className="font-semibold text-glass mono-glass">Rs.{item.price} each</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="font-display font-bold text-xl text-glass tracking-tight">Rs.{(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-glass-muted font-medium">Total</div>
                      </div>
                      <UiButton variant="outlined" color="error" size="small" onClick={() => onRemove(item._id)}>
                        Remove
                      </UiButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 glass-subtle rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="heading-glass text-xl font-semibold tracking-tight">Order Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-glass-muted font-medium tracking-tight">Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-glass mono-glass">Rs.{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-glass-muted font-medium tracking-tight">Shipping</span>
                <span className="font-semibold text-green-200">Free</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="heading-glass text-lg font-semibold tracking-tight">Total</span>
                <span className="font-display text-2xl font-bold text-glass tracking-tight">Rs.{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <UiButton variant="contained" color="success" onClick={handleCheckout} fullWidth size="large" className="py-3 text-lg">
                {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
              </UiButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
