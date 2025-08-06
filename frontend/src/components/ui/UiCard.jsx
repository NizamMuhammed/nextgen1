import React from "react";

export default function UiCard({ children, className = "", variant = "default", ...props }) {
  const getVariantClasses = () => {
    switch (variant) {
      case "strong":
        return "glass-strong";
      case "subtle":
        return "glass-subtle";
      case "dark":
        return "glass-dark";
      default:
        return "glass";
    }
  };

  return (
    <div
      className={`
        ${getVariantClasses()}
        glass-hover
        rounded-2xl 
        transition-all 
        duration-300 
        ${className}
      `.trim()}
      {...props}
    >
      <div className="p-8 text-glass">{children}</div>
    </div>
  );
}
