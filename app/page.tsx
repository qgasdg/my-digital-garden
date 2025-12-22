import Link from "next/link";
import Image from "next/image";
import { getAllPostsMetadata, formatDate } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import { FireflyBackground } from "@/components/firefly-background";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const posts = getAllPostsMetadata();

  return (
    <div className="min-h-screen paper-texture relative">
      {/* Atmospheric Firefly Background */}
      <FireflyBackground />
      {/* Header / Navigation */}
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
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <div className="space-y-6">
          <h2 className="text-6xl font-serif leading-tight tracking-tight">
            A Modern Editorial
            <br />
            Archive
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Documenting my journey through Computer Science, Artificial Intelligence,
            and Software Engineering. Clean, focused, and entirely about the content.
          </p>
        </div>
      </section>

      {/* Posts Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group cursor-pointer h-full">
                <div className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {post.thumbnail ? (
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/10 via-accent/5 to-background relative">
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]">
                          <div className="absolute top-4 left-4 w-24 h-24 rounded-full border-2 border-accent"></div>
                          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full border-2 border-accent"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-accent"></div>
                        </div>

                        {/* Main Icon */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="56"
                            height="56"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-accent/30"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" x2="8" y1="13" y2="13" />
                            <line x1="16" x2="8" y1="17" y2="17" />
                            <line x1="10" x2="8" y1="9" y2="9" />
                          </svg>
                          <div className="text-xs font-serif text-accent/40 tracking-wide">
                            {post.tags[0] || "Archive"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col">
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                      <Badge variant="secondary">
                        {formatDate(post.date).split(" ").slice(0, 2).join(" ")}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-serif group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {post.description}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-sm text-muted-foreground text-center">
            Built with Next.js, Tailwind CSS, and care.
          </p>
        </div>
      </footer>
    </div>
  );
}
