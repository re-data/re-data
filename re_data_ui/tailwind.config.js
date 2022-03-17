const colors = require('./src/utils/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors,
      width: {
        100: '100px',
      },
      maxWidth: {
        200: '200px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
