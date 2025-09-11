import React from "react";
import UiCard from "../components/ui/UiCard";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

export default function Brands() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <StarBorderOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Brands</h1>
        </div>
        <UiCard className="p-6">
          <p className="text-glass-muted">Discover brands. Populate from backend `/api/products/brands`.</p>
        </UiCard>
      </div>
    </div>
  );
}
