/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        button:{
          'hover': '#90caf9',
          'disabled': '#ccc',
          'default': '#64b5f6'
        }
      }
    },
  },
  plugins: [],
}
