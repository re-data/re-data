/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('./src/utils/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
    },
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
