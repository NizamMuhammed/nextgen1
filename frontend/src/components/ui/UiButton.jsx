import React from "react";

export default function UiButton({ children, className = "", variant = "contained", color = "primary", size = "medium", disabled = false, onClick, type = "button", fullWidth = false, ...props }) {
  const getColorClasses = () => {
    if (disabled) {
      return "btn-glass opacity-50 cursor-not-allowed";
    }

    switch (color) {
      case "primary":
        return "btn-glass btn-glass-primary";
      case "success":
        return "btn-glass btn-glass-success";
      case "error":
        return "btn-glass btn-glass-error";
      case "secondary":
        return variant === "outlined" ? "border-2 border-white/30 bg-transparent text-glass hover:bg-white/10 backdrop-blur-sm" : "btn-glass";
      default:
        return "btn-glass";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-3 py-1.5 text-sm";
      case "large":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        ${getColorClasses()}
        ${getSizeClasses()}
        ${fullWidth ? "w-full" : ""}
        rounded-xl
        font-semibold
        transition-all
        duration-300
        shadow-lg
        hover:shadow-xl
        active:scale-95
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
