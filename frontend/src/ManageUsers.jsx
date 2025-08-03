import React, { useEffect, useState } from "react";
import UiCard from "./components/ui/UiCard";
import UiTextField from "./components/ui/UiTextField";
import UiButton from "./components/ui/UiButton";

export default function ManageUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "customer" });
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setSuccess(editingId ? "User updated!" : "User added!");
      setForm({ name: "", username: "", email: "", password: "", role: "customer" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, username: user.username, email: user.email, password: "", role: user.role });
    setEditingId(user._id);
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

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <UiCard>
        <h2 className="text-2xl font-bold mb-4 text-center">Manage Users</h2>
        <form onSubmit={handleSubmit} className="space-y-3 mb-6 flex flex-col">
          <UiTextField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <UiTextField label="Username" name="username" value={form.username} onChange={handleChange} required />
          <UiTextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <UiTextField label={editingId ? "New Password (optional)" : "Password"} name="password" type="password" value={form.password} onChange={handleChange} required={!editingId} />
          <select className="w-full border p-2 rounded" name="role" value={form.role} onChange={handleChange} required>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <UiButton type="submit" variant="contained" color="primary" fullWidth>
            {editingId ? "Update User" : "Add User"}
          </UiButton>
        </form>
        {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2 text-center">{success}</div>}
        <h3 className="font-semibold mb-2">All Users</h3>
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <div className="divide-y">
            {users.map((user) => (
              <div key={user._id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-semibold">{user.name}</span> <span className="text-gray-500">({user.username})</span> ({user.email}) - <span className="italic">{user.role}</span>
                </div>
                <div className="flex gap-2">
                  <UiButton variant="outlined" color="primary" size="small" onClick={() => handleEdit(user)}>
                    Edit
                  </UiButton>
                  <UiButton variant="outlined" color="error" size="small" onClick={() => handleDelete(user._id)}>
                    Delete
                  </UiButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </UiCard>
    </div>
  );
}
