import React from "react";
import UiCard from "../components/ui/UiCard";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

export default function Returns() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <ReplayOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Returns & Exchanges</h1>
        </div>
        <UiCard className="p-6 space-y-3">
          <p className="text-glass-muted">Learn how to return or exchange items with ease.</p>
          <ul className="list-disc pl-5 text-glass-muted space-y-1">
            <li>30-day return policy</li>
            <li>Items must be unused and in original packaging</li>
            <li>Contact support before sending items back</li>
          </ul>
        </UiCard>
      </div>
    </div>
  );
}

