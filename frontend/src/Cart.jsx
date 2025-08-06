import React from "react";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";

export default function Cart({ cart, onRemove, onCheckout, isLoggedIn, promptLogin }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
        <p className="text-gray-600 text-lg">Review your items and proceed to checkout</p>
      </div>

      {cart.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-700">Your cart is empty</h3>
            <p className="text-gray-600">Add some products to get started!</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Cart Items ({cart.length})</h2>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-900 mb-1">{item.name}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">{item.brand}</span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Qty: {item.quantity}</span>
                          <span className="font-medium text-blue-600">${item.price} each</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="font-bold text-xl text-blue-700">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">Total</div>
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-700">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <UiButton
                variant="contained"
                color="success"
                onClick={() => {
                  if (!isLoggedIn) {
                    promptLogin();
                  } else {
                    onCheckout();
                  }
                }}
                fullWidth
                size="large"
                className="py-3 text-lg"
              >
                {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
              </UiButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
