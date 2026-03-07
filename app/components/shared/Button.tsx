// components/ui/Button.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  disabled = false,
  className = "",
  type = "button",
}) => {
  // Pure CSS classes - no Redux, no state!
  const variantClass = variant === "primary" ? "btn-primary" : "btn-secondary";
  const sizeClass =
    size === "sm" ? "btn-sm" : size === "md" ? "btn-md" : "btn-lg";
  const widthClass = fullWidth ? "btn-full" : "";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={` cursor-pointer
        ${variantClass}
        ${sizeClass}
        ${widthClass}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
