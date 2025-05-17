import type { Config } from "tailwindcss";

// Restaurant theme colors
const restaurantTheme = {
  primary: {
    DEFAULT: "#FF6B35", // Warm orange
    foreground: "#FFFFFF",
  },
  secondary: {
    DEFAULT: "#2EC4B6", // Teal accent
    foreground: "#FFFFFF",
  },
  background: "#1A1B1E", // Dark background
  foreground: "#FFFFFF",
  muted: {
    DEFAULT: "#2A2B2E",
    foreground: "#A1A1AA",
  },
  accent: {
    DEFAULT: "#FFD23F", // Golden yellow
    foreground: "#1A1B1E",
  },
  destructive: {
    DEFAULT: "#FF4343",
    foreground: "#FFFFFF",
  },
  border: "#2A2B2E", // Adding border color definition
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...restaurantTheme,
      },
      backgroundImage: {
        'restaurant-pattern': "url('/restaurant-pattern.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
