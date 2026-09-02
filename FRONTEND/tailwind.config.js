/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B7576",
        secondary: "#4BBC7F",
      },
      fontFamily: {
        sans: ["Poppins", "Arial", "sans-serif"],
      },
      fontSize: {
        base: "13px" /* Reducido de 14px (default) a 12px (2pt menos) */,
      },
    },
  },
  plugins: [],
};
