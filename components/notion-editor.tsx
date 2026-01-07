"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { useCallback } from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, ImageIcon, Code, Undo, Redo, Sigma } from 'lucide-react';
import { MathExtension, MathBlockExtension } from './tiptap-math-extension';
import 'katex/dist/katex.min.css';

interface NotionEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function NotionEditor({ content, onChange }: NotionEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
      Typography,
      MathExtension,
      MathBlockExtension,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const insertInlineMath = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertContent({
        type: 'math',
        attrs: { latex: 'x^2', displayMode: false },
      }).run();
    }
  }, [editor]);

  const insertBlockMath = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertContent({
        type: 'mathBlock',
        attrs: { latex: '\\int_0^\\infty f(x) dx', displayMode: true },
      }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg bg-background/50 backdrop-blur-sm">
      {/* Toolbar */}
      <div className="border-b border-border p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent/20 transition-colors ${
            editor.isActive('bold') ? 'bg-accent/30' : ''
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent/20 transition-colors ${
            editor.isActive('italic') ? 'bg-accent/30' : ''
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-accent/20 transition-colors ${
            editor.isActive('code') ? 'bg-accent/30' : ''
          }`}
          title="Code (Ctrl+E)"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border my-auto mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-accent/20 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-accent/30' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-accent/20 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-accent/30' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-accent/20 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-accent/30' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border my-auto mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-accent/20 transition-colors ${
            editor.isActive('bulletList') ? 'bg-accent/30' : ''
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-accent/20 transition-colors ${
            editor.isActive('orderedList') ? 'bg-accent/30' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border my-auto mx-1" />

        {/* Math buttons */}
        <button
          onClick={insertInlineMath}
          className="p-2 rounded hover:bg-accent/20 transition-colors"
          title="인라인 수식 ($...$)"
        >
          <Sigma className="h-4 w-4" />
        </button>

        <button
          onClick={insertBlockMath}
          className="p-2 rounded hover:bg-accent/20 transition-colors text-xs font-mono"
          title="블록 수식 ($$...$$)"
        >
          <span className="flex items-center gap-0.5">
            <Sigma className="h-3 w-3" />
            <span>블록</span>
          </span>
        </button>

        <div className="w-px h-6 bg-border my-auto mx-1" />

        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-accent/20 transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border my-auto mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-accent/20 transition-colors disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-accent/20 transition-colors disabled:opacity-30"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
