import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Палитра снята с макетов moсup/ (сэмплирование пикселей)
        forest: {
          50: "#eef4f0",
          100: "#d8e6dd",
          200: "#b3cfbe",
          300: "#84b096",
          400: "#57906f",
          500: "#3a7a57",
          600: "#2a6247",
          700: "#1d4f38",
          800: "#16402e",
          900: "#0e3023",
          950: "#0a241a",
        },
        pine: "#2e5b41",
        cream: {
          DEFAULT: "#f8f4ec",
          50: "#fdfbf6",
          100: "#f8f4ec",
          200: "#f1eadd",
          300: "#e7decb",
          400: "#d9cdb2",
        },
        ink: "#12291e",
        moss: "#5f6e63",
        accent: "#2f7d4f",
        // Совместимость со страницами, написанными до редизайна
        brand: {
          50: "#eef4f0",
          100: "#d8e6dd",
          200: "#b3cfbe",
          300: "#84b096",
          400: "#57906f",
          500: "#3a7a57",
          600: "#2a6247",
          700: "#1d4f38",
          800: "#16402e",
          900: "#0e3023",
          950: "#0a241a",
        },
        dark: {
          green: "#16402e",
          forest: "#0e3023",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-display)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,41,30,0.06), 0 8px 24px rgba(18,41,30,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
