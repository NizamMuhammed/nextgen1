import React, { useState, useRef, useEffect } from "react";

export default function UiDropdown({ value, onChange, options = [], placeholder = "Select...", disabled = false, className = "", color = "primary" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  const colorClasses = {
    primary: "border-blue-300/30 bg-blue-400/20 text-blue-100 hover:bg-blue-400/30",
    success: "border-green-300/30 bg-green-400/20 text-green-100 hover:bg-green-400/30",
    error: "border-red-300/30 bg-red-400/20 text-red-100 hover:bg-red-400/30",
    warning: "border-yellow-300/30 bg-yellow-400/20 text-yellow-100 hover:bg-yellow-400/30",
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200
          flex items-center justify-between gap-2
          ${disabled ? "opacity-50 cursor-not-allowed border-gray-300/30 bg-gray-400/20 text-gray-100" : colorClasses[color]}
          ${!disabled && "cursor-pointer hover:scale-105 transform"}
        `}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <div className="glass-strong rounded-lg border border-white/20 shadow-xl overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-3 py-2 text-xs font-medium text-left transition-colors duration-150
                    hover:bg-white/10 focus:bg-white/10 focus:outline-none
                    ${value === option.value ? "bg-white/15 text-white" : "text-glass-muted hover:text-glass"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <span className="text-sm">{option.icon}</span>}
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
