/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-bg': '#f0f0f0',
        'neo-main': '#c4a7e7', // Soft purple
        'neo-accent': '#eb6f92', // Pink
        'neo-dark': '#191724',
        'neo-border': '#000000',
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}
