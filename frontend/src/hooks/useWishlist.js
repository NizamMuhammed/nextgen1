import { useState, useEffect, useCallback } from "react";

export const useWishlist = (isLoggedIn, token) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState({}); // Track which products are in wishlist

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn || !token) {
      setWishlist([]);
      setWishlistStatus({});
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users/me/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data);

        // Update wishlist status for quick lookups
        const status = {};
        data.forEach((product) => {
          status[product._id] = true;
        });
        setWishlistStatus(status);
      } else {
        console.error("Failed to fetch wishlist");
        setWishlist([]);
        setWishlistStatus({});
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
      setWishlistStatus({});
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  // Add product to wishlist
  const addToWishlist = useCallback(
    async (product) => {
      if (!isLoggedIn || !token) {
        throw new Error("User must be logged in to add to wishlist");
      }

      try {
        const response = await fetch("http://localhost:5000/api/users/me/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });

        if (response.ok) {
          // Update local state immediately for better UX
          setWishlist((prev) => [...prev, product]);
          setWishlistStatus((prev) => ({ ...prev, [product._id]: true }));
          return { success: true, message: "Product added to wishlist!" };
        } else {
          const data = await response.json();
          return { success: false, message: data.error || "Failed to add to wishlist" };
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        return { success: false, message: "Failed to add to wishlist" };
      }
    },
    [isLoggedIn, token]
  );

  // Remove product from wishlist
  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!isLoggedIn || !token) {
        throw new Error("User must be logged in to remove from wishlist");
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/me/wishlist/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Update local state immediately for better UX
          setWishlist((prev) => prev.filter((item) => item._id !== productId));
          setWishlistStatus((prev) => {
            const newStatus = { ...prev };
            delete newStatus[productId];
            return newStatus;
          });
          return { success: true, message: "Product removed from wishlist" };
        } else {
          const data = await response.json();
          return { success: false, message: data.error || "Failed to remove from wishlist" };
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        return { success: false, message: "Failed to remove from wishlist" };
      }
    },
    [isLoggedIn, token]
  );

  // Toggle wishlist status
  const toggleWishlist = useCallback(
    async (product) => {
      if (wishlistStatus[product._id]) {
        return await removeFromWishlist(product._id);
      } else {
        return await addToWishlist(product);
      }
    },
    [wishlistStatus, addToWishlist, removeFromWishlist]
  );

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistStatus[productId] || false;
    },
    [wishlistStatus]
  );

  // Load wishlist on mount and when dependencies change
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    fetchWishlist,
  };
};
