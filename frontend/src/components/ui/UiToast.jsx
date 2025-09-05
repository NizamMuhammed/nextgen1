import React, { useEffect, useState } from "react";

const UiToast = ({ message, type = "info", duration = 5000, onClose, visible }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);

    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500/90 border-green-400 text-green-50";
      case "error":
        return "bg-red-500/90 border-red-400 text-red-50";
      case "warning":
        return "bg-yellow-500/90 border-yellow-400 text-yellow-50";
      case "info":
      default:
        return "bg-blue-500/90 border-blue-400 text-blue-50";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-slide-in-right`}>
      <div className={`${getTypeStyles()} p-4 rounded-lg border shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <span className="text-lg flex-shrink-0">{getIcon()}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose && onClose();
            }}
            className="flex-shrink-0 text-current/70 hover:text-current transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default UiToast;
