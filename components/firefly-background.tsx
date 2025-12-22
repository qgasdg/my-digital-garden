"use client";

import { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  targetOpacity: number;
}

export function FireflyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>();

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
        console.log('Canvas initialized:', { width, height, fireflies: firefliesRef.current.length });
      }
    };

    // Initialize fireflies
    const initializeFireflies = () => {
      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) return;

      const count = 31;
      firefliesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 2,
        opacity: 0.3 + Math.random() * 0.2,
        targetOpacity: 0.3 + Math.random() * 0.2,
      }));
    };

    // Mouse tracking with document coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.pageX || (e.clientX + window.scrollX),
        y: e.pageY || (e.clientY + window.scrollY),
      };
    };

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      frameCount++;
      if (frameCount === 1 || frameCount % 120 === 0) {
        console.log('Canvas animating:', { frame: frameCount, fireflies: firefliesRef.current.length });
      }

      // Clear entire canvas
      ctx.clearRect(0, 0, width, height);

      firefliesRef.current.forEach((firefly) => {
        // Mouse repulsion physics
        const dx = firefly.x - mouseRef.current.x;
        const dy = firefly.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 60;

        if (distance < interactionRadius && distance > 0) {
          const force = (1 - distance / interactionRadius) * 0.4;
          const angle = Math.atan2(dy, dx);
          firefly.vx += Math.cos(angle) * force;
          firefly.vy += Math.sin(angle) * force;
        }

        // Random drift
        firefly.vx += (Math.random() - 0.5) * 0.08;
        firefly.vy += (Math.random() - 0.5) * 0.08;

        // Friction
        firefly.vx *= 0.97;
        firefly.vy *= 0.97;

        // Velocity cap
        const maxSpeed = 4;
        const speed = Math.sqrt(firefly.vx * firefly.vx + firefly.vy * firefly.vy);
        if (speed > maxSpeed) {
          firefly.vx = (firefly.vx / speed) * maxSpeed;
          firefly.vy = (firefly.vy / speed) * maxSpeed;
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
          firefly.targetOpacity = 0.3 + Math.random() * 0.2;
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

        // TEMP: Bright red for visibility testing
        const color = `rgba(255, 0, 0, ${firefly.opacity})`;

        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

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
