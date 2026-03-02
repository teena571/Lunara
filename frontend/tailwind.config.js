/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft pastel wellness theme
        primary: {
          50: '#fef5f8',
          100: '#fde9f1',
          200: '#fcd4e4',
          300: '#f9b0cd',
          400: '#f57fad',
          500: '#ec5590',
          600: '#d93370',
          700: '#bc2358',
          800: '#9c1f4a',
          900: '#831d41',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        wellness: {
          peach: '#FFE5D9',
          lavender: '#E8D5F2',
          mint: '#D4F1E8',
          rose: '#FFD6E8',
          cream: '#FFF8F0',
          sage: '#E8F3E8',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'wellness': '0 4px 20px -2px rgba(236, 85, 144, 0.1)',
      }
    },
  },
  plugins: [],
}
