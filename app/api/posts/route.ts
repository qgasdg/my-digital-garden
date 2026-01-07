import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { filenameToSlug } from '@/lib/mdx';

// Convert HTML to MDX-compatible content
function htmlToMdx(html: string): string {
  let mdx = html;

  // Convert headings
  mdx = mdx.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  mdx = mdx.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  mdx = mdx.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  mdx = mdx.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  mdx = mdx.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  mdx = mdx.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  // Convert paragraphs
  mdx = mdx.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Convert bold and italic
  mdx = mdx.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  mdx = mdx.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  mdx = mdx.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  mdx = mdx.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Convert inline code
  mdx = mdx.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Convert code blocks
  mdx = mdx.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');

  // Convert lists
  mdx = mdx.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
  });
  mdx = mdx.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let index = 0;
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
      index++;
      return `${index}. $1\n`;
    }) + '\n';
  });

  // Convert links
  mdx = mdx.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Convert images
  mdx = mdx.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  mdx = mdx.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Convert blockquotes
  mdx = mdx.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    return content.split('\n').map((line: string) => `> ${line}`).join('\n') + '\n\n';
  });

  // Convert math nodes (inline)
  mdx = mdx.replace(/<span[^>]*data-math[^>]*data-latex="([^"]*)"[^>]*>.*?<\/span>/gi, '$$$1$$');
  mdx = mdx.replace(/<span[^>]*data-math[^>]*>[^<]*<\/span>/gi, '');

  // Convert math blocks
  mdx = mdx.replace(/<div[^>]*data-math-block[^>]*data-latex="([^"]*)"[^>]*>.*?<\/div>/gi, '\n$$$$\n$1\n$$$$\n');

  // Convert horizontal rules
  mdx = mdx.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

  // Convert line breaks
  mdx = mdx.replace(/<br[^>]*\/?>/gi, '\n');

  // Remove remaining HTML tags
  mdx = mdx.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  mdx = mdx.replace(/&nbsp;/g, ' ');
  mdx = mdx.replace(/&amp;/g, '&');
  mdx = mdx.replace(/&lt;/g, '<');
  mdx = mdx.replace(/&gt;/g, '>');
  mdx = mdx.replace(/&quot;/g, '"');
  mdx = mdx.replace(/&#39;/g, "'");

  // Clean up multiple newlines
  mdx = mdx.replace(/\n{3,}/g, '\n\n');

  return mdx.trim();
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags = [], description = '' } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    // Convert HTML content to MDX
    const mdxContent = htmlToMdx(content);

    // Generate slug and filename
    const filename = `${title}.mdx`;
    const slug = filenameToSlug(filename);
    const date = new Date().toISOString().split('T')[0];

    // Create frontmatter
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]
---`;

    // Combine frontmatter and content
    const fileContent = `${frontmatter}\n\n${mdxContent}\n`;

    // Save to posts directory
    const postsDir = path.join(process.cwd(), 'posts');
    const filepath = path.join(postsDir, filename);

    // Ensure posts directory exists
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      return NextResponse.json(
        { error: '같은 제목의 글이 이미 존재합니다.' },
        { status: 409 }
      );
    }

    // Write file
    fs.writeFileSync(filepath, fileContent, 'utf-8');

    return NextResponse.json({
      success: true,
      slug,
      filename,
      message: '글이 저장되었습니다.',
    });
  } catch (error) {
    console.error('Failed to save post:', error);
    return NextResponse.json(
      { error: '글 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}
