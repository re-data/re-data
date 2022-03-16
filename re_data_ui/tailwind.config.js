module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#392396',
        secondary: '#fb5089',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
