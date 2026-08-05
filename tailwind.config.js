/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#FFFFFF",
          yellow: "#FFC107",
          "yellow-dark": "#E0A800",
          red: "#D32F2F",
          "red-dark": "#B02525",
          green: "#1F3D2B",
          "green-dark": "#152B1E",
          cream: "#F8F3E8",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
