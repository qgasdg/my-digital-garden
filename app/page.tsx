import Link from "next/link";
import Image from "next/image";
import { getAllPostsMetadata, formatDate } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
// import { FireflyBackground } from "@/components/firefly-background";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const posts = getAllPostsMetadata();

  return (
    <div className="min-h-screen paper-texture relative">
      {/* Atmospheric Firefly Background */}
      {/* <FireflyBackground /> */}
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
                <Link href="/write" className="hover:text-foreground transition-colors">
                  Write
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
            생각의 정원
          </h2>
          <p className="text-xl text-muted-foreground max-w-[773px] leading-relaxed">
            인공지능을 공부하며 세상에 대해 기록합니다
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
                      <div className="w-full h-full bg-muted/50" />
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
            Next.js와 Tailwind CSS로 만들었습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
