/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080C14",
        surface: "#0D1117",
        surface2: "#111927",
        border: "#1C2A3A",
        blue: "#3B82F6",
        "blue-dim": "#2563EB",
        "blue-dark": "#1E3A5F",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
