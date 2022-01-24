module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        source: '#389e0d',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
