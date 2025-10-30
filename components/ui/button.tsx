"use client";
import React from "react";

export function Button({ children, className = "", ...props }: any) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-md shadow-sm font-medium focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}
export default Button;
