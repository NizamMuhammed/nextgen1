import React from "react";
import UiCard from "../components/ui/UiCard";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

export default function Categories() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <CategoryOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Categories</h1>
        </div>
        <UiCard className="p-6">
          <p className="text-glass-muted">Explore product categories. Hook up dynamic categories here.</p>
        </UiCard>
      </div>
    </div>
  );
}
