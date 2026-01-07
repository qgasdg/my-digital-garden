"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotionEditor } from '@/components/notion-editor';
import { Save, ArrowLeft, Loader2, Tag, X } from 'lucide-react';
import Link from 'next/link';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!content.trim() || content === '<p></p>') {
      setError('내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          content,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '저장에 실패했습니다.');
      }

      // Refresh router cache and redirect to the new post
      const targetUrl = `/blog/${data.slug}`;
      console.log('Redirecting to:', targetUrl, 'slug:', data.slug);
      router.refresh();
      router.push(targetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="홈으로"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-serif font-bold">새 글 작성</h1>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  저장
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Edit Mode */}
          <div className="space-y-6">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full text-4xl font-serif font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
            />

            {/* Description Input */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="글에 대한 간단한 설명 (선택사항)"
              className="w-full text-lg bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-muted-foreground"
            />

            {/* Tags Input */}
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="태그 추가 (Enter)"
                className="flex-1 min-w-[120px] bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-sm"
              />
            </div>

            {/* Editor */}
            <NotionEditor content={content} onChange={setContent} />

            {/* Tips */}
            <div className="text-sm text-muted-foreground space-y-1 px-2">
              <p>💡 <strong>팁:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>수식을 클릭하면 편집할 수 있습니다</li>
                <li>툴바의 Σ 버튼으로 인라인/블록 수식을 추가하세요</li>
                <li>키보드 단축키: Ctrl+B (볼드), Ctrl+I (이탤릭), Ctrl+E (코드)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
