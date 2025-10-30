"use client";
import React, { useState, createContext, useContext } from "react";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ defaultValue, children, className = "" }: any) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }: any) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className = "" }: any) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      className={`px-3 py-2 rounded-md ${active ? "bg-slate-700 text-white" : "bg-slate-800/40 text-slate-300"} ${className}`}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }: any) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  return ctx.value === value ? <div className={className}>{children}</div> : null;
}
