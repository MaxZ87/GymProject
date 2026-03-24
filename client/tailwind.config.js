
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      }
    }
  },
  plugins: [],
}
