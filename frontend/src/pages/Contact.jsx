import React from "react";
import UiCard from "../components/ui/UiCard";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <PhoneOutlinedIcon className="text-blue-300" />
          <h1 className="text-3xl font-bold heading-glass">Contact Us</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UiCard className="p-6">
            <h2 className="text-xl font-semibold text-glass mb-4">Get in touch</h2>
            <form className="space-y-4">
              <input className="w-full input-glass px-4 py-3 rounded-lg" placeholder="Your name" />
              <input className="w-full input-glass px-4 py-3 rounded-lg" placeholder="Your email" />
              <textarea className="w-full input-glass px-4 py-3 rounded-lg" rows={5} placeholder="Your message" />
              <button type="button" className="btn-glass-primary px-6 py-3 rounded-lg">
                Send Message
              </button>
            </form>
          </UiCard>
          <UiCard className="p-6">
            <h2 className="text-xl font-semibold text-glass mb-4">Contact info</h2>
            <div className="space-y-3 text-glass-muted">
              <div className="flex items-center gap-3">
                <PhoneOutlinedIcon /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3">
                <EmailOutlinedIcon /> support@nextgen.com
              </div>
              <div className="flex items-center gap-3">
                <RoomOutlinedIcon /> 123 Tech Ave, Innovation City
              </div>
            </div>
          </UiCard>
        </div>
      </div>
    </div>
  );
}
