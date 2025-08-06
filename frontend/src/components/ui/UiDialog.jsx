import React from "react";

export default function UiDialog({ open, onClose, title, children, actions, maxWidth = "sm" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div
        className={`
          relative glass-strong rounded-2xl shadow-2xl 
          w-full max-w-md
          ${maxWidth === "lg" ? "max-w-4xl" : ""}
          ${maxWidth === "xl" ? "max-w-6xl" : ""}
          max-h-[90vh] overflow-hidden
          animate-float
        `}
      >
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-white/20">
            <h2 className="text-xl font-semibold text-glass">{title}</h2>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-glass-muted hover:text-glass">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)] text-glass">{children}</div>

        {/* Actions */}
        {actions && <div className="px-6 py-4 border-t border-white/20 flex justify-end gap-3">{actions}</div>}
      </div>
    </div>
  );
}
