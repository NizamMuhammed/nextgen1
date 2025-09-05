import React from "react";

export default function UIValidation({ message, position = "top", type = "error", visible = false, className = "", ...props }) {
  if (!visible || !message) return null;

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "validation-dialog-top";
      case "bottom":
        return "validation-dialog-bottom";
      case "left":
        return "validation-dialog-left";
      case "right":
        return "validation-dialog-right";
      default:
        return "validation-dialog-top";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "top":
        return "validation-arrow validation-arrow-top";
      case "bottom":
        return "validation-arrow validation-arrow-bottom";
      case "left":
        return "validation-arrow validation-arrow-left";
      case "right":
        return "validation-arrow validation-arrow-right";
      default:
        return "validation-arrow validation-arrow-top";
    }
  };

  const getIconContent = () => {
    switch (type) {
      case "error":
        return "!";
      case "warning":
        return "⚠";
      case "success":
        return "✓";
      case "info":
        return "i";
      default:
        return "!";
    }
  };

  const getIconClasses = () => {
    switch (type) {
      case "error":
        return "validation-icon validation-icon-error";
      case "warning":
        return "validation-icon validation-icon-warning";
      case "success":
        return "validation-icon validation-icon-success";
      case "info":
        return "validation-icon validation-icon-info";
      default:
        return "validation-icon validation-icon-error";
    }
  };

  return (
    <div className={`validation-dialog ${getPositionClasses()} ${className}`} {...props}>
      <div className="validation-dialog-content">
        <div className={getIconClasses()}>{getIconContent()}</div>
        <span>{message}</span>
      </div>
      <div className={getArrowClasses()}></div>
    </div>
  );
}
