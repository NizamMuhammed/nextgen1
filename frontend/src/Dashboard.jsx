import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UiCard from "./components/ui/UiCard";
import UiButton from "./components/ui/UiButton";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const statsResponse = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent orders
      const ordersResponse = await fetch("http://localhost:5000/api/admin/recent-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData);
      }

      // Fetch recent users
      const usersResponse = await fetch("http://localhost:5000/api/admin/recent-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setRecentUsers(usersData);
      }

      // Fetch recent products
      const productsResponse = await fetch("http://localhost:5000/api/admin/recent-products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setRecentProducts(productsData);
      }

      // Fetch low stock products
      const lowStockResponse = await fetch("http://localhost:5000/api/admin/low-stock-products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (lowStockResponse.ok) {
        const lowStockData = await lowStockResponse.json();
        setLowStockProducts(lowStockData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-glass text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-glass text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-glass-muted mb-4">{error}</p>
          <UiButton onClick={fetchDashboardData} className="btn-glass-primary">
            Try Again
          </UiButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="heading-glass-xl mb-2">Admin Dashboard</h1>
        <p className="text-glass-muted text-lg">Overview of your NextGen Electronics store</p>
        <div className="mt-4">
          <UiButton onClick={fetchDashboardData} className="btn-glass-primary" disabled={loading}>
            {loading ? "Refreshing..." : "🔄 Refresh Data"}
          </UiButton>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UiCard className="text-center p-6">
          <div className="text-4xl mb-2">👥</div>
          <h3 className="text-glass font-semibold text-lg mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.totalUsers}</p>
        </UiCard>

        <UiCard className="text-center p-6">
          <div className="text-4xl mb-2">📦</div>
          <h3 className="text-glass font-semibold text-lg mb-1">Total Products</h3>
          <p className="text-3xl font-bold text-green-400">{stats.totalProducts}</p>
        </UiCard>

        <UiCard className="text-center p-6">
          <div className="text-4xl mb-2">📋</div>
          <h3 className="text-glass font-semibold text-lg mb-1">Total Orders</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.totalOrders}</p>
        </UiCard>

        <UiCard className="text-center p-6">
          <div className="text-4xl mb-2">💰</div>
          <h3 className="text-glass font-semibold text-lg mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-yellow-400">{formatCurrency(stats.totalRevenue)}</p>
        </UiCard>

        <UiCard className="text-center p-6">
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-glass font-semibold text-lg mb-1">Pending Orders</h3>
          <p className="text-3xl font-bold text-orange-400">{stats.pendingOrders}</p>
        </UiCard>

        <UiCard className="text-center p-6">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="text-glass font-semibold text-lg mb-1">Completed Orders</h3>
          <p className="text-3xl font-bold text-green-400">{stats.completedOrders}</p>
        </UiCard>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <UiCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-glass font-semibold text-lg">Recent Orders</h3>
            <UiButton className="text-sm px-3 py-1" onClick={() => navigate("/staff-orders")}>
              View All
            </UiButton>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-glass font-medium">Order #{order.orderNumber}</p>
                    <p className="text-glass-muted text-sm">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-glass font-semibold">{formatCurrency(order.totalAmount)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "completed" ? "bg-green-400/20 text-green-300" : order.status === "pending" ? "bg-yellow-400/20 text-yellow-300" : "bg-blue-400/20 text-blue-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-glass-muted">No orders found</p>
              </div>
            )}
          </div>
        </UiCard>

        {/* Recent Users */}
        <UiCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-glass font-semibold text-lg">Recent Users</h3>
            <UiButton className="text-sm px-3 py-1" onClick={() => navigate("/manage-users")}>
              View All
            </UiButton>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-glass font-medium">{user.name || user.email}</p>
                    <p className="text-glass-muted text-sm">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-glass-muted text-sm">{formatDate(user.createdAt)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "admin" ? "bg-purple-400/20 text-purple-300" : user.role === "staff" ? "bg-blue-400/20 text-blue-300" : "bg-green-400/20 text-green-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-glass-muted">No users found</p>
              </div>
            )}
          </div>
        </UiCard>
      </div>

      {/* Recent Products */}
      <UiCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-glass font-semibold text-lg">Recent Products</h3>
          <UiButton className="text-sm px-3 py-1" onClick={() => navigate("/manage-products")}>
            View All
          </UiButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProducts.length > 0 ? (
            recentProducts.slice(0, 6).map((product) => (
              <div key={product._id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  {product.image && <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />}
                  <div className="flex-1">
                    <p className="text-glass font-medium line-clamp-2">{product.name}</p>
                    <p className="text-glass-muted text-sm">{formatCurrency(product.price)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-glass-muted">No products found</p>
            </div>
          )}
        </div>
      </UiCard>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <UiCard className="p-6 border-l-4 border-orange-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-glass font-semibold text-lg">⚠️ Low Stock Alert</h3>
            <UiButton className="text-sm px-3 py-1" onClick={() => navigate("/manage-products")}>
              Manage Stock
            </UiButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div key={product._id} className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/20">
                <div className="flex items-center space-x-3">
                  {product.image && <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />}
                  <div className="flex-1">
                    <p className="text-glass font-medium line-clamp-2">{product.name}</p>
                    <p className="text-orange-300 text-sm font-semibold">Stock: {product.stock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </UiCard>
      )}

      {/* Quick Actions */}
      <UiCard className="p-6">
        <h3 className="text-glass font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <UiButton className="w-full py-3" onClick={() => navigate("/manage-products")}>
            📦 Manage Products
          </UiButton>
          <UiButton className="w-full py-3" onClick={() => navigate("/manage-users")}>
            👥 Manage Users
          </UiButton>
          <UiButton className="w-full py-3" onClick={() => navigate("/orders")}>
            📋 View Orders
          </UiButton>
          <UiButton className="w-full py-3" onClick={() => navigate("/add-product")}>
            ➕ Add Product
          </UiButton>
        </div>
      </UiCard>
    </div>
  );
}
