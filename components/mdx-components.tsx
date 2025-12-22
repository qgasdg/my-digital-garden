"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";

interface PreProps {
  children?: ReactNode;
  raw?: string;
  [key: string]: unknown;
}

export function Pre({ children, raw, ...props }: PreProps) {
  const [copied, setCopied] = useState(false);

  // Extract code text from children
  const getCodeText = (): string => {
    if (raw) return raw;
    if (typeof children === "string") return children;

    // Try to extract from pre > code structure
    try {
      const codeElement = children as { props?: { children?: string } };
      if (codeElement?.props?.children) {
        return codeElement.props.children;
      }
    } catch (e) {
      // Fallback
    }

    return "";
  };

  const handleCopy = async () => {
    const code = getCodeText();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <pre {...props}>{children}</pre>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 h-8 px-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-muted/50 hover:bg-muted"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1.5"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            Copy
          </>
        )}
      </Button>
    </div>
  );
}

// Heading components with editorial serif style
// Using ! prefix for Tailwind important to override prose styles
// RED TEST: Verify component connection with inline styles
const H1 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h1
    {...props}
    style={{ color: 'red', fontSize: '100px', border: '5px solid red', fontWeight: 'bold' }}
  >
    🔴 RED TEST: {children}
  </h1>
);

const H2 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h2
    {...props}
    style={{ color: 'red', fontSize: '100px', border: '5px solid red', fontWeight: 'bold' }}
  >
    🔴 RED TEST H2: {children}
  </h2>
);

const H3 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h3 className="!text-2xl !font-semibold !font-serif !mt-6 !mb-3 !leading-snug !tracking-tight" {...props}>
    {children}
  </h3>
);

const H4 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h4 className="!text-xl !font-medium !font-serif !mt-6 !mb-3 !leading-snug" {...props}>
    {children}
  </h4>
);

const H5 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h5 className="!text-lg !font-medium !font-serif !mt-4 !mb-2 !leading-normal" {...props}>
    {children}
  </h5>
);

const H6 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h6 className="!text-base !font-bold !font-serif !mt-4 !mb-2 !leading-normal" {...props}>
    {children}
  </h6>
);

// Export MDX components to use in MDXRemote
export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  pre: Pre,
};
