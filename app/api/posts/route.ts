import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { filenameToSlug } from "@/lib/mdx";

function htmlToMdx(html: string): string {
  let mdx = html;
  mdx = mdx.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  mdx = mdx.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  mdx = mdx.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  mdx = mdx.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  mdx = mdx.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  mdx = mdx.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  mdx = mdx.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  mdx = mdx.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n");
  mdx = mdx.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  mdx = mdx.replace(/<br[^>]*\/?>/gi, "\n");
  mdx = mdx.replace(/<[^>]+>/g, "");
  mdx = mdx.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  mdx = mdx.replace(/\n{3,}/g, "\n\n");
  return mdx.trim();
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, tags = [], description = "" } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
    }

    const mdxContent = htmlToMdx(content);
    const filename = `${title}.mdx`;
    const slug = filenameToSlug(filename);
    const date = new Date().toISOString().split("T")[0];

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
tags: [${tags.map((t: string) => `"${t}"`).join(", ")}]
---`;

    const fileContent = `${frontmatter}\n\n${mdxContent}\n`;

    // GitHub API로 파일 생성
    const owner = process.env.GITHUB_OWNER!;
    const repo = process.env.GITHUB_REPO!;
    const token = process.env.GITHUB_TOKEN!;
    const path = `posts/${filename}`;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: `content: Add "${title}"`,
          content: Buffer.from(fileContent).toString("base64"),
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      if (res.status === 422) {
        return NextResponse.json({ error: "같은 제목의 글이 이미 존재합니다." }, { status: 409 });
      }
      throw new Error(err.message);
    }

    return NextResponse.json({ success: true, slug, message: "글이 저장되었습니다." });
  } catch (error) {
    console.error("Failed to save post:", error);
    return NextResponse.json({ error: "글 저장에 실패했습니다." }, { status: 500 });
  }
}
