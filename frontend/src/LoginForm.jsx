import React, { useState } from "react";
import UiTextField from "./components/ui/UiTextField";
import UiButton from "./components/ui/UiButton";

export default function LoginForm({ onLogin, switchToSignup }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onLogin && onLogin(data);
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
          <h2 className="text-2xl font-bold text-glass mb-2">🔐 Welcome Back</h2>
          <p className="text-glass-muted text-sm">Sign in to your account</p>
        </div>

        <UiTextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" />

        <UiTextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter your password" />

        {error && (
          <div className="glass-subtle p-3 rounded-lg border border-red-300/30">
            <div className="text-red-200 text-sm text-center">{error}</div>
          </div>
        )}

        <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={loading} size="large">
          {loading ? "Signing in..." : "Sign In"}
        </UiButton>

        <div className="text-center text-sm">
          <span className="text-glass-muted">Don't have an account? </span>
          <button type="button" onClick={switchToSignup} className="text-glass hover:text-blue-200 font-semibold transition-colors">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
