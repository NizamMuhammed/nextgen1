import React from "react";
import Button from "@mui/material/Button";

export default function UiButton({ className = "", ...props }) {
  return (
    <Button
      {...props}
      className={`rounded-xl font-semibold shadow-sm transition-all duration-200 hover:shadow-md ${className}`.trim()}
      sx={{
        textTransform: "none",
        py: 1.5,
        px: 3,
        fontWeight: 600,
        borderRadius: "12px",
        fontSize: "0.875rem",
        letterSpacing: "0.025em",
        ...props.sx,
      }}
    >
      {props.children}
    </Button>
  );
}
