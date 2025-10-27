"use client";
import React from "react";

export const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-lg p-4 bg-slate-800/60 border border-slate-700 ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = "" }: any) => (
  <div className={`mb-2 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: any) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export default Card;
