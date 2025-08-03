import React from "react";
import TextField from "@mui/material/TextField";

export default function UiTextField({ className = "", ...props }) {
  return (
    <TextField
      {...props}
      className={`rounded-xl ${className}`.trim()}
      variant={props.variant || "outlined"}
      size={props.size || "medium"}
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          fontSize: "0.875rem",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3b82f6",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3b82f6",
            borderWidth: "2px",
          },
        },
        "& .MuiInputLabel-root": {
          fontSize: "0.875rem",
        },
        ...props.sx,
      }}
    />
  );
}
