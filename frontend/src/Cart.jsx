import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";
import UiToast from "./components/ui/UiToast";

export default function Cart({ cart, onRemove, isLoggedIn, promptLogin }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleRemove = async (id) => {
    setIsRemoving(true);
    setRemovingId(id);

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      onRemove(id);
      setToastMessage("Item removed from cart");
      setToastType("success");
      setShowToast(true);
      setAnimationKey((prev) => prev + 1);
    } catch (error) {
      setToastMessage("Failed to remove item");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsRemoving(false);
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      promptLogin();
      return;
    }

    setIsCheckingOut(true);

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      navigate("/checkout");
    } catch (error) {
      setToastMessage("Failed to proceed to checkout");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Loading skeleton components
  const CartItemSkeleton = () => (
    <div className="glass-subtle rounded-xl p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="rounded-lg bg-white/20 h-16 w-16"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/20 rounded w-1/2"></div>
          <div className="h-3 bg-white/20 rounded w-1/3"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-white/20 rounded w-20"></div>
          <div className="h-8 bg-white/20 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  const SummarySkeleton = () => (
    <div className="glass rounded-xl shadow-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-white/20 rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-white/20 rounded w-full"></div>
          <div className="h-4 bg-white/20 rounded w-full"></div>
          <div className="h-6 bg-white/20 rounded w-1/2"></div>
        </div>
        <div className="h-12 bg-white/20 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold heading-glass-xl mb-2">Your Shopping Cart</h1>
          <p className="text-glass-muted text-lg">Review your items and proceed to checkout</p>
        </div>

        {/* Toast Notification */}
        {showToast && <UiToast message={toastMessage} type={toastType} visible={showToast} onClose={() => setShowToast(false)} />}

        {cart.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center glass-strong rounded-2xl p-8 max-w-md mx-auto">
              <div className="glass-subtle rounded-2xl p-6 mb-6 mx-auto w-fit">
                <svg className="h-16 w-16 text-white/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-glass mb-4">Your cart is empty</h3>
              <p className="text-glass-muted text-lg mb-6">Add some products to get started with your shopping!</p>
              <UiButton variant="contained" color="primary" onClick={() => navigate("/")} className="px-8 py-3">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Start Shopping
              </UiButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <UiCard variant="strong">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
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
                    <h2 className="text-xl font-semibold text-glass">Cart Items ({cart.length})</h2>
                  </div>
                </div>

                <div className="space-y-3" key={animationKey}>
                  {cart.map((item, index) => (
                    <div
                      key={item._id}
                      className={`glass-subtle rounded-xl p-4 hover:glass transition-all duration-300 transform hover:scale-[1.02] ${removingId === item._id ? "opacity-50 scale-95" : ""}`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: "fadeInUp 0.5s ease-out forwards",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center border border-white/20">
                              <svg className="w-8 h-8 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-glass truncate">{item.name}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">{item.brand}</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-semibold text-glass">Rs.{item.price} each</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-glass">Rs.{(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-xs text-glass-muted font-medium">Total</div>
                          </div>
                          <UiButton variant="outlined" color="error" size="small" onClick={() => handleRemove(item._id)} disabled={isRemoving} className="min-w-[80px]">
                            {removingId === item._id ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Removing...
                              </div>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Remove
                              </>
                            )}
                          </UiButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </UiCard>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <UiCard variant="strong" className="h-fit">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 glass-subtle rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-glass">Order Summary</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/20">
                    <span className="text-glass-muted font-medium">Subtotal ({cart.length} items)</span>
                    <span className="font-semibold text-glass">Rs.{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/20">
                    <span className="text-glass-muted font-medium">Shipping</span>
                    <span className="font-semibold text-green-300">Free</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-lg font-semibold text-glass">Total</span>
                    <span className="text-2xl font-bold text-glass">Rs.{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <UiButton variant="contained" color="success" onClick={handleCheckout} fullWidth size="large" disabled={isCheckingOut} className="py-3 text-lg">
                    {isCheckingOut ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : isLoggedIn ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Proceed to Checkout
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login to Checkout
                      </>
                    )}
                  </UiButton>

                  <UiButton variant="outlined" color="secondary" onClick={() => navigate("/")} fullWidth className="py-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Continue Shopping
                  </UiButton>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-2 text-sm text-glass-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </UiCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
