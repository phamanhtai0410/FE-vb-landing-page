const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      padding: {
        xs: "1rem",
        sm: "1rem",
        lg: "1rem",
        xl: "2rem",
        "2xl": "2rem",
      },
    },
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1280px",
      xl: "1440px",
      "2xl": "1690px",
    },
    extend: {
      fontFamily: {
        sans: ['Poppins'],
        montserrat: "'Montserrat', sans-serif",
        poppins: "'Poppins', '', sans-serif",
        poppins_bold: ['Poppins-Bold', 'sans-serif'],
        sans_serif: "sans-serif",
        sf_pro: "SF Pro Display",
        nebula: "Nebula",
        blank_space: "Blank Space",
      },
    },
    colors: {
      primary: "#02A4FF",
      secondary: "#0FE3E3",
      transparent: "transparent",
      vbDisableText: "#4B5C86",
      grey7: "#8C8C8C",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.red,
      green: colors.green,
      blue: colors.blue,
      pink: colors.pink,
      yellow: colors.yellow,
    },
  },
  plugins: [],
};
