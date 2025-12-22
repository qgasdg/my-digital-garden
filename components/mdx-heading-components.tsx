import { ReactNode } from "react";

// Heading components - Server Components (no "use client")
// Editorial serif style with ! prefix to override prose defaults
export const H1 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h1 className="!text-4xl !font-bold !font-serif !mt-8 !mb-4 !leading-tight !tracking-tight" {...props}>
    {children}
  </h1>
);

export const H2 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h2 className="!text-3xl !font-semibold !font-serif !mt-8 !mb-4 !leading-tight !tracking-tight" {...props}>
    {children}
  </h2>
);

export const H3 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h3 className="!text-2xl !font-semibold !font-serif !mt-6 !mb-3 !leading-snug !tracking-tight" {...props}>
    {children}
  </h3>
);

export const H4 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h4 className="!text-xl !font-medium !font-serif !mt-6 !mb-3 !leading-snug" {...props}>
    {children}
  </h4>
);

export const H5 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h5 className="!text-lg !font-medium !font-serif !mt-4 !mb-2 !leading-normal" {...props}>
    {children}
  </h5>
);

export const H6 = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
  <h6 className="!text-base !font-bold !font-serif !mt-4 !mb-2 !leading-normal" {...props}>
    {children}
  </h6>
);
