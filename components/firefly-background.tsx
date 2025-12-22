"use client";

import { useState, useEffect, useRef } from "react";

interface Firefly {
  id: number;
  x: number; // Current X position in pixels
  y: number; // Current Y position in pixels
  vx: number; // Velocity X
  vy: number; // Velocity Y
  size: number;
  opacity: number;
  targetOpacity: number;
  element: HTMLDivElement | null;
}

export function FireflyBackground() {
  const [count] = useState(31);
  const firefliesRef = useRef<Firefly[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Initialize fireflies data
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    firefliesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5, // Random initial velocity
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 2,
      opacity: 0.3 + Math.random() * 0.2,
      targetOpacity: 0.3 + Math.random() * 0.2,
      element: null,
    }));
  }, [count]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Physics-based animation loop
  useEffect(() => {
    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      firefliesRef.current.forEach((firefly) => {
        let { x, y, vx, vy, opacity, targetOpacity, element } = firefly;

        if (!element) return;

        // Mouse repulsion - applies force to VELOCITY, not position
        const dx = x - mousePos.current.x;
        const dy = y - mousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 120;

        if (distance < interactionRadius && distance > 0) {
          // Apply repulsion force to velocity
          const force = (1 - distance / interactionRadius) * 0.8;
          const angle = Math.atan2(dy, dx);
          vx += Math.cos(angle) * force;
          vy += Math.sin(angle) * force;
        }

        // Random floating force (gentle drift)
        vx += (Math.random() - 0.5) * 0.08;
        vy += (Math.random() - 0.5) * 0.08;

        // Apply friction (damping) to prevent flying off forever
        vx *= 0.97;
        vy *= 0.97;

        // Cap maximum velocity
        const maxSpeed = 4;
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > maxSpeed) {
          vx = (vx / speed) * maxSpeed;
          vy = (vy / speed) * maxSpeed;
        }

        // Update position based on velocity (physics integration)
        x += vx;
        y += vy;

        // Boundary wrapping (fireflies wrap around screen edges)
        if (x < -20) x = width + 20;
        if (x > width + 20) x = -20;
        if (y < -20) y = height + 20;
        if (y > height + 20) y = -20;

        // Opacity animation (gentle pulsing)
        if (Math.random() < 0.01) {
          targetOpacity = 0.3 + Math.random() * 0.2;
        }
        opacity += (targetOpacity - opacity) * 0.05;

        // Update firefly state
        firefly.x = x;
        firefly.y = y;
        firefly.vx = vx;
        firefly.vy = vy;
        firefly.opacity = opacity;
        firefly.targetOpacity = targetOpacity;

        // Update DOM directly for performance (avoid React re-renders)
        element.style.transform = `translate(${x}px, ${y}px)`;
        element.style.opacity = opacity.toString();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Small delay to ensure elements are mounted
    const timeoutId = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Callback to store element refs
  const setFireflyRef = (index: number) => (element: HTMLDivElement | null) => {
    if (firefliesRef.current[index]) {
      firefliesRef.current[index].element = element;
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const firefly = firefliesRef.current[i] || {
          id: i,
          size: 3,
          x: 0,
          y: 0,
          opacity: 0.3,
        };

        return (
          <div
            key={i}
            ref={setFireflyRef(i)}
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              width: firefly.size,
              height: firefly.size,
              background: "var(--firefly-color)",
              boxShadow: `0 0 ${firefly.size * 4}px ${firefly.size * 2}px var(--firefly-glow)`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}
