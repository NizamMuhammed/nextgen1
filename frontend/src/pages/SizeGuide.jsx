import React from "react";
import UiCard from "../components/ui/UiCard";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";

export default function SizeGuide() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <StraightenOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Size Guide</h1>
        </div>
        <UiCard className="p-6">
          <p className="text-glass-muted">Provide sizing information and measurement tips here.</p>
        </UiCard>
      </div>
    </div>
  );
}

