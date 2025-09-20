import React from "react";
import UiCard from "../components/ui/UiCard";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export default function Shipping() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <LocalShippingOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Shipping Information</h1>
        </div>
        <UiCard className="p-6 space-y-3">
          <p className="text-glass-muted">Details about shipping methods, delivery times, and costs.</p>
          <ul className="list-disc pl-5 text-glass-muted space-y-1">
            <li>Standard shipping: 3-5 business days</li>
            <li>Express shipping: 1-2 business days</li>
            <li>Free shipping on orders over $100</li>
          </ul>
        </UiCard>
      </div>
    </div>
  );
}

