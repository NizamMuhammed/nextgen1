import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function UiCard({ children, className = "", ...props }) {
  return (
    <Card className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${className}`.trim()} {...props}>
      <CardContent className="p-8">{children}</CardContent>
    </Card>
  );
}
