import React, { useState, useEffect } from "react";
import UiTextField from "./ui/UiTextField";
import UiButton from "./ui/UiButton";
import UiToast from "./ui/UiToast";
import UIValidation from "./ui/UIValidation";

export default function OtpVerification({ email, onVerificationSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const [validationErrors, setValidationErrors] = useState({});
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      if (validationErrors.otp) {
        setValidationErrors((prev) => ({ ...prev, otp: null }));
      }
    }
  };

  const validateOtp = () => {
    const errors = {};

    if (!otp.trim()) {
      errors.otp = "Please enter the verification code.";
    } else if (otp.length !== 6) {
      errors.otp = "Verification code must be 6 digits.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!validateOtp()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      setSuccess("Email verified successfully!");
      setToastMessage("Email verified successfully! Welcome to NextGen Electronics!");
      setToastType("success");
      setShowToast(true);

      // Call success callback after a short delay
      setTimeout(() => {
        onVerificationSuccess && onVerificationSuccess(data);
      }, 1500);
    } catch (err) {
      setError(err.message);
      setToastMessage(err.message);
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setToastMessage("New verification code sent to your email!");
      setToastType("success");
      setShowToast(true);
      setCountdown(60); // 60 seconds countdown
    } catch (err) {
      setToastMessage(err.message);
      setToastType("error");
      setShowToast(true);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
        <p className="text-glass-muted text-sm">We've sent a 6-digit verification code to</p>
        <p className="text-blue-300 font-semibold text-sm mt-1">{email}</p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div className="relative">
          <UiTextField
            label="Verification Code"
            name="otp"
            value={otp}
            onChange={handleOtpChange}
            required
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
          <UIValidation message={validationErrors.otp} position="top" type="error" visible={!!validationErrors.otp} />
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

        <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={loading || otp.length !== 6} size="large">
          {loading ? "Verifying..." : "Verify Email"}
        </UiButton>

        <div className="text-center">
          <p className="text-glass-muted text-sm mb-3">Didn't receive the code?</p>
          <UiButton type="button" variant="outlined" color="secondary" fullWidth onClick={handleResendOtp} disabled={resendLoading || countdown > 0} size="large">
            {resendLoading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </UiButton>
        </div>

        <div className="text-center">
          <button type="button" onClick={onBack} className="text-glass-muted hover:text-blue-200 text-sm transition-colors">
            ← Back to signup
          </button>
        </div>
      </form>

      <UiToast message={toastMessage} type={toastType} visible={showToast} onClose={() => setShowToast(false)} duration={4000} />
    </div>
  );
}
