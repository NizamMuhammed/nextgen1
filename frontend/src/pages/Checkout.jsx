import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UiCard from "../components/ui/UiCard";
import UiTextField from "../components/ui/UiTextField";
import UiButton from "../components/ui/UiButton";
import UIValidation from "../components/ui/UIValidation";

export default function Checkout({ cart, token, onOrderSuccess, onClearCart, onRefreshProducts }) {
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const totals = useMemo(() => {
    const itemsPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const taxPrice = +(itemsPrice * 0.1).toFixed(2); // 10% tax (example)
    const shippingPrice = itemsPrice > 200 ? 0 : 10; // Free shipping over $200
    const totalPrice = +(itemsPrice + taxPrice + shippingPrice).toFixed(2);
    return { itemsPrice, taxPrice, shippingPrice, totalPrice };
  }, [cart]);

  // Fetch saved addresses on component mount
  useEffect(() => {
    if (token) {
      setError(null); // Clear any previous errors
      fetchSavedAddresses();
    }
  }, [token]);

  // Auto-select default address when addresses are loaded
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setShipping({
          fullName: defaultAddress.fullName,
          address: defaultAddress.address,
          city: defaultAddress.city,
          postalCode: defaultAddress.postalCode,
          country: defaultAddress.country,
          phone: defaultAddress.phone,
        });
      } else {
        // If no default is set, use the first address
        const firstAddress = savedAddresses[0];
        setSelectedAddressId(firstAddress._id);
        setShipping({
          fullName: firstAddress.fullName,
          address: firstAddress.address,
          city: firstAddress.city,
          postalCode: firstAddress.postalCode,
          country: firstAddress.country,
          phone: firstAddress.phone,
        });
      }
    }
  }, [savedAddresses, selectedAddressId]);

  const fetchSavedAddresses = async () => {
    if (!token) {
      console.log("No token available, skipping address fetch");
      return;
    }

    setAddressesLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/me/shipping-addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        console.error("Authentication failed - token may be invalid or expired");
        setError("Authentication failed. Please log in again.");
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setSavedAddresses(data);
      } else {
        console.error("Failed to fetch addresses:", data.error || "Unknown error");
        setError("Failed to load saved addresses. Please try again.");
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setError("Network error while loading addresses. Please check your connection.");
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId === "new") {
      setShowNewAddressForm(true);
      setShipping({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
      });
    } else if (addressId === "") {
      setShowNewAddressForm(false);
      setShipping({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
      });
    } else {
      setShowNewAddressForm(false);
      const selectedAddress = savedAddresses.find((addr) => addr._id === addressId);
      if (selectedAddress) {
        setShipping({
          fullName: selectedAddress.fullName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
        });
      }
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateShippingForm = () => {
    const errors = {};

    if (!shipping.fullName.trim()) {
      errors.fullName = "Please enter the full name.";
    } else if (shipping.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters long.";
    }

    if (!shipping.address.trim()) {
      errors.address = "Please enter the address.";
    } else if (shipping.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters long.";
    }

    if (!shipping.city.trim()) {
      errors.city = "Please enter the city.";
    } else if (shipping.city.trim().length < 2) {
      errors.city = "City must be at least 2 characters long.";
    }

    if (!shipping.postalCode.trim()) {
      errors.postalCode = "Please enter the postal code.";
    } else if (shipping.postalCode.trim().length < 3) {
      errors.postalCode = "Postal code must be at least 3 characters long.";
    }

    if (!shipping.country.trim()) {
      errors.country = "Please enter the country.";
    } else if (shipping.country.trim().length < 2) {
      errors.country = "Country must be at least 2 characters long.";
    }

    if (!shipping.phone.trim()) {
      errors.phone = "Please enter the phone number.";
    } else if (shipping.phone.trim().length < 10) {
      errors.phone = "Phone number must be at least 10 digits long.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateShippingForm()) {
      return;
    }

    setError(null);
    setSuccess(null);
    if (!token) {
      setError("Please log in to place an order.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity || 1,
        price: item.price,
      }));

      console.log("Submitting order with data:", {
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice: totals.itemsPrice,
        taxPrice: totals.taxPrice,
        shippingPrice: totals.shippingPrice,
        totalPrice: totals.totalPrice,
      });

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: shipping,
          paymentMethod,
          itemsPrice: totals.itemsPrice,
          taxPrice: totals.taxPrice,
          shippingPrice: totals.shippingPrice,
          totalPrice: totals.totalPrice,
        }),
      });

      const data = await res.json();
      console.log("Order response:", { status: res.status, data });

      if (!res.ok) {
        const errorMessage = data.error || data.details || `Server error (${res.status})`;
        console.error("Order creation failed:", errorMessage);
        throw new Error(errorMessage);
      }

      // Show success message with order number and stock updates
      let successMessage = `Order placed successfully! Order #: ${data.orderNumber}`;

      if (data.stockUpdates) {
        if (data.stockUpdates.failed.length === 0) {
          successMessage += `\nStock updated for all products.`;
        } else {
          successMessage += `\nStock updated for ${data.stockUpdates.successful.length} products.`;
          if (data.stockUpdates.failed.length > 0) {
            successMessage += `\nNote: ${data.stockUpdates.failed.length} products had stock update issues.`;
          }
        }
      }

      setSuccess(successMessage);
      console.log("Order created successfully:", data);

      // Save the address if requested
      if (saveNewAddress && showNewAddressForm) {
        try {
          const addressData = {
            fullName: shipping.fullName,
            address: shipping.address,
            city: shipping.city,
            postalCode: shipping.postalCode,
            country: shipping.country,
            phone: shipping.phone,
            label: newAddressLabel || "New Address",
            isDefault: savedAddresses.length === 0, // Set as default if it's the first address
          };

          const addressRes = await fetch("http://localhost:5000/api/users/me/shipping-addresses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(addressData),
          });

          if (addressRes.ok) {
            console.log("Address saved successfully");
            // Refresh the addresses list to get the updated data
            await fetchSavedAddresses();
          } else {
            console.error("Failed to save address:", await addressRes.text());
          }
        } catch (err) {
          console.error("Failed to save address:", err);
        }
      }

      // Clear the cart after successful order
      if (onClearCart) {
        onClearCart();
      }

      // Call onOrderSuccess if provided
      if (onOrderSuccess) {
        onOrderSuccess();
      }

      // Refresh product data to show updated stock levels
      if (onRefreshProducts) {
        onRefreshProducts();
      }

      // Reset form state
      setSaveNewAddress(false);
      setNewAddressLabel("");
      setShowNewAddressForm(false);
      setSelectedAddressId("");

      // Navigate to orders page after successful order
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred while placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-2">
        <h1 className="heading-glass text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-glass-muted">Provide shipping details and confirm your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipping & Payment */}
        <UiCard className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Selection */}
            <div>
              <label className="block text-sm font-medium text-glass-muted mb-2">
                Choose Shipping Address
                {savedAddresses.length > 0 && (
                  <span className="text-xs text-blue-300 ml-2">({savedAddresses.filter((addr) => addr.isDefault).length > 0 ? "Default selected" : "No default set"})</span>
                )}
              </label>
              <select
                className="input-glass rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-glass"
                value={selectedAddressId}
                onChange={(e) => handleAddressSelection(e.target.value)}
                disabled={addressesLoading}
              >
                {addressesLoading ? (
                  <option value="">Loading addresses...</option>
                ) : (
                  <>
                    <option value="">Select an address</option>
                    {savedAddresses.map((address) => (
                      <option key={address._id} value={address._id} className="bg-gray-800 text-white">
                        {address.isDefault ? "⭐ " : ""}
                        {address.label || "Address"} - {address.fullName} ({address.city}){address.isDefault ? " [DEFAULT]" : ""}
                      </option>
                    ))}
                    <option value="new" className="bg-gray-800 text-white">
                      ➕ Add New Address
                    </option>
                  </>
                )}
              </select>

              {savedAddresses.length === 0 && !addressesLoading && (
                <div className="glass-subtle p-3 rounded-lg border border-white/20 mt-2">
                  <p className="text-sm text-glass-muted text-center">
                    No saved addresses found.{" "}
                    <button type="button" onClick={() => handleAddressSelection("new")} className="text-blue-300 hover:text-blue-200 underline font-medium">
                      Add your first address
                    </button>
                  </p>
                </div>
              )}

              {savedAddresses.length > 0 && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-glass-muted">
                    <button type="button" onClick={() => navigate("/settings")} className="text-blue-300 hover:text-blue-200 underline">
                      Manage addresses in Settings
                    </button>
                  </p>
                  {selectedAddressId && selectedAddressId !== "new" && <p className="text-xs text-green-300">✓ Address selected</p>}
                </div>
              )}
            </div>

            {/* Shipping Form - Show when "Add New" is selected or no addresses exist */}
            {(showNewAddressForm || savedAddresses.length === 0) && (
              <div className="glass-subtle p-4 rounded-lg border border-white/20">
                <h3 className="heading-glass text-lg font-semibold mb-4">Shipping Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UiTextField label="Full Name" name="fullName" value={shipping.fullName} onChange={handleShippingChange} required />
                    <UiTextField label="Phone" name="phone" value={shipping.phone} onChange={handleShippingChange} />
                  </div>
                  <UiTextField label="Address" name="address" value={shipping.address} onChange={handleShippingChange} required />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UiTextField label="City" name="city" value={shipping.city} onChange={handleShippingChange} required />
                    <UiTextField label="Postal Code" name="postalCode" value={shipping.postalCode} onChange={handleShippingChange} required />
                    <UiTextField label="Country" name="country" value={shipping.country} onChange={handleShippingChange} required />
                  </div>

                  {/* Save Address Option */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="saveAddress" className="text-sm font-medium text-glass-muted">
                        Save this address for future orders
                      </label>
                    </div>

                    {saveNewAddress && (
                      <UiTextField label="Address Label (e.g., Home, Work)" name="addressLabel" value={newAddressLabel} onChange={(e) => setNewAddressLabel(e.target.value)} placeholder="Home" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment */}
            <div>
              <label className="block text-sm font-medium text-glass-muted mb-2">Payment Method</label>
              <select
                className="input-glass rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-glass"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option className="bg-gray-800 text-white" value="Cash on Delivery">
                  Cash on Delivery
                </option>
                <option className="bg-gray-800 text-white" value="Credit Card">
                  Credit Card (mock)
                </option>
                <option className="bg-gray-800 text-white" value="Stripe">
                  Stripe (mock)
                </option>
                <option className="bg-gray-800 text-white" value="PayPal">
                  PayPal (mock)
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

            <UiButton type="submit" variant="contained" color="success" size="large" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </UiButton>
          </form>
        </UiCard>

        {/* Order Summary */}
        <UiCard>
          <div className="space-y-4">
            <h2 className="heading-glass text-xl font-semibold tracking-tight">Order Summary</h2>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-glass-muted">
                    {item.name} × {item.quantity || 1}
                  </span>
                  <span className="text-glass">Rs.{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-glass-muted">Items</span>
                <span className="text-glass">Rs.{totals.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-glass-muted">Tax (10%)</span>
                <span className="text-glass">Rs.{totals.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-glass-muted">Shipping</span>
                <span className="text-glass">Rs.{totals.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg pt-2">
                <span className="heading-glass">Total</span>
                <span className="text-glass font-bold">Rs.{totals.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  );
}
