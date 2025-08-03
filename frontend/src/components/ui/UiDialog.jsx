import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function UiDialog({ open, onClose, title, children, actions }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            pb: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {title}
        </DialogTitle>
      )}
      <DialogContent sx={{ p: 4 }}>{children}</DialogContent>
      {actions && <DialogActions sx={{ p: 3, pt: 0 }}>{actions}</DialogActions>}
    </Dialog>
  );
}
