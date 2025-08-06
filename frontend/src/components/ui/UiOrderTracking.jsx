import React, { useState } from "react";
import UiCard from "./UiCard";
import UiButton from "./UiButton";
import UiTextField from "./UiTextField";

export default function UiOrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      alert("Please enter both order number and email");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock tracking result
      const mockResult = {
        orderNumber: orderNumber,
        status: "In Transit",
        estimatedDelivery: "2024-01-15",
        currentLocation: "Distribution Center",
        trackingHistory: [
          {
            date: "2024-01-10",
            time: "10:30 AM",
            status: "Order Placed",
            location: "Online Store",
          },
          {
            date: "2024-01-11",
            time: "2:15 PM",
            status: "Processing",
            location: "Warehouse",
          },
          {
            date: "2024-01-12",
            time: "9:45 AM",
            status: "Shipped",
            location: "Distribution Center",
          },
          {
            date: "2024-01-13",
            time: "11:20 AM",
            status: "In Transit",
            location: "Local Facility",
          },
        ],
      };
      setTrackingResult(mockResult);
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "In Transit":
        return "bg-orange-100 text-orange-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Track Your Order</h1>

      <UiCard className="max-w-2xl mx-auto">
        <form onSubmit={handleTrackOrder} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiTextField label="Order Number" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Enter your order number" required />
            <UiTextField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>

          <UiButton type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? "Tracking..." : "Track Order"}
          </UiButton>
        </form>
      </UiCard>

      {/* Tracking Results */}
      {trackingResult && (
        <div className="mt-8">
          <UiCard>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-2">Order #{trackingResult.orderNumber}</h2>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>{trackingResult.status}</span>
                  <span className="text-gray-600">Estimated Delivery: {trackingResult.estimatedDelivery}</span>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {trackingResult.trackingHistory.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${index === trackingResult.trackingHistory.length - 1 ? "bg-blue-500" : "bg-gray-300"}`}></div>
                        {index < trackingResult.trackingHistory.length - 1 && <div className="w-0.5 h-8 bg-gray-300 ml-1.5"></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{event.status}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>{event.status}</span>
                        </div>
                        <p className="text-sm text-gray-600">{event.location}</p>
                        <p className="text-xs text-gray-500">
                          {event.date} at {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Location */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Current Location</h4>
                <p className="text-gray-600">{trackingResult.currentLocation}</p>
              </div>
            </div>
          </UiCard>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8">
        <UiCard>
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Can't find your order number?</h4>
              <p className="text-gray-600">Check your email for the order confirmation. The order number is typically in the subject line or email body.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Order not showing up?</h4>
              <p className="text-gray-600">Please allow 24-48 hours for your order to appear in our tracking system after placement.</p>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  );
}
