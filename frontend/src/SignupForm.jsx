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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-6 flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
      <UiTextField label="Name" name="name" value={form.name} onChange={handleChange} required />
      <UiTextField label="Username" name="username" value={form.username} onChange={handleChange} required />
      <UiTextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
      <UiTextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && <div className="text-green-600 text-sm text-center">{success}</div>}
      <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </UiButton>
      <div className="text-center text-sm mt-2">
        Already have an account?{" "}
        <UiButton variant="text" color="primary" size="small" onClick={switchToLogin} sx={{ textTransform: "none", fontWeight: 600 }}>
          Log In
        </UiButton>
      </div>
    </form>
  );
}
