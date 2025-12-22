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
  const [initialized, setInitialized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const firefliesRef = useRef<Firefly[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Track full document dimensions (viewport width x full scrollable height)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight,
        document.body.scrollHeight,
        document.body.clientHeight
      );

      // Strict guard: only update if dimensions are valid
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    };

    // Initial measurement
    updateDimensions();

    // Update on window resize
    window.addEventListener('resize', updateDimensions);

    // Also check after a short delay (content might still be loading)
    const timeoutId = setTimeout(updateDimensions, 100);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeoutId);
    };
  }, []);

  // Initialize fireflies data only after valid dimensions are available
  useEffect(() => {
    const { width, height } = dimensions;

    // Strict guard: don't initialize if dimensions are invalid
    if (width <= 0 || height <= 0) return;

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

    setInitialized(true);
  }, [count, dimensions]);

  // Track mouse position (use pageX/Y for absolute positioning)
  useEffect(() => {
    let debugCount = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Use pageX/pageY to account for scroll position with absolute positioning
      const pageX = e.pageX || (e.clientX + window.scrollX);
      const pageY = e.pageY || (e.clientY + window.scrollY);

      mousePos.current = { x: pageX, y: pageY };

      // Debug: log mouse position occasionally
      debugCount++;
      if (debugCount % 60 === 0) {
        console.log('Mouse position:', {
          client: { x: e.clientX, y: e.clientY },
          page: { x: pageX, y: pageY },
          scroll: { x: window.scrollX, y: window.scrollY }
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Physics-based animation loop
  useEffect(() => {
    if (!initialized) return;

    let isRunning = true;
    let frameCount = 0;

    const animate = () => {
      if (!isRunning) return;

      frameCount++;
      // Debug: log every 60 frames (roughly 1 second)
      if (frameCount % 60 === 0) {
        console.log('Firefly animation running, frame:', frameCount);
      }

      const { width, height } = dimensions;

      // Skip if dimensions aren't valid but keep animating
      if (width <= 0 || height <= 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      firefliesRef.current.forEach((firefly) => {
        let { x, y, vx, vy, opacity, targetOpacity, element } = firefly;

        if (!element) return;

        // Mouse repulsion - applies force to VELOCITY, not position
        const dx = x - mousePos.current.x;
        const dy = y - mousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 60; // Gentle radius

        if (distance < interactionRadius && distance > 0) {
          // Apply gentle repulsion force to velocity
          const force = (1 - distance / interactionRadius) * 0.4;
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

        // Boundary wrapping - wrap around full document dimensions
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

    // Start animation loop after elements are mounted
    const timeoutId = setTimeout(() => {
      if (isRunning) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }, 100);

    return () => {
      isRunning = false;
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initialized, dimensions]);

  // Callback to store element refs
  const setFireflyRef = (index: number) => (element: HTMLDivElement | null) => {
    if (firefliesRef.current[index]) {
      firefliesRef.current[index].element = element;
    }
  };

  // Don't render fireflies until properly initialized
  if (!initialized || dimensions.height === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden z-0"
      style={{
        height: `${dimensions.height}px`,
      }}
      aria-hidden="true"
    >
      {firefliesRef.current.map((firefly, i) => (
        <div
          key={firefly.id}
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
            transform: `translate(${firefly.x}px, ${firefly.y}px)`,
            opacity: firefly.opacity,
          }}
        />
      ))}
    </div>
  );
}
