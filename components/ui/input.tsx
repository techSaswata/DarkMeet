"use client";
import React from "react";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-900 ${props.className ?? ""}`}
    />
  );
};
export default Input;