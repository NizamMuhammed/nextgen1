import React, { useMemo, useState } from "react";
import UiCard from "./components/ui/UiCard";
import UiTextField from "./components/ui/UiTextField";
import UiButton from "./components/ui/UiButton";

export default function Checkout({ cart, token, onOrderSuccess }) {
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const totals = useMemo(() => {
    const itemsPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const taxPrice = +(itemsPrice * 0.1).toFixed(2); // 10% tax (example)
    const shippingPrice = itemsPrice > 200 ? 0 : 10; // Free shipping over $200
    const totalPrice = +(itemsPrice + taxPrice + shippingPrice).toFixed(2);
    return { itemsPrice, taxPrice, shippingPrice, totalPrice };
  }, [cart]);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!token) {
      setError("Please log in to place an order.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity || 1,
        price: item.price,
      }));

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: shipping,
          paymentMethod,
          itemsPrice: totals.itemsPrice,
          taxPrice: totals.taxPrice,
          shippingPrice: totals.shippingPrice,
          totalPrice: totals.totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");
      setSuccess("Order placed successfully!");
      onOrderSuccess && onOrderSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-2">
        <h1 className="heading-glass text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-glass-muted">Provide shipping details and confirm your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipping & Payment */}
        <UiCard className="lg:col-span-2">
          <form onSubmit={submitOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiTextField label="Full Name" name="fullName" value={shipping.fullName} onChange={handleChange} required />
              <UiTextField label="Phone" name="phone" value={shipping.phone} onChange={handleChange} />
            </div>
            <UiTextField label="Address" name="address" value={shipping.address} onChange={handleChange} required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UiTextField label="City" name="city" value={shipping.city} onChange={handleChange} required />
              <UiTextField label="Postal Code" name="postalCode" value={shipping.postalCode} onChange={handleChange} required />
              <UiTextField label="Country" name="country" value={shipping.country} onChange={handleChange} required />
            </div>

            {/* Payment */}
            <div>
              <label className="block text-sm font-medium text-glass-muted mb-2">Payment Method</label>
              <select
                className="input-glass rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-glass"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option className="bg-gray-800 text-white" value="Cash on Delivery">
                  Cash on Delivery
                </option>
                <option className="bg-gray-800 text-white" value="Credit Card">
                  Credit Card (mock)
                </option>
                <option className="bg-gray-800 text-white" value="Stripe">
                  Stripe (mock)
                </option>
                <option className="bg-gray-800 text-white" value="PayPal">
                  PayPal (mock)
                </option>
              </select>
            </div>

            {error && (
              <div className="glass-subtle p-3 rounded-lg border border-red-300/30">
                <div className="text-red-200 text-sm text-center">{error}</div>
              </div>
            )}
            {success && (
              <div className="glass-subtle p-3 rounded-lg border border-green-300/30">
                <div className="text-green-200 text-sm text-center">{success}</div>
              </div>
            )}

            <UiButton type="submit" variant="contained" color="success" size="large" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </UiButton>
          </form>
        </UiCard>

        {/* Order Summary */}
        <UiCard>
          <div className="space-y-4">
            <h2 className="heading-glass text-xl font-semibold tracking-tight">Order Summary</h2>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-glass-muted">
                    {item.name} × {item.quantity || 1}
                  </span>
                  <span className="text-glass">Rs.{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-glass-muted">Items</span>
                <span className="text-glass">Rs.{totals.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-glass-muted">Tax (10%)</span>
                <span className="text-glass">Rs.{totals.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-glass-muted">Shipping</span>
                <span className="text-glass">Rs.{totals.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg pt-2">
                <span className="heading-glass">Total</span>
                <span className="text-glass font-bold">Rs.{totals.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  );
}
