module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      padding: {
        xs: '1rem',
        sm: '1rem',
        lg: '1rem',
        xl: '2rem',
        '2xl': '2rem',
      },
    },
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1280px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        montserrat: "'Montserrat', sans-serif",
        poppins: "'Poppins', sans-serif",
        svn_gilroy: "'SVN-Gilroy', sans-serif",
      }
    },
  },
  plugins: [],
}