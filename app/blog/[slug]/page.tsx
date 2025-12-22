import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs, formatDate } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypePrettyCodeOptions } from "@/lib/mdx-config";
import Link from "next/link";
import { ArticleWrapper } from "./article-wrapper";
import { Pre } from "@/components/mdx-components";
import { H1, H2, H3, H4, H5, H6 } from "@/components/mdx-heading-components";
import { FireflyBackground } from "@/components/firefly-background";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Digital Garden`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <ArticleWrapper>
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
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </div>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-5xl mx-auto px-6 py-16 relative z-10">
          {/* Article Header */}
          <header className="mb-12 space-y-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-5xl md:text-6xl font-serif leading-tight tracking-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>

            <Separator />
          </header>

          {/* MDX Content */}
          <div className="prose prose-lg max-w-none">
            <MDXRemote
              source={post.content}
              components={{
                h1: H1,
                h2: H2,
                h3: H3,
                h4: H4,
                h5: H5,
                h6: H6,
                pre: Pre,
              }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [
                    rehypeKatex,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "prepend" }],
                    [rehypePrettyCode, rehypePrettyCodeOptions],
                  ],
                },
              }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Archive
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </ArticleWrapper>
  );
}
