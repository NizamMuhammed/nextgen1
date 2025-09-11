import React from "react";
import UiCard from "../components/ui/UiCard";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

export default function Deals({ onAddToCart, isLoggedIn, promptLogin }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <LocalOfferOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Deals</h1>
        </div>
        <UiCard className="p-6">
          <p className="text-glass-muted">Showcase current promotions and discounted products here.</p>
        </UiCard>
      </div>
    </div>
  );
}
