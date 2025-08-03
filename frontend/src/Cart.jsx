import React from "react";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";

export default function Cart({ cart, onRemove, onCheckout, isLoggedIn, promptLogin }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <UiCard className="text-center text-gray-500">Your cart is empty.</UiCard>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {cart.map((item) => (
            <UiCard key={item._id} className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <span className="font-semibold">{item.name}</span> x {item.quantity}
              </div>
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <span className="font-bold text-lg">${item.price * item.quantity}</span>
                <UiButton variant="outlined" color="error" onClick={() => onRemove(item._id)}>
                  Remove
                </UiButton>
              </div>
            </UiCard>
          ))}
          <div className="flex justify-between items-center mt-6">
            <span className="font-bold text-xl">Total: ${total.toFixed(2)}</span>
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
              size="large"
            >
              Checkout
            </UiButton>
          </div>
        </div>
      )}
    </div>
  );
}
