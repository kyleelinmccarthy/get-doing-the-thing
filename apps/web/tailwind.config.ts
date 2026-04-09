import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      serif: ["var(--font-serif)", "Georgia", "serif"],
    },
    extend: {
      colors: {
        "spring-sage": "#96A797",
        "moss": "#56624C",
        "eucalyptus": "#AEBDB6",
        "charcoal": "#3E4444",
        "basalt": "#7B8A91",
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      transitionDuration: {
        state: "200ms",
        hover: "150ms",
      },
    },
  },
  plugins: [],
};

export default config;
