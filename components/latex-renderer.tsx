"use client";

import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

interface LaTeXRendererProps {
  content: string;
}

export function LaTeXRenderer({ content }: LaTeXRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import KaTeX only on client side
    import('katex').then((katex) => {
      const container = containerRef.current;
      if (!container) return;

      // Find and render all LaTeX expressions
      const renderLatex = () => {
        // Render block math ($$...$$)
        container.innerHTML = container.innerHTML.replace(
          /\$\$([\s\S]+?)\$\$/g,
          (match, latex) => {
            try {
              return katex.default.renderToString(latex, {
                displayMode: true,
                throwOnError: false,
              });
            } catch (e) {
              return match;
            }
          }
        );

        // Render inline math ($...$)
        container.innerHTML = container.innerHTML.replace(
          /\$([^\$]+?)\$/g,
          (match, latex) => {
            try {
              return katex.default.renderToString(latex, {
                displayMode: false,
                throwOnError: false,
              });
            } catch (e) {
              return match;
            }
          }
        );
      };

      renderLatex();
    });
  }, [content]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: content }} />;
}
