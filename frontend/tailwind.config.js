/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          blue: "#003366",
          silver: "#C0C0C0",
          dark: "#001a33",
          light: "#e6f2ff"
        }
      }
    },
  },
  plugins: [],
}
