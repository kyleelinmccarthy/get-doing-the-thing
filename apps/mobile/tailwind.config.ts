import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Raw Olive Crate palette
        "spring-sage": "#96A797",
        moss: "#56624C",
        eucalyptus: "#AEBDB6",
        charcoal: "#3E4444",
        basalt: "#7B8A91",

        // Semantic light mode
        bg: {
          primary: "#F5F7F6",
          secondary: "#FAFBFA",
          card: "#FFFFFF",
        },
        "text-primary": "#3E4444",
        "text-secondary": "#56624C",
        "text-muted": "#7B8A91",
        accent: {
          DEFAULT: "#AEBDB6",
          hover: "#9DB0A8",
        },
        "btn-did": "#B6C9B8",
        "btn-doing": "#C2D4C4",
        "btn-cant": "#A8B5BC",
        "btn-text": "#2A2E2E",

        // Semantic dark mode
        "bg-dark": {
          primary: "#222222",
          secondary: "#2A2A2A",
          card: "#313131",
        },
        "text-dark-primary": "#E2E7E4",
        "text-dark-secondary": "#AEBDB6",
        "text-dark-muted": "#95A1A7",
        "accent-dark": {
          DEFAULT: "#465440",
          hover: "#536348",
        },
        "btn-dark-did": "#4A5E4C",
        "btn-dark-doing": "#3D5040",
        "btn-dark-cant": "#4A5560",
        "btn-dark-text": "#E2E7E4",
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      fontFamily: {
        sans: ["Onest"],
        serif: ["InriaSerif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
