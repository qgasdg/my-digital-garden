"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function FireflyBackground() {
  // Initialize fireflies as empty array to avoid hydration mismatch
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  // Generate random fireflies only on client-side after hydration
  useEffect(() => {
    const count = 23; // Number of fireflies (1.5x from original 15)
    const generatedFireflies = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random X position (percentage)
      y: Math.random() * 100, // Random Y position (percentage)
      size: Math.random() * 3 + 2, // Size between 2-5px
      duration: Math.random() * 10 + 15, // Duration between 15-25s
      delay: Math.random() * 5, // Random initial delay
    }));
    setFireflies(generatedFireflies);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {fireflies.map((firefly) => (
        <motion.div
          key={firefly.id}
          className="absolute rounded-full"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            width: firefly.size,
            height: firefly.size,
            background: "var(--firefly-color)",
            boxShadow: `0 0 ${firefly.size * 4}px ${firefly.size * 2}px var(--firefly-glow)`,
            willChange: "transform, opacity",
          }}
          animate={{
            x: [
              0,
              Math.random() * 200 - 100,
              Math.random() * 200 - 100,
              0,
            ],
            y: [
              0,
              Math.random() * 200 - 100,
              Math.random() * 200 - 100,
              0,
            ],
            opacity: [0.2, 0.4, 0.3, 0.2],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: firefly.duration,
            delay: firefly.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
