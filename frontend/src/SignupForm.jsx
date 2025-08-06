import React, { useState } from "react";
import UiTextField from "./components/ui/UiTextField";
import UiButton from "./components/ui/UiButton";

export default function SignupForm({ onSignup, switchToLogin }) {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setSuccess("Signup successful! You can now log in.");
      onSignup && onSignup(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-glass mb-2">🚀 Join NextGen</h2>
          <p className="text-glass-muted text-sm">Create your account today</p>
        </div>

        <UiTextField label="Name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" />

        <UiTextField label="Username" name="username" value={form.username} onChange={handleChange} required placeholder="Choose a username" />

        <UiTextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" />

        <UiTextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Create a password" />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-glass-muted">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full input-glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors text-glass"
            required
          >
            <option value="customer" className="bg-gray-800 text-white">
              Customer
            </option>
            <option value="admin" className="bg-gray-800 text-white">
              Admin
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

        <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={loading} size="large">
          {loading ? "Creating account..." : "Create Account"}
        </UiButton>

        <div className="text-center text-sm">
          <span className="text-glass-muted">Already have an account? </span>
          <button type="button" onClick={switchToLogin} className="text-glass hover:text-blue-200 font-semibold transition-colors">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
