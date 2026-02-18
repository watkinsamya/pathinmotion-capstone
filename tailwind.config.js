/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          sun: "#F3B055",
          tangerine: "#F4863E",
          bubblegum: "#F691A9",
          baby: "#F7D4D8",
          warm: "#FFF9F2",
          ink: "#1F2937",
          muted: "#6B7280",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "20px",
        "2xl": "24px",
      },
    },
  },
  plugins: [],
};
