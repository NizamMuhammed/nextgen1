import React, { useState, useEffect } from "react";
import UiCard from "./ui/UiCard";
import UiButton from "./ui/UiButton";
import UiToast from "./ui/UiToast";
import { MdStar, MdStarBorder, MdThumbUp, MdThumbUpOffAlt } from "react-icons/md";

export default function ReviewDisplay({ productId, isLoggedIn, token }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${productId}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data);
      } else {
        throw new Error(data.error || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    if (!isLoggedIn) {
      setToast({ show: true, message: "Please log in to mark reviews as helpful", type: "error" });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update the review in the local state
        setReviews((prevReviews) => prevReviews.map((review) => (review._id === reviewId ? { ...review, helpful: [...(review.helpful || []), "current_user"] } : review)));
        setToast({ show: true, message: "Thank you for your feedback!", type: "success" });
      } else {
        throw new Error(data.error || "Failed to mark as helpful");
      }
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      setToast({ show: true, message: error.message || "Failed to mark as helpful", type: "error" });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-lg">
            {star <= rating ? <MdStar className="text-yellow-400" /> : <MdStarBorder className="text-gray-400" />}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <UiCard variant="subtle">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-glass-muted">Loading reviews...</p>
          </div>
        </div>
      </UiCard>
    );
  }

  if (error) {
    return (
      <UiCard variant="subtle">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="heading-glass text-lg font-semibold mb-2">Unable to Load Reviews</h3>
          <p className="text-glass-muted mb-4">{error}</p>
          <UiButton variant="outlined" color="secondary" onClick={fetchReviews}>
            Try Again
          </UiButton>
        </div>
      </UiCard>
    );
  }

  if (reviews.length === 0) {
    return (
      <UiCard variant="subtle">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="heading-glass text-lg font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-glass-muted">Be the first to share your experience with this product!</p>
        </div>
      </UiCard>
    );
  }

  return (
    <UiCard variant="subtle">
      <div className="space-y-6">
        <div>
          <h3 className="heading-glass text-xl font-semibold mb-2">Customer Reviews</h3>
          <p className="text-glass-muted">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
              <div className="space-y-3">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{review.user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                      </div>
                      <div>
                        <h4 className="heading-glass font-semibold">{review.user?.name || "Anonymous User"}</h4>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-glass-muted">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  <h5 className="heading-glass font-medium text-lg">{review.title}</h5>
                  <p className="text-glass-muted leading-relaxed">{review.comment}</p>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.startsWith("http") ? image : `http://localhost:5000${image}`}
                        alt={`Review image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-white/20"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center justify-between pt-2">
                  <UiButton variant="outlined" color="secondary" size="small" onClick={() => handleHelpfulClick(review._id)} className="flex items-center space-x-1">
                    {review.helpful && review.helpful.length > 0 ? <MdThumbUp className="w-4 h-4" /> : <MdThumbUpOffAlt className="w-4 h-4" />}
                    <span>Helpful ({review.helpful ? review.helpful.length : 0})</span>
                  </UiButton>

                  {review.verified && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">✓ Verified Purchase</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      <UiToast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: "success" })} />
    </UiCard>
  );
}
