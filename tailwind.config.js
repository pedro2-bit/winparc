/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3f2b0bff',
          dark: '#3f2b0bff',
          light: '#3f2b0bff'
        }
      }
    },
  },
  plugins: [],
}