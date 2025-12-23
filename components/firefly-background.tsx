"use client";

import { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  targetOpacity: number;
}

export function FireflyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update canvas dimensions to cover full document
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight,
        document.body.scrollHeight,
        document.body.clientHeight
      );

      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
        dimensionsRef.current = { width, height };
      }
    };

    // Initialize fireflies
    const initializeFireflies = () => {
      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) return;

      const count = 42;
      firefliesRef.current = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.15 + Math.random() * 0.1;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          angle,
          speed,
          size: Math.random() * 3 + 2,
          opacity: 0.225 + Math.random() * 0.15,
          targetOpacity: 0.225 + Math.random() * 0.15,
        };
      });
    };

    // Mouse tracking with document coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.pageX || (e.clientX + window.scrollX),
        y: e.pageY || (e.clientY + window.scrollY),
      };
    };

    // Animation loop
    const animate = () => {
      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear entire canvas
      ctx.clearRect(0, 0, width, height);

      firefliesRef.current.forEach((firefly) => {
        // Smooth wandering: slowly change direction over time
        firefly.angle += (Math.random() - 0.5) * 0.05;

        // Set velocity based on current wandering angle and speed
        firefly.vx = Math.cos(firefly.angle) * firefly.speed;
        firefly.vy = Math.sin(firefly.angle) * firefly.speed;

        // Mouse repulsion: apply force to velocity (permanent deflection)
        const dx = firefly.x - mouseRef.current.x;
        const dy = firefly.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 90;

        if (distance < interactionRadius && distance > 0) {
          const force = (1 - distance / interactionRadius) * 0.3;
          const repulsionAngle = Math.atan2(dy, dx);

          // Apply repulsion force to velocity
          firefly.vx += Math.cos(repulsionAngle) * force;
          firefly.vy += Math.sin(repulsionAngle) * force;

          // CRITICAL: Update angle based on new velocity (permanent trajectory change)
          firefly.angle = Math.atan2(firefly.vy, firefly.vx);

          // Recalculate speed to maintain consistent movement
          const currentSpeed = Math.sqrt(firefly.vx * firefly.vx + firefly.vy * firefly.vy);
          if (currentSpeed > 0) {
            firefly.vx = (firefly.vx / currentSpeed) * firefly.speed;
            firefly.vy = (firefly.vy / currentSpeed) * firefly.speed;
          }
        }

        // Update position
        firefly.x += firefly.vx;
        firefly.y += firefly.vy;

        // Boundary wrapping
        if (firefly.x < -20) firefly.x = width + 20;
        if (firefly.x > width + 20) firefly.x = -20;
        if (firefly.y < -20) firefly.y = height + 20;
        if (firefly.y > height + 20) firefly.y = -20;

        // Opacity animation
        if (Math.random() < 0.01) {
          firefly.targetOpacity = 0.225 + Math.random() * 0.15;
        }
        firefly.opacity += (firefly.targetOpacity - firefly.opacity) * 0.05;

        // Draw firefly
        const gradient = ctx.createRadialGradient(
          firefly.x,
          firefly.y,
          0,
          firefly.x,
          firefly.y,
          firefly.size * 4
        );

        // Warm firefly glow
        const color = `rgba(255, 210, 100, ${firefly.opacity})`;

        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(255, 210, 100, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    updateDimensions();
    initializeFireflies();

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", updateDimensions);

    // Start animation
    const startTimeout = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(startTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
