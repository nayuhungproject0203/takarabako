/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#EEF3EA', 
          DEFAULT: '#6F8F6B', 
          dark: '#5F7C5B', 
        },
        background: {
          DEFAULT: '#F7F1E7', 
          card: '#FFFDF9', 
        }
      }
    },
  },
  plugins: [],
}
