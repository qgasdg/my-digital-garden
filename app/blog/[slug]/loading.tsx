import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FireflyBackground } from "@/components/firefly-background";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Loading() {
  return (
    <div className="min-h-screen paper-texture relative">
      {/* Atmospheric Firefly Background */}
      <FireflyBackground />
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif tracking-tight hover:text-accent transition-colors">
              Digital Garden
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex gap-6 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Archive
                </Link>
                <Link href="#" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Article Content Skeleton */}
      <article className="max-w-3xl mx-auto px-6 py-16 relative z-10">
        {/* Article Header Skeleton */}
        <header className="mb-12 space-y-6">
          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-3/4" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>

          {/* Metadata Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
          </div>

          <Separator />
        </header>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {/* Paragraph blocks */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-9/12" />
          </div>

          {/* Code block skeleton */}
          <Skeleton className="h-48 w-full rounded-lg" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-8/12" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <footer className="mt-16 pt-8 border-t border-border">
          <Skeleton className="h-4 w-32" />
        </footer>
      </article>
    </div>
  );
}
