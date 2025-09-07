import React, { useEffect, useState } from "react";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";
import UiDropdown from "./components/ui/UiDropdown";

export default function Orders({ token, user }) {
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
        <h1 className="heading-glass text-3xl font-bold tracking-tight">{user?.role === "staff" || user?.role === "admin" ? "All Orders" : "My Orders"}</h1>
        {(user?.role === "staff" || user?.role === "admin") && <p className="text-glass-muted mt-2">Viewing all orders in the system</p>}
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
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left py-4 px-6 text-glass font-semibold">Order ID</th>
                  {(user?.role === "staff" || user?.role === "admin") && <th className="text-left py-4 px-6 text-glass font-semibold">Customer</th>}
                  <th className="text-left py-4 px-6 text-glass font-semibold">Date</th>
                  <th className="text-left py-4 px-6 text-glass font-semibold">Items</th>
                  <th className="text-left py-4 px-6 text-glass font-semibold">Total</th>
                  <th className="text-left py-4 px-6 text-glass font-semibold">Status</th>
                  <th className="text-left py-4 px-6 text-glass font-semibold">Payment</th>
                  {(user?.role === "staff" || user?.role === "admin") && <th className="text-left py-4 px-6 text-glass font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-glass">
                      <div className="font-mono text-sm">#{order._id.slice(-8)}</div>
                    </td>
                    {(user?.role === "staff" || user?.role === "admin") && (
                      <td className="py-4 px-6 text-glass">
                        {order.user ? (
                          <div>
                            <div className="font-medium">{order.user.name}</div>
                            <div className="text-sm text-glass-muted">{order.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-glass-muted">Unknown</span>
                        )}
                      </td>
                    )}
                    <td className="py-4 px-6 text-glass">
                      <div className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-glass-muted">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-4 px-6 text-glass">
                      <div className="text-sm">{order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} items</div>
                      <div className="text-xs text-glass-muted">{order.orderItems.map((item) => item.name).join(", ")}</div>
                    </td>
                    <td className="py-4 px-6 text-glass">
                      <div className="font-semibold">Rs.{order.totalPrice?.toFixed(2)}</div>
                    </td>
                    <td className="py-4 px-6">
                      {user?.role === "staff" || user?.role === "admin" ? (
                        <UiDropdown
                          value={order.status}
                          onChange={async (newStatus) => {
                            try {
                              const res = await fetch(`http://localhost:5000/api/orders/${order._id}/status`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ status: newStatus }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || "Failed to update status");
                              fetchOrders();
                            } catch (err) {
                              alert(err.message);
                            }
                          }}
                          options={[
                            { value: "pending", label: "Pending", icon: "⏳" },
                            { value: "packing", label: "Packing", icon: "📦" },
                            { value: "on_delivery", label: "On Delivery", icon: "🚚" },
                            { value: "delivered", label: "Delivered", icon: "✅" },
                          ]}
                          color="primary"
                          className="min-w-[120px]"
                        />
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            order.status === "pending"
                              ? "bg-yellow-400/30 text-yellow-100 border-yellow-300/30"
                              : order.status === "packing"
                              ? "bg-blue-400/30 text-blue-100 border-blue-300/30"
                              : order.status === "on_delivery"
                              ? "bg-purple-400/30 text-purple-100 border-purple-300/30"
                              : order.status === "delivered"
                              ? "bg-green-400/30 text-green-100 border-green-300/30"
                              : "bg-red-400/30 text-red-100 border-red-300/30"
                          }`}
                        >
                          {order.status === "on_delivery" ? "On Delivery" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          order.isPaid ? "bg-green-400/30 text-green-100 border-green-300/30" : "bg-red-400/30 text-red-100 border-red-300/30"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    {(user?.role === "staff" || user?.role === "admin") && (
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          {!order.isPaid && (
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
                              className="text-xs px-3 py-1"
                            >
                              Mark Paid
                            </UiButton>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
