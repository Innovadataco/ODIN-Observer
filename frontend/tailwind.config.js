/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        odin: {
          900: '#0f172a',   // slate-900
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          emerald: '#10b981', // emerald-500
          amber: '#f59e0b',   // amber-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
