import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Syne", "sans-serif"],
        body: ["var(--font-body)", "DM Mono", "monospace"],
      },
      colors: {
        "os-bg": "var(--os-bg)",
        "os-surface": "var(--os-surface)",
        "os-surface-2": "var(--os-surface-2)",
        "os-border": "var(--os-border)",
        "os-accent": "var(--os-accent)",
        "os-accent-dim": "var(--os-accent-dim)",
        "os-text": "var(--os-text)",
        "os-muted": "var(--os-muted)",
        "os-error": "var(--os-error)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "pulse-accent": "pulse-accent 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;