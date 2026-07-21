/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: '#151515', mist: '#f5f5f2', sand: '#c5a477', line: '#e4e3df' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'], display: ['DM Sans', 'ui-sans-serif', 'system-ui'] }
    }
  },
  plugins: []
};