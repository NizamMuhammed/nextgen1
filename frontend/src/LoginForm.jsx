import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-6 flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-2">Log In</h2>
      <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth variant="outlined" size="small" />
      <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth variant="outlined" size="small" />
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.5, fontWeight: 600 }}>
        {loading ? "Logging in..." : "Log In"}
      </Button>
      <div className="text-center text-sm mt-2">
        Don't have an account?{" "}
        <Button variant="text" color="primary" size="small" onClick={switchToSignup} sx={{ textTransform: "none", fontWeight: 600 }}>
          Sign Up
        </Button>
      </div>
    </form>
  );
}
