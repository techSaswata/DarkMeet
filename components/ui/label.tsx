"use client";
import React from "react";

export const Label = ({ children, className = "" }: any) => {
  return <label className={`block text-sm font-medium mb-2 ${className}`}>{children}</label>;
};
export default Label;
