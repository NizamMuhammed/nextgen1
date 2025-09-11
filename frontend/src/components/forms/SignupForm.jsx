import React, { useState } from "react";
import UiTextField from "../ui/UiTextField";
import UiButton from "../ui/UiButton";
import UiToast from "../ui/UiToast";
import UIValidation from "../ui/UIValidation";
import OtpVerification from "./OtpVerification";

export default function SignupForm({ onSignup, switchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const [validationErrors, setValidationErrors] = useState({});
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const clearPasswordFields = () => {
    setForm((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));
  };

  const clearAllFields = () => {
    setForm({ name: "", username: "", email: "", password: "", confirmPassword: "", role: "customer" });
    setError(null);
    setSuccess(null);
    setValidationErrors({});
    setShowOtpVerification(false);
    setRegisteredEmail("");
  };

  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Please enter your full name.";
    } else if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    }

    if (!form.username.trim()) {
      errors.username = "Please choose a username.";
    } else if (form.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters long.";
    }

    if (!form.email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      errors.password = "Please create a password.";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswords = () => {
    // Check password strength
    if (form.password.length < 6) {
      setToastMessage("Password must be at least 6 characters long.");
      setToastType("error");
      setShowToast(true);
      clearPasswordFields();
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setToastMessage("Passwords do not match. Please try again.");
      setToastType("error");
      setShowToast(true);
      clearPasswordFields();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!validatePasswords()) {
      return;
    }

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

      // Show OTP verification step
      setRegisteredEmail(form.email);
      setShowOtpVerification(true);
      setSuccess("Account created! Please verify your email.");
      setToastMessage("Account created! Please check your email for verification code.");
      setToastType("success");
      setShowToast(true);
    } catch (err) {
      setError(err.message);
      setToastMessage(err.message);
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerificationSuccess = (data) => {
    setToastMessage("Email verified successfully! Welcome to NextGen Electronics!");
    setToastType("success");
    setShowToast(true);
    onSignup && onSignup(data);
  };

  const handleBackToSignup = () => {
    setShowOtpVerification(false);
    setRegisteredEmail("");
    setError(null);
    setSuccess(null);
  };

  // Show OTP verification component if user has registered
  if (showOtpVerification) {
    return <OtpVerification email={registeredEmail} onVerificationSuccess={handleOtpVerificationSuccess} onBack={handleBackToSignup} />;
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-glass-muted text-sm">Create your account today</p>
        </div>

        <div className="relative">
          <UiTextField label="Name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" />
          <UIValidation message={validationErrors.name} position="top" type="error" visible={!!validationErrors.name} />
        </div>

        <div className="relative">
          <UiTextField label="Username" name="username" value={form.username} onChange={handleChange} required placeholder="Choose a username" />
          <UIValidation message={validationErrors.username} position="top" type="error" visible={!!validationErrors.username} />
        </div>

        <div className="relative">
          <UiTextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" />
          <UIValidation message={validationErrors.email} position="top" type="error" visible={!!validationErrors.email} />
        </div>

        <div className="relative">
          <UiTextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Create a password (min 6 chars)" />
          <UIValidation message={validationErrors.password} position="top" type="error" visible={!!validationErrors.password} />
        </div>

        <div className="relative">
          <UiTextField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirm your password" />
          <UIValidation message={validationErrors.confirmPassword} position="top" type="error" visible={!!validationErrors.confirmPassword} />
        </div>

        {/* Role field is not shown; default is "customer" */}

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

        <UiButton type="button" variant="outlined" color="secondary" fullWidth onClick={clearAllFields} size="large">
          Clear All Fields
        </UiButton>

        <div className="text-center text-sm">
          <span className="text-glass-muted">Already have an account? </span>
          <button type="button" onClick={switchToLogin} className="text-glass hover:text-blue-200 font-semibold transition-colors">
            Sign In
          </button>
        </div>
      </form>

      <UiToast message={toastMessage} type={toastType} visible={showToast} onClose={() => setShowToast(false)} duration={4000} />
    </div>
  );
}
