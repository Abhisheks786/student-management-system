/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          500: "#3b82f6",
          700: "#1d4ed8"
        }
      },
      boxShadow: {
        premium: "0 20px 50px -12px rgba(15, 23, 42, 0.22)"
      }
    }
  },
  plugins: []
};
