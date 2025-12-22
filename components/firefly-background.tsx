"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  animationX: number[];
  animationY: number[];
}

// Individual firefly component with mouse avoidance
function FireflyParticle({
  firefly,
  mousePos,
  containerRect,
}: {
  firefly: Firefly;
  mousePos: { x: number; y: number };
  containerRect: DOMRect | null;
}) {
  // Calculate repulsion offset based on mouse proximity
  const getRepulsion = () => {
    if (!containerRect) return { x: 0, y: 0 };

    const fireflyX = containerRect.left + (firefly.x / 100) * containerRect.width;
    const fireflyY = containerRect.top + (firefly.y / 100) * containerRect.height;

    const dx = fireflyX - mousePos.x;
    const dy = fireflyY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const interactionRadius = 120; // Avoidance radius in pixels

    if (distance < interactionRadius && distance > 0) {
      // Calculate repulsion strength (stronger when closer)
      const strength = (1 - distance / interactionRadius) * 50;
      const angle = Math.atan2(dy, dx);

      return {
        x: Math.cos(angle) * strength,
        y: Math.sin(angle) * strength,
      };
    }

    return { x: 0, y: 0 };
  };

  const repulsion = getRepulsion();

  return (
    <motion.div
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
        x: firefly.animationX.map((val) => val + repulsion.x),
        y: firefly.animationY.map((val) => val + repulsion.y),
        opacity: [0.3, 0.5, 0.4, 0.3], // 35% brighter than before
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{
        duration: firefly.duration,
        delay: firefly.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function FireflyBackground() {
  // Initialize fireflies as empty array to avoid hydration mismatch
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Start off-screen
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  // Generate random fireflies only on client-side after hydration
  useEffect(() => {
    const count = 31; // Number of fireflies (35% increase from 23)
    const generatedFireflies = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random X position (percentage)
      y: Math.random() * 100, // Random Y position (percentage)
      size: Math.random() * 3 + 2, // Size between 2-5px
      duration: Math.random() * 10 + 15, // Duration between 15-25s
      delay: Math.random() * 5, // Random initial delay
      // Pre-generate animation keyframes to avoid recalculation
      animationX: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
      animationY: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
    }));
    setFireflies(generatedFireflies);
  }, []);

  // Update container rect on mount and resize
  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  // Track mouse position for avoidance effect (throttled)
  useEffect(() => {
    let frameId: number;
    let lastUpdate = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle updates to ~60fps for performance
      if (now - lastUpdate < 16) return;

      lastUpdate = now;
      frameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {fireflies.map((firefly) => (
        <FireflyParticle
          key={firefly.id}
          firefly={firefly}
          mousePos={mousePos}
          containerRect={containerRect}
        />
      ))}
    </div>
  );
}
