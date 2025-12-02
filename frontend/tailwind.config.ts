import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7fb",
          100: "#e8ecf7",
          200: "#d3d9ed",
          300: "#a9b9db",
          400: "#7793c6",
          500: "#4d6fae",
          600: "#36558f",
          700: "#2d4777",
          800: "#253a61",
          900: "#1f314f"
        },
        slate: {
          950: "#0b1220"
        }
      },
      boxShadow: {
        card: "0 10px 35px rgba(15,23,42,0.08)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
