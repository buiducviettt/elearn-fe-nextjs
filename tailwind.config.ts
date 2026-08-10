import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "h-header": "var(--h-header)",
      },
      borderRadius: {
        base: "var(--radius-base)",
      },
      colors: {
        primary: "var(--primary-color)",
      },
    },
  },
  plugins: [],
} satisfies Config;
