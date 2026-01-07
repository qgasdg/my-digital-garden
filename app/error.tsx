"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FireflyBackground } from "@/components/firefly-background";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen paper-texture relative flex items-center justify-center overflow-hidden">
      {/* Atmospheric Firefly Background */}
      <FireflyBackground />

      {/* Large Faint "Error" Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[12rem] md:text-[18rem] font-serif font-bold text-muted opacity-[0.03] leading-none">
          Error
        </span>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-2xl"
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8"
        >
          <AlertTriangle
            className="w-20 h-20 text-accent/40"
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="text-4xl md:text-5xl font-serif mb-6 text-foreground tracking-tight"
        >
          문제가 발생했습니다
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed"
        >
          페이지를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button onClick={reset} size="lg" variant="default" className="font-medium">
            다시 시도
          </Button>
          <Button asChild size="lg" variant="outline" className="font-medium">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </motion.div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.6,
            }}
            className="mt-12 text-left w-full max-w-lg"
          >
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
              오류 상세 (개발 모드)
            </summary>
            <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-auto max-h-48 text-muted-foreground border border-border">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </motion.details>
        )}
      </motion.div>
    </div>
  );
}
