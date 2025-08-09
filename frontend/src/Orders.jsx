import React, { useEffect, useState } from "react";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";

export default function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="glass p-8 rounded-xl text-center max-w-md mx-auto">
        <div className="text-6xl mb-6">🔐</div>
        <h2 className="heading-glass text-2xl font-bold mb-4">Sign in required</h2>
        <p className="text-glass-muted">Please log in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="heading-glass text-3xl font-bold tracking-tight">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-glass-muted">Loading orders...</p>
          </div>
        </div>
      ) : error ? (
        <div className="glass-subtle p-4 rounded-xl border border-red-300/30 text-center text-red-200">{error}</div>
      ) : orders.length === 0 ? (
        <div className="glass p-8 rounded-xl text-center max-w-md mx-auto">
          <div className="text-6xl mb-6">📭</div>
          <h2 className="heading-glass text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-glass-muted">Your orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <UiCard key={order._id} className="p-0">
              <div className="p-6 text-glass">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div className="font-display font-semibold tracking-tight">Order #{order._id.slice(-8)}</div>
                  <div className="flex gap-3 text-sm">
                    <span className="bg-blue-400/30 text-blue-100 px-3 py-1 rounded-full border border-blue-300/30">{order.status}</span>
                    {order.isPaid ? (
                      <span className="bg-green-400/30 text-green-100 px-3 py-1 rounded-full border border-green-300/30">Paid</span>
                    ) : (
                      <span className="bg-yellow-400/30 text-yellow-100 px-3 py-1 rounded-full border border-yellow-300/30">Unpaid</span>
                    )}
                    {order.isDelivered && <span className="bg-green-400/30 text-green-100 px-3 py-1 rounded-full border border-green-300/30">Delivered</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-glass-muted">Date</div>
                    <div>{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-glass-muted">Items</div>
                    <div>{order.orderItems.reduce((sum, it) => sum + it.quantity, 0)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-glass-muted">Total</div>
                    <div className="font-semibold">Rs.{order.totalPrice?.toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/20 pt-4">
                  <div className="text-glass-muted mb-2">Items</div>
                  <div className="space-y-2">
                    {order.orderItems.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {it.name} × {it.quantity}
                        </span>
                        <span>Rs.{(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {!order.isPaid && (
                  <div className="mt-4">
                    <UiButton
                      onClick={async () => {
                        try {
                          const res = await fetch(`http://localhost:5000/api/orders/${order._id}/pay`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ paymentResult: { id: "demo", status: "COMPLETED" } }),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || "Failed to mark as paid");
                          fetchOrders();
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                      color="success"
                    >
                      Mark as Paid (demo)
                    </UiButton>
                  </div>
                )}
              </div>
            </UiCard>
          ))}
        </div>
      )}
    </div>
  );
}
