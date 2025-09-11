import React from "react";
import UiCard from "../components/ui/UiCard";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export default function Products({ onAddToCart, isLoggedIn, promptLogin, token }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBagOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Products</h1>
        </div>
        <UiCard className="p-6">
          <p className="text-glass-muted">Browse all products. Integrate your product grid/list here.</p>
        </UiCard>
      </div>
    </div>
  );
}
