import type { Options } from "rehype-pretty-code";

/**
 * Configuration for rehype-pretty-code
 * Dual theme support: warm light theme + atmospheric dark theme
 */
export const rehypePrettyCodeOptions: Options = {
  // Dual theme configuration for light/dark mode
  theme: {
    light: "github-light", // Clean, readable theme for light mode
    dark: "github-dark", // High-contrast theme for dark mode
  },

  // Keep background and inline styles from theme for syntax highlighting
  keepBackground: true,

  // Default language for code blocks without explicit lang
  defaultLang: "plaintext",

  // Callback to add custom data attributes
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },

  onVisitHighlightedLine(node) {
    // Add class to highlighted lines
    node.properties.className = ["line--highlighted"];
  },

  onVisitHighlightedChars(node) {
    // Add class to highlighted chars
    node.properties.className = ["word--highlighted"];
  },
};
