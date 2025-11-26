/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-white': '#FFFFFF',
        'neo-black': '#000000',
        'neo-green': '#39FF14',
        // Legacy/Mapped colors for compatibility
        'neo-bg': '#FFFFFF', // Mapped to white
        'neo-main': '#39FF14', // Mapped to Green
        'neo-accent': '#000000', // Mapped to Black for high contrast
        'neo-dark': '#000000',
        'neo-border': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Archivo Black', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'neo': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}
