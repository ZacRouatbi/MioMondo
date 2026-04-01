import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  // @ts-ignore - safelist is valid in Tailwind v4 but types may not be updated yet
  safelist: ["bg-white", "bg-lavender", "bg-snow", "bg-emerald-700"],
  theme: {
    extend: {
      colors: {
        snow:     "#F8F8F8",
        lavender: "#E6E6FA",
        gold:     "#FFCA68",
        jet:      "#202C39",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      // No maxWidth cap — sections are full width, inner content uses w-full with padding
      keyframes: {
        "marquee-scroll": {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee-scroll 28s linear infinite",
      },
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
      },
    },
  },
  plugins: [],
};

export default config;
