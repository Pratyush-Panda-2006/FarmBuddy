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
        // Landing page design system
        goldenYellow: "#ffe17c",
        charcoalDark: "#171e19",
        darkGray: "#272727",
        sageMuted: "#b7c6c2",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
}
