/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#141a16",
        offWhite: "#f0ede6",
        white: "#ffffff",
        coralRed: "#e63946",
        sage: "#a3b1ac",
        teal: "#2ec4b6",
        slate: "#2a3630",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
}
