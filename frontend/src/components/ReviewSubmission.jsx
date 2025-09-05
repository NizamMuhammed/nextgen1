import React, { useState, useEffect } from "react";
import UiButton from "./ui/UiButton";
import UiCard from "./ui/UiCard";
import UiTextField from "./ui/UiTextField";
import UiToast from "./ui/UiToast";
import { MdStar, MdStarBorder } from "react-icons/md";

export default function ReviewSubmission({ productId, isLoggedIn, token, onReviewSubmitted }) {
  const [form, setForm] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [canReview, setCanReview] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Check if user can review this product
  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!isLoggedIn || !token || !productId) {
        setCanReview(false);
        return;
      }

      setCheckingEligibility(true);
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/can-review/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setCanReview(data.canReview);
        } else {
          setCanReview(false);
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error);
        setCanReview(false);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkReviewEligibility();
  }, [isLoggedIn, token, productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  const handleRatingClick = (rating) => {
    setForm({ ...form, rating });
    if (validationErrors.rating) {
      setValidationErrors({ ...validationErrors, rating: null });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (form.rating === 0) {
      errors.rating = "Please select a rating.";
    }

    if (!form.title.trim()) {
      errors.title = "Please enter a review title.";
    } else if (form.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long.";
    }

    if (!form.comment.trim()) {
      errors.comment = "Please enter a review comment.";
    } else if (form.comment.trim().length < 10) {
      errors.comment = "Comment must be at least 10 characters long.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setToast({ show: true, message: "Please log in to submit a review", type: "error" });
      return;
    }

    if (!canReview) {
      setToast({ show: true, message: "You must have a delivered order to review this product", type: "error" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating: form.rating,
          title: form.title.trim(),
          comment: form.comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ show: true, message: "Review submitted successfully!", type: "success" });
        setForm({ rating: 0, title: "", comment: "" });
        setValidationErrors({});

        // Notify parent component to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        throw new Error(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      setToast({ show: true, message: error.message || "Failed to submit review", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while checking eligibility
  if (checkingEligibility) {
    return (
      <UiCard variant="subtle">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-glass-muted">Checking review eligibility...</p>
          </div>
        </div>
      </UiCard>
    );
  }

  // Show login prompt for non-logged-in users
  if (!isLoggedIn) {
    return (
      <UiCard variant="subtle">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="heading-glass text-xl font-semibold mb-2">Share Your Experience</h3>
          <p className="text-glass-muted mb-4">Log in to write a review and help other customers</p>
        </div>
      </UiCard>
    );
  }

  // Show message for users who can't review (no delivered orders)
  if (canReview === false) {
    return (
      <UiCard variant="subtle">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="heading-glass text-xl font-semibold mb-2">Review Not Available</h3>
          <p className="text-glass-muted mb-4">You can only review products after receiving a delivered order. Once your order is delivered, you'll be able to share your experience here.</p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-200">
              💡 <strong>Tip:</strong> Check your order status in the Orders page to see when your product will be delivered.
            </p>
          </div>
        </div>
      </UiCard>
    );
  }

  return (
    <UiCard variant="subtle">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="heading-glass text-xl font-semibold">Write a Review</h3>
            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">✓ Verified Purchase</span>
          </div>
          <p className="text-glass-muted">Share your experience with this product</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-glass mb-2">Rating *</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => handleRatingClick(star)} className="text-2xl transition-colors duration-200 hover:scale-110">
                  {star <= form.rating ? <MdStar className="text-yellow-400" /> : <MdStarBorder className="text-gray-400 hover:text-yellow-300" />}
                </button>
              ))}
              {form.rating > 0 && (
                <span className="ml-2 text-sm text-glass-muted">
                  {form.rating} star{form.rating !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            {validationErrors.rating && <p className="text-red-400 text-sm mt-1">{validationErrors.rating}</p>}
          </div>

          {/* Title */}
          <UiTextField label="Review Title *" name="title" value={form.title} onChange={handleInputChange} placeholder="Summarize your experience" error={validationErrors.title} maxLength={100} />

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-glass mb-2">Review Comment *</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleInputChange}
              placeholder="Tell us about your experience with this product..."
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                validationErrors.comment ? "border-red-400 bg-red-50/10" : "border-white/20 bg-white/5 focus:border-blue-400/50"
              } text-glass placeholder-glass-muted resize-none`}
            />
            <div className="flex justify-between items-center mt-1">
              {validationErrors.comment && <p className="text-red-400 text-sm">{validationErrors.comment}</p>}
              <p className="text-xs text-glass-muted ml-auto">{form.comment.length}/500 characters</p>
            </div>
          </div>

          {/* Submit Button */}
          <UiButton type="submit" variant="contained" color="primary" disabled={submitting} className="w-full">
            {submitting ? "Submitting Review..." : "Submit Review"}
          </UiButton>
        </form>
      </div>

      {/* Toast Notification */}
      <UiToast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: "success" })} />
    </UiCard>
  );
}
