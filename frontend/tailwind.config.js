/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "#EDEBE1",
        "paper-dark": "#15181A",
        ink: "#1C2321",
        "ink-soft": "#3D4744",
        line: "#D9D5C7",
        "line-dark": "#2A2F2D",
        moss: "#2F6F5E",
        "moss-dark": "#4C9C86",
        mustard: "#C98A2B",
        clay: "#A6452F",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
