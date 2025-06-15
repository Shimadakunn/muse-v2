/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#000',
        foreground: '#FFF',
        card: '#252525',
        accent: '#C0E0FC',
        accent2: '#FFD2D7',
        accent3: '#FFC862',
      },
    },
  },
  plugins: [],
};
