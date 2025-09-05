import React, { useState, useEffect } from "react";
import UiCard from "./components/ui/UiCard";
import UiTextField from "./components/ui/UiTextField";
import UiButton from "./components/ui/UiButton";
import UIValidation from "./components/ui/UIValidation";

export default function UserSettings({ token, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
    label: "", // e.g., "Home", "Work", "Office"
  });

  // Fetch saved addresses on component mount
  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me/shipping-addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setSavedAddresses(data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
      label: "",
    });
    setEditingAddress(null);
    setShowAddForm(false);
    setValidationErrors({});
  };

  const validateAddressForm = () => {
    const errors = {};

    if (!addressForm.fullName.trim()) {
      errors.fullName = "Please enter the full name.";
    } else if (addressForm.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters long.";
    } else if (addressForm.fullName.trim().length > 50) {
      errors.fullName = "Full name must be less than 50 characters.";
    }

    if (!addressForm.address.trim()) {
      errors.address = "Please enter the address.";
    } else if (addressForm.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters long.";
    } else if (addressForm.address.trim().length > 200) {
      errors.address = "Address must be less than 200 characters.";
    }

    if (!addressForm.city.trim()) {
      errors.city = "Please enter the city.";
    } else if (addressForm.city.trim().length < 2) {
      errors.city = "City must be at least 2 characters long.";
    } else if (addressForm.city.trim().length > 50) {
      errors.city = "City must be less than 50 characters.";
    }

    if (!addressForm.postalCode.trim()) {
      errors.postalCode = "Please enter the postal code.";
    } else if (addressForm.postalCode.trim().length < 3) {
      errors.postalCode = "Postal code must be at least 3 characters long.";
    } else if (addressForm.postalCode.trim().length > 10) {
      errors.postalCode = "Postal code must be less than 10 characters.";
    }

    if (!addressForm.country.trim()) {
      errors.country = "Please enter the country.";
    } else if (addressForm.country.trim().length < 2) {
      errors.country = "Country must be at least 2 characters long.";
    } else if (addressForm.country.trim().length > 50) {
      errors.country = "Country must be less than 50 characters.";
    }

    if (!addressForm.phone.trim()) {
      errors.phone = "Please enter the phone number.";
    } else if (addressForm.phone.trim().length < 10) {
      errors.phone = "Phone number must be at least 10 digits long.";
    } else if (addressForm.phone.trim().length > 15) {
      errors.phone = "Phone number must be less than 15 digits.";
    } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(addressForm.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!addressForm.label.trim()) {
      errors.label = "Please enter a label for this address (e.g., Home, Work).";
    } else if (addressForm.label.trim().length > 30) {
      errors.label = "Label must be less than 30 characters.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (!validateAddressForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/api/users/me/shipping-addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add address");

      setSuccess("Address added successfully!");
      resetAddressForm();
      fetchSavedAddresses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    if (!validateAddressForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`http://localhost:5000/api/users/me/shipping-addresses/${editingAddress._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update address");

      setSuccess("Address updated successfully!");
      resetAddressForm();
      fetchSavedAddresses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/me/shipping-addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete address");

      setSuccess("Address deleted successfully!");
      fetchSavedAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
      label: address.label,
    });
    setShowAddForm(true);
  };

  const handleSetDefault = async (addressId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/me/shipping-addresses/${addressId}/default`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to set default address");

      setSuccess("Default address updated!");
      fetchSavedAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-glass text-3xl font-bold tracking-tight">User Settings</h1>
        <p className="text-glass-muted">Manage your profile and shipping addresses</p>
      </div>

      {/* Profile Information */}
      <UiCard>
        <h2 className="heading-glass text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-glass-muted mb-2">Name</label>
              <div className="text-glass font-medium">{user?.name || "Not set"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-glass-muted mb-2">Email</label>
              <div className="text-glass font-medium">{user?.email}</div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-glass-muted mb-2">Role</label>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-400/20 text-blue-300 border border-blue-300/30">
              {user?.role === "admin" ? "Administrator" : "Customer"}
            </div>
          </div>
        </div>
      </UiCard>

      {/* Shipping Addresses */}
      <UiCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-glass text-xl font-semibold">Shipping Addresses</h2>
          <UiButton
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              resetAddressForm();
              setShowAddForm(true);
            }}
          >
            {showAddForm ? "Cancel" : "Add New Address"}
          </UiButton>
        </div>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <UiCard className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 glass-subtle rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="heading-glass text-xl font-semibold tracking-tight">{editingAddress ? "Edit Address" : "Add New Address"}</h2>
            </div>

            <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <UiTextField label="Full Name" name="fullName" value={addressForm.fullName} onChange={handleAddressChange} required placeholder="Enter full name" />
                  <UIValidation message={validationErrors.fullName} position="top" type="error" visible={!!validationErrors.fullName} />
                </div>

                <div className="relative">
                  <UiTextField label="Phone Number" name="phone" value={addressForm.phone} onChange={handleAddressChange} required placeholder="Enter phone number" />
                  <UIValidation message={validationErrors.phone} position="top" type="error" visible={!!validationErrors.phone} />
                </div>
              </div>

              <div className="relative">
                <UiTextField label="Address" name="address" value={addressForm.address} onChange={handleAddressChange} required placeholder="Enter street address" multiline minRows={2} />
                <UIValidation message={validationErrors.address} position="top" type="error" visible={!!validationErrors.address} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <UiTextField label="City" name="city" value={addressForm.city} onChange={handleAddressChange} required placeholder="Enter city" />
                  <UIValidation message={validationErrors.city} position="top" type="error" visible={!!validationErrors.city} />
                </div>

                <div className="relative">
                  <UiTextField label="Postal Code" name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} required placeholder="Enter postal code" />
                  <UIValidation message={validationErrors.postalCode} position="top" type="error" visible={!!validationErrors.postalCode} />
                </div>

                <div className="relative">
                  <UiTextField label="Country" name="country" value={addressForm.country} onChange={handleAddressChange} required placeholder="Enter country" />
                  <UIValidation message={validationErrors.country} position="top" type="error" visible={!!validationErrors.country} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <UiTextField label="Label" name="label" value={addressForm.label} onChange={handleAddressChange} required placeholder="e.g., Home, Work, Office" />
                  <UIValidation message={validationErrors.label} position="top" type="error" visible={!!validationErrors.label} />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-glass-muted">Set as default address</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <UiButton type="submit" variant="contained" color="primary" disabled={loading} size="large">
                  {loading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                </UiButton>
                <UiButton type="button" variant="outlined" color="secondary" onClick={resetAddressForm} size="large">
                  Cancel
                </UiButton>
              </div>
            </form>
          </UiCard>
        )}

        {/* Saved Addresses List */}
        {savedAddresses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-glass-muted">No shipping addresses saved yet.</p>
            <p className="text-glass-muted text-sm">Add your first address to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedAddresses.map((address) => (
              <div
                key={address._id}
                className={`glass-subtle p-4 rounded-lg border transition-all duration-200 ${
                  address.isDefault ? "border-blue-400/50 bg-blue-400/10 shadow-lg" : "border-white/20 hover:border-white/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {address.isDefault && <span className="text-yellow-400 text-lg">⭐</span>}
                        <span className="text-glass font-semibold text-lg">{address.label || "Address"}</span>
                      </div>
                      {address.isDefault && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-400/20 text-blue-300 border border-blue-300/30">Default Address</span>
                      )}
                    </div>
                    <div className="text-glass-muted text-sm space-y-1">
                      <p className="font-medium text-glass">{address.fullName}</p>
                      <p>{address.address}</p>
                      <p>
                        {address.city}, {address.postalCode}, {address.country}
                      </p>
                      {address.phone && <p className="flex items-center gap-1">📞 {address.phone}</p>}
                      <p className="text-xs text-glass-muted mt-2">
                        Created: {new Date(address.createdAt).toLocaleDateString()}
                        {address.updatedAt && address.updatedAt !== address.createdAt && <span> • Updated: {new Date(address.updatedAt).toLocaleDateString()}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    {!address.isDefault && (
                      <UiButton variant="outlined" color="primary" size="small" onClick={() => handleSetDefault(address._id)}>
                        ⭐ Set Default
                      </UiButton>
                    )}
                    <div className="flex space-x-2">
                      <UiButton variant="outlined" color="secondary" size="small" onClick={() => handleEditAddress(address)}>
                        ✏️ Edit
                      </UiButton>
                      <UiButton variant="outlined" color="error" size="small" onClick={() => handleDeleteAddress(address._id)}>
                        🗑️ Delete
                      </UiButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </UiCard>

      {/* Error and Success Messages */}
      {error && (
        <div className="glass-subtle p-4 rounded-lg border border-red-300/30">
          <div className="text-red-200 text-sm text-center">{error}</div>
        </div>
      )}
      {success && (
        <div className="glass-subtle p-4 rounded-lg border border-green-300/30">
          <div className="text-green-200 text-sm text-center">{success}</div>
        </div>
      )}
    </div>
  );
}
