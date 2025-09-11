import React, { useEffect, useState } from "react";
import UiCard from "../components/ui/UiCard";
import UiTextField from "../components/ui/UiTextField";
import UiButton from "../components/ui/UiButton";
import UIValidation from "../components/ui/UIValidation";
import { AiOutlineUserAdd } from "react-icons/ai";

export default function ManageUsers({ token, user: currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "customer" });
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Please enter the user's full name.";
    } else if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    }

    if (!form.username.trim()) {
      errors.username = "Please enter a username.";
    } else if (form.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters long.";
    }

    if (!form.email.trim()) {
      errors.email = "Please enter an email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!editingId && !form.password) {
      errors.password = "Please enter a password for new users.";
    } else if (form.password && form.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    if (!form.role) {
      errors.role = "Please select a user role.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      let res, data;
      if (editingId) {
        res = await fetch(`http://localhost:5000/api/users/${editingId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      }
      data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save user");
      setSuccess(editingId ? "User updated successfully!" : "User added successfully!");
      setForm({ name: "", username: "", email: "", password: "", role: "customer" });
      setEditingId(null);
      setValidationErrors({});
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, username: user.username, email: user.email, password: "", role: user.role });
    setEditingId(user._id);
    setValidationErrors({});
    setShowForm(true);
    setSuccess(null);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      setSuccess("User deleted!");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm({ name: "", username: "", email: "", password: "", role: "customer" });
    setEditingId(null);
    setValidationErrors({});
    setShowForm(false);
    setSuccess(null);
    setError(null);
  };

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Loading skeleton component
  const UserSkeleton = () => (
    <div className="glass-subtle rounded-xl p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-white/20 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/20 rounded w-1/2"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-white/20 rounded w-16"></div>
          <div className="h-8 bg-white/20 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold heading-glass-xl mb-2">User Management</h1>
          <p className="text-glass-muted text-lg">Manage user accounts, roles, and permissions</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="glass-strong rounded-2xl p-4 mb-6 border border-green-400/30">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-glass">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-strong rounded-2xl p-4 mb-6 border border-red-400/30">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-glass">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Form Section */}
          <div className="lg:col-span-1">
            <UiCard variant="strong" className="h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-glass">{editingId ? "Edit User" : "Add New User"}</h2>
                {!showForm && !editingId && (
                  <UiButton variant="contained" color="primary" size="small" onClick={() => setShowForm(true)}>
                    <AiOutlineUserAdd size={40} />
                  </UiButton>
                )}
              </div>

              {(showForm || editingId) && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <UiTextField label="Full Name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter full name" />
                      <UIValidation message={validationErrors.name} position="top" type="error" visible={!!validationErrors.name} />
                    </div>

                    <div className="relative">
                      <UiTextField label="Username" name="username" value={form.username} onChange={handleChange} required placeholder="Enter username" />
                      <UIValidation message={validationErrors.username} position="top" type="error" visible={!!validationErrors.username} />
                    </div>

                    <div className="relative">
                      <UiTextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter email address" />
                      <UIValidation message={validationErrors.email} position="top" type="error" visible={!!validationErrors.email} />
                    </div>

                    <div className="relative">
                      <UiTextField
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required={!editingId}
                        placeholder={editingId ? "Leave blank to keep current" : "Enter password"}
                      />
                      <UIValidation message={validationErrors.password} position="top" type="error" visible={!!validationErrors.password} />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-glass-muted mb-2">
                        Role <span className="text-red-300">*</span>
                      </label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full input-glass rounded-xl px-4 py-3 text-glass focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                        required
                      >
                        <option value="">Select a role</option>
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        {currentUser?.role === "admin" && <option value="admin">Admin</option>}
                      </select>
                      <UIValidation message={validationErrors.role} position="top" type="error" visible={!!validationErrors.role} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingId ? "Updating..." : "Adding..."}
                        </div>
                      ) : editingId ? (
                        "Update User"
                      ) : (
                        "Add User"
                      )}
                    </UiButton>
                    <UiButton type="button" variant="outlined" color="secondary" onClick={resetForm} disabled={isSubmitting}>
                      Cancel
                    </UiButton>
                  </div>
                </form>
              )}
            </UiCard>
          </div>

          {/* Users List Section */}
          <div className="lg:col-span-2">
            <UiCard variant="strong">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-glass">All Users</h2>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-glass rounded-xl pl-10 pr-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                    />
                  </div>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="input-glass rounded-xl px-4 py-2 text-glass focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                  >
                    <option value="all">All Roles</option>
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <UserSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="glass-subtle rounded-2xl p-8 mx-auto max-w-sm">
                      <svg className="mx-auto h-12 w-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      <h3 className="mt-4 text-sm font-medium text-glass">No users found</h3>
                      <p className="mt-2 text-sm text-glass-muted">{searchTerm || roleFilter !== "all" ? "Try adjusting your search or filter criteria." : "Get started by adding a new user."}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user._id} className="glass-subtle rounded-xl p-4 hover:glass transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-glass truncate">{user.name}</p>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.role === "admin"
                                      ? "bg-red-500/20 text-red-300 border border-red-400/30"
                                      : user.role === "staff"
                                      ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                                      : "bg-green-500/20 text-green-300 border border-green-400/30"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </div>
                              <p className="text-sm text-glass-muted truncate">@{user.username}</p>
                              <p className="text-sm text-white/60 truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <UiButton
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => handleEdit(user)}
                              className="min-w-[80px]"
                              disabled={currentUser?.role === "staff" && user.role === "admin"}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </UiButton>
                            {currentUser?.role === "admin" && (
                              <UiButton variant="outlined" color="error" size="small" onClick={() => handleDelete(user._id)} className="min-w-[80px]">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </UiButton>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Results Summary */}
              {!loading && filteredUsers.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="glass-subtle rounded-xl p-3 text-center">
                    <p className="text-sm text-glass-muted">
                      Showing {filteredUsers.length} of {users.length} users
                      {(searchTerm || roleFilter !== "all") && " (filtered)"}
                    </p>
                  </div>
                </div>
              )}
            </UiCard>
          </div>
        </div>
      </div>
    </div>
  );
}
