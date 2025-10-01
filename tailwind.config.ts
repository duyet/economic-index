import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F6F4",
        foreground: "#1A1A1A",
        cream: {
          50: "#FDFCFB",
          100: "#F7F6F4",
        },
        sage: {
          50: "#F0F4F1",
          100: "#D9E7DC",
          200: "#B8D4BF",
          300: "#96C1A2",
          400: "#74AE85",
          500: "#5A9770",
          600: "#4A7D5C",
          700: "#3A6248",
          800: "#2A4734",
          900: "#1A2C20",
        },
        teal: {
          50: "#E6F7F5",
          100: "#B3E8E0",
          200: "#80D9CB",
          300: "#4DCAB6",
          400: "#1ABBA1",
          500: "#159982",
          600: "#117763",
          700: "#0C5544",
          800: "#083325",
          900: "#041106",
        },
        coral: {
          50: "#FEF2F1",
          100: "#FDD9D5",
          200: "#FBB3AA",
          300: "#F98D7F",
          400: "#F76754",
          500: "#F54129",
          600: "#C43421",
          700: "#932719",
          800: "#621A11",
          900: "#310D08",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-lg": ["4rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
    },
  },
  plugins: [],
};

export default config;
