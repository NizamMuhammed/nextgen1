import React from "react";
import UiCard from "../components/ui/UiCard";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

const faqs = [
  { q: "How do I track my order?", a: "Use the Track Order page from the navigation or footer." },
  { q: "What is your return policy?", a: "Returns accepted within 30 days in original condition." },
  { q: "How long does shipping take?", a: "Standard 3-5 business days, express 1-2 days." },
];

export default function FAQ() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <HelpOutlineOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Frequently Asked Questions</h1>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <UiCard key={i} className="p-6">
              <h3 className="text-lg font-semibold text-glass mb-2">{f.q}</h3>
              <p className="text-glass-muted">{f.a}</p>
            </UiCard>
          ))}
        </div>
      </div>
    </div>
  );
}
