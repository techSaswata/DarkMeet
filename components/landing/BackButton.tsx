"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import React from "react";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); // go to previous page
    } else {
      router.push("/"); // fallback to home
    }
  };

  return (
    <button
      onClick={handleBack}
      className="
        fixed top-4 left-4 z-50
        flex items-center gap-1 px-3 py-2
        bg-white/10 backdrop-blur-md
        rounded-lg shadow-lg text-white
        hover:bg-white/20 transition-all duration-200
        hover:scale-105 active:scale-95
        font-medium text-sm sm:text-base
      "
    >
      <ArrowLeft className="h-5 w-5" />
      Back
    </button>
  );
};

export default BackButton;
