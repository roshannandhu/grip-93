import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#070708",
          800: "#0d0d10",
          700: "#141418",
          600: "#1a1b20",
        },
        flame: {
          DEFAULT: "#ff6a1a",
          light: "#ff8b3d",
          dark: "#d8500a",
        },
      },
      fontFamily: {
        display: ["var(--font-saira)", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        flame: "0 10px 40px -8px rgba(255,106,26,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
