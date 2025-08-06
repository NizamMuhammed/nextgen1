import React from "react";

export default function UiTextField({ label, name, value, onChange, type = "text", placeholder, required = false, multiline = false, minRows = 1, className = "", ...props }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-glass-muted">
          {label} {required && <span className="text-red-300">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={minRows}
          className={`
            w-full input-glass rounded-xl px-4 py-3
            placeholder:text-white/50 text-glass
            focus:outline-none focus:ring-2 focus:ring-blue-400/50
            transition-all duration-300 resize-none
          `}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full input-glass rounded-xl px-4 py-3
            placeholder:text-white/50 text-glass
            focus:outline-none focus:ring-2 focus:ring-blue-400/50
            transition-all duration-300
          `}
          {...props}
        />
      )}
    </div>
  );
}
