import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // ALDATA brand palette
        cream: "#FAF8F4",
        offwhite: "#F4EEE7",
        "brown-950": "#241A16",
        "brown-900": "#2B1A14",
        "brown-800": "#4A2F23",
        "brown-700": "#684535",
        "brown-500": "#8B624A",
        "brown-300": "#B99568",
        "brown-200": "#D8C3AD",
        charcoal: "#241A16",
        "warm-grey": "#75665D",
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4A2F23",
          foreground: "#FAF8F4",
        },
        secondary: {
          DEFAULT: "#B99568",
          foreground: "#241A16",
        },
        muted: {
          DEFAULT: "#F4EEE7",
          foreground: "#75665D",
        },
        accent: {
          DEFAULT: "#8B624A",
          foreground: "#FAF8F4",
        },
        destructive: {
          DEFAULT: "#9B3B2E",
          foreground: "#FAF8F4",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "2px",
        md: "3px",
        lg: "4px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-fade-in": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "scale-fade-in": "scale-fade-in 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
