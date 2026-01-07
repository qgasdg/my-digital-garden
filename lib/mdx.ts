import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

/**
 * Convert a filename to a URL-safe slug
 * Example: "KL, JS Divergence.mdx" → "kl-js-divergence"
 */
export function filenameToSlug(filename: string): string {
  return filename
    .replace(/\.(mdx|md)$/, "") // Remove extension
    .toLowerCase() // Convert to lowercase
    .replace(/[,]/g, "") // Remove commas
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-가-힣]/g, "") // Remove special chars (keep Korean, alphanumeric, hyphens)
    .replace(/\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  content: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  thumbnail?: string;
}

/**
 * Get all posts from the posts directory
 */
export function getAllPosts(): Post[] {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = filenameToSlug(fileName);
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      // Ensure date is always an ISO string for consistency
      let dateString: string;
      if (data.date) {
        // gray-matter may parse YAML dates as Date objects
        dateString = data.date instanceof Date
          ? data.date.toISOString()
          : new Date(data.date).toISOString();
      } else {
        dateString = new Date().toISOString();
      }

      return {
        slug,
        title: data.title || "Untitled",
        date: dateString,
        description: data.description || "",
        tags: data.tags || [],
        thumbnail: data.thumbnail,
        content,
      } as Post;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

/**
 * Get all post metadata (without content) for listing pages
 */
export function getAllPostsMetadata(): PostMetadata[] {
  const posts = getAllPosts();
  return posts.map(({ slug, title, date, description, tags, thumbnail }) => ({
    slug,
    title,
    date,
    description,
    tags,
    thumbnail,
  }));
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post | null {
  // Try to find the post by checking all possible filenames
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const allFiles = fs.readdirSync(postsDirectory);
  const matchingFile = allFiles.find((fileName) => {
    if (!fileName.endsWith(".mdx") && !fileName.endsWith(".md")) {
      return false;
    }
    const fileSlug = filenameToSlug(fileName);
    return fileSlug === slug || fileName === `${slug}.mdx` || fileName === `${slug}.md`;
  });

  if (!matchingFile) {
    return null;
  }

  try {
    const fullPath = path.join(postsDirectory, matchingFile);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Ensure date is always an ISO string for consistency
    let dateString: string;
    if (data.date) {
      // gray-matter may parse YAML dates as Date objects
      dateString = data.date instanceof Date
        ? data.date.toISOString()
        : new Date(data.date).toISOString();
    } else {
      dateString = new Date().toISOString();
    }

    return {
      slug,
      title: data.title || "Untitled",
      date: dateString,
      description: data.description || "",
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      content,
    };
  } catch (error) {
    console.error(`Error reading post: ${slug}`, error);
    return null;
  }
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => filenameToSlug(fileName));
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
