export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lotr: {
          earth: '#2a1f14',
          gold: '#d4a017',
          mordor: '#8b0000',
          shire: '#228b22',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        gothic: ['Cinzel', 'serif'],
      }
    },
  },
  plugins: [],
}
