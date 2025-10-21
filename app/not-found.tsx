"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo } from "react";

export default function NotFound() {
  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  const messages = [
    "404: Neural handshake failed. This page isn’t part of the protocol.",
    "Signal lost in the dark stream. Let’s reconnect.",
    "This endpoint returned null. Try a different route.",
    "This page is missing. The experience isn’t.",
    "You’ve reached a shadow node. No data here.",
    "404: This page is cloaked in digital darkness.",
    "The grid ends here. But your journey doesn’t.",
    "This link fell into the void. Let’s pull you back.",
    "The simulation glitched. Rewind?",
  ];

  const randomMessage = useMemo(() => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  // Mouse tracking for hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX / window.innerWidth);
      mouseY.set(event.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const backgroundX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const backgroundY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  // Generate random horizontal positions for spheres
  const spherePositions = Array.from({ length: 8 }, (_, i) => ({
    left: `${Math.floor(Math.random() * 90)}%`,
    delay: i * 1.2,
    duration: 6 + Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden">
      {/* 🌌 Animated background gradient with hover tracking */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0d, #12001a, #002030, #0a0018)",
          backgroundSize: "200% 200%",
          backgroundPositionX: backgroundX,
          backgroundPositionY: backgroundY,
          filter: "brightness(1.1)",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* 🌧️ Falling 404 spheres */}
      {spherePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple opacity-30 flex items-center justify-center text-white text-2xl font-bold shadow-xl"
          style={{ top:-100,left: pos.left }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: [0, 800], opacity: [1, 0] }}
          transition={{
            duration: pos.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: pos.delay,
          }}
        >
          <motion.span
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.span>
        </motion.div>
      ))}

      {/* 🧠 Glass-dark 404 card with shadow */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-center max-w-xl glass-dark p-10 rounded-2xl z-10 shadow-[0_0_60px_rgba(139,92,246,0.35)]"
      >
        {/* 🔠 Bigger swinging 404 */}
        <motion.h1
          className="text-[7rem] font-extrabold gradient-text mb-6"
          animate={{
            rotate: [-8, 8, -8],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          404
        </motion.h1>

        <p className="text-2xl mb-4 text-gray-300 font-semibold flicker-text">
          {randomMessage}
        </p>

        <p className="text-lg mb-4 text-gray-400">
          Oops! The page you’re looking for cannot be found.
        </p>

        <button
          onClick={goBack}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </motion.div>

      {/* 🎯 Scoped glitch animation */}
      <style jsx>{`
        @keyframes flicker {
        0%, 100% { opacity: 0.85; filter: brightness(1.15); }
        50% { opacity: 0.85; filter: brightness(0.8); }
        }

        .flicker-text {
          animation: flicker 1.5s infinite;
        }

      `}</style>
    </div>
  );
}