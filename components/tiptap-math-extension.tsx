"use client";

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import katex from 'katex';
import { useEffect, useRef, useState } from 'react';

// Math Node View Component
function MathNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [latex, setLatex] = useState(node.attrs.latex || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const displayMode = node.attrs.displayMode || false;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setLatex(node.attrs.latex || '');
  }, [node.attrs.latex]);

  const renderKatex = () => {
    try {
      return katex.renderToString(latex || '?', {
        displayMode,
        throwOnError: false,
      });
    } catch {
      return `<span class="text-red-500">${latex}</span>`;
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateAttributes({ latex });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLatex(node.attrs.latex || '');
    }
  };

  if (displayMode) {
    // Block math ($$...$$)
    return (
      <NodeViewWrapper as="div" className="my-4">
        {isEditing ? (
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent font-mono text-sm resize-none outline-none min-h-[60px]"
              placeholder="LaTeX 수식 입력..."
            />
            <div className="text-xs text-muted-foreground mt-2">Enter로 저장, Esc로 취소</div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer py-2 px-4 rounded-lg transition-colors ${
              selected ? 'bg-accent/10 ring-2 ring-accent/30' : 'hover:bg-muted/30'
            }`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: renderKatex() }}
              className="text-center overflow-x-auto"
            />
          </div>
        )}
      </NodeViewWrapper>
    );
  }

  // Inline math ($...$)
  return (
    <NodeViewWrapper as="span" className="inline">
      {isEditing ? (
        <span className="inline-flex items-center bg-muted/50 border border-border rounded px-1">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent font-mono text-sm outline-none w-auto min-w-[50px]"
            style={{ width: `${Math.max(latex.length * 8, 50)}px` }}
            placeholder="수식"
          />
        </span>
      ) : (
        <span
          ref={containerRef}
          onClick={() => setIsEditing(true)}
          className={`cursor-pointer px-0.5 rounded transition-colors ${
            selected ? 'bg-accent/20 ring-1 ring-accent/30' : 'hover:bg-muted/30'
          }`}
          dangerouslySetInnerHTML={{ __html: renderKatex() }}
        />
      )}
    </NodeViewWrapper>
  );
}

// TipTap Math Extension
export const MathExtension = Node.create({
  name: 'math',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
      },
      displayMode: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-math]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-math': '' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView);
  },
});

// Block Math Extension
export const MathBlockExtension = Node.create({
  name: 'mathBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
      },
      displayMode: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-math-block]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-math-block': '' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView);
  },
});
