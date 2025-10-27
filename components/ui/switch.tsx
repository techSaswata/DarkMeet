"use client";
import React from "react";

export const Switch = ({ checked, onCheckedChange, className = "", ...props }: any) => {
  // simple checkbox styled like a switch
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="sr-only"
        {...props}
      />
      <span
        className={`w-10 h-5 rounded-full transition-colors bg-slate-700 inline-block relative`}
        aria-hidden
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform absolute top-0.5 left-0.5 ${checked ? "translate-x-5" : ""}`}
        />
      </span>
    </label>
  );
};
export default Switch;
