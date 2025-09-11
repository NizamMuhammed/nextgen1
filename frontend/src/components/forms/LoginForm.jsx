import React, { useState } from "react";
import UiTextField from "../ui/UiTextField";
import UiButton from "../ui/UiButton";
import UIValidation from "../ui/UIValidation";
import UiToast from "../ui/UiToast";

export default function LoginForm({ onLogin, switchToSignup }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const clearPasswordField = () => {
    setForm((prev) => ({
      ...prev,
      password: "",
    }));
  };

  const clearAllFields = () => {
    setForm({ email: "", password: "" });
    setError(null);
    setValidationErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Please enter your email.";
    }

    if (!form.password.trim()) {
      errors.password = "Please enter your password.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setToastMessage(data.error || "Login failed");
        setToastType("error");
        setShowToast(true);
        clearPasswordField();
        throw new Error(data.error || "Login failed");
      }
      setToastMessage("Login successful! Welcome back!");
      setToastType("success");
      setShowToast(true);
      onLogin && onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="text-center mb-6">
          <p className="text-glass-muted text-sm">Sign in to your account</p>
        </div>

        <div className="relative">
          <UiTextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" />
          <UIValidation message={validationErrors.email} position="top" type="error" visible={!!validationErrors.email} />
        </div>

        <div className="relative">
          <UiTextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter your password" />
          <UIValidation message={validationErrors.password} position="top" type="error" visible={!!validationErrors.password} />
        </div>

        {error && (
          <div className="glass-subtle p-3 rounded-lg border border-red-300/30">
            <div className="text-red-200 text-sm text-center">{error}</div>
          </div>
        )}

        <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={loading} size="large">
          {loading ? "Signing in..." : "Sign In"}
        </UiButton>

        <UiButton type="button" variant="outlined" color="secondary" fullWidth onClick={clearAllFields} size="large">
          Clear Fields
        </UiButton>

        <div className="text-center text-sm">
          <span className="text-glass-muted">Don't have an account? </span>
          <button type="button" onClick={switchToSignup} className="text-glass hover:text-blue-200 font-semibold transition-colors">
            Sign Up
          </button>
        </div>
      </form>

      <UiToast message={toastMessage} type={toastType} visible={showToast} onClose={() => setShowToast(false)} duration={4000} />
    </div>
  );
}
