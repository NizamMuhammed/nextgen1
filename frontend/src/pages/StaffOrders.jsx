import React, { useEffect, useState } from "react";
import UiCard from "../components/ui/UiCard";
import UiButton from "../components/ui/UiButton";

export default function StaffOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    isPaid: "",
    isDelivered: "",
    status: "",
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.isPaid !== "") queryParams.append("isPaid", filters.isPaid);
      if (filters.isDelivered !== "") queryParams.append("isDelivered", filters.isDelivered);
      if (filters.status !== "") queryParams.append("status", filters.status);

      const url = `http://localhost:5000/api/orders/staff${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const res = await fetch(url, {
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
  }, [token, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusUpdate = async (orderId, field, value) => {
    try {
      const updateData = {};
      if (field === "isPaid") {
        updateData.isPaid = value;
        if (value) updateData.paidAt = new Date();
      } else if (field === "isDelivered") {
        updateData.isDelivered = value;
        if (value) updateData.deliveredAt = new Date();
      } else if (field === "status") {
        updateData.status = value;
      }

      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update order");
      }

      // Refresh orders after update
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-400/30 text-yellow-100 border-yellow-300/30",
      processing: "bg-blue-400/30 text-blue-100 border-blue-300/30",
      shipped: "bg-purple-400/30 text-purple-100 border-purple-300/30",
      delivered: "bg-green-400/30 text-green-100 border-green-300/30",
      cancelled: "bg-red-400/30 text-red-100 border-red-300/30",
    };
    return colors[status] || colors.pending;
  };

  if (!token) {
    return (
      <div className="glass p-8 rounded-xl text-center max-w-md mx-auto">
        <div className="text-6xl mb-6">🔐</div>
        <h2 className="heading-glass text-2xl font-bold mb-4">Sign in required</h2>
        <p className="text-glass-muted">Please log in to view orders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="heading-glass text-3xl font-bold tracking-tight">Staff Order Management</h1>
        <p className="text-glass-muted mt-2">View and manage all orders with filtering options</p>
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-xl shadow-lg">
        <h3 className="heading-glass text-lg font-semibold mb-4">Filter Orders</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-glass-muted mb-2">Payment Status</label>
            <select
              value={filters.isPaid}
              onChange={(e) => handleFilterChange("isPaid", e.target.value)}
              className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Payment Status</option>
              <option value="true">Paid Only</option>
              <option value="false">Unpaid Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-glass-muted mb-2">Delivery Status</label>
            <select
              value={filters.isDelivered}
              onChange={(e) => handleFilterChange("isDelivered", e.target.value)}
              className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Delivery Status</option>
              <option value="true">Delivered Only</option>
              <option value="false">Not Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-glass-muted mb-2">Order Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="input-glass w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Order Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
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
          <h2 className="heading-glass text-2xl font-bold mb-4">No orders found</h2>
          <p className="text-glass-muted">No orders match the current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <UiCard key={order._id} className="p-0">
              <div className="p-6 text-glass">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div className="font-display font-semibold tracking-tight">Order #{order.orderNumber || order._id.slice(-8)}</div>
                  <div className="flex gap-3 text-sm">
                    <span className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>{order.status}</span>
                    {order.isPaid ? (
                      <span className="bg-green-400/30 text-green-100 px-3 py-1 rounded-full border border-green-300/30">Paid</span>
                    ) : (
                      <span className="bg-yellow-400/30 text-yellow-100 px-3 py-1 rounded-full border border-yellow-300/30">Unpaid</span>
                    )}
                    {order.isDelivered && <span className="bg-green-400/30 text-green-100 px-3 py-1 rounded-full border border-green-300/30">Delivered</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="space-y-1">
                    <div className="text-glass-muted">Customer</div>
                    <div className="font-medium">{order.user?.name || "Unknown"}</div>
                    <div className="text-xs text-glass-muted">{order.user?.email || "No email"}</div>
                  </div>
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

                {/* Staff Actions */}
                <div className="mt-6 border-t border-white/20 pt-4">
                  <div className="text-glass-muted mb-3">Staff Actions</div>
                  <div className="flex flex-wrap gap-2">
                    {!order.isPaid && (
                      <UiButton onClick={() => handleStatusUpdate(order._id, "isPaid", true)} color="success" size="small">
                        Mark as Paid
                      </UiButton>
                    )}

                    {!order.isDelivered && (
                      <UiButton onClick={() => handleStatusUpdate(order._id, "isDelivered", true)} color="primary" size="small">
                        Mark as Delivered
                      </UiButton>
                    )}

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, "status", e.target.value)}
                      className="input-glass px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </UiCard>
          ))}
        </div>
      )}
    </div>
  );
}
