/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#e8eef5',
          100: '#c5d4e6',
          200: '#9eb8d4',
          300: '#779cc2',
          400: '#5987b5',
          500: '#3b71a7',
          600: '#2d5e93',
          700: '#1e4a7a',
          800: '#163762',
          900: '#0e254a',
          950: '#0a1a35',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#faeecb',
          200: '#f5dc94',
          300: '#f0c85d',
          400: '#eab530',
          500: '#d4a017',
          600: '#b8860e',
          700: '#926a0a',
          800: '#6e4f08',
          900: '#4a3505',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px 0 rgba(14,37,74,0.08)',
        'card-hover': '0 8px 30px 0 rgba(14,37,74,0.14)',
      },
    },
  },
  plugins: [],
}
