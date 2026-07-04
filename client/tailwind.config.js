/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B97A56',
          dark: '#9a6241',
          light: '#d2a385',
        },
        secondary: {
          DEFAULT: '#F4A261',
          dark: '#e76f51',
          light: '#f8c291',
        },
        brandBg: {
          light: '#FFF9F5',
          dark: '#121212',
        },
        brandCard: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        brandText: {
          light: '#2D2D2D',
          dark: '#F5F5F5',
        },
        brandTextSecondary: {
          light: '#666666',
          dark: '#A0A0A0',
        },
        brandBorder: {
          light: '#ECECEC',
          dark: '#2D2D2D',
        },
        success: '#52B788',
        warning: '#F4A261',
        danger: '#E76F51',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 30px rgb(0, 0, 0, 0.04)',
        'premium-hover': '0 20px 40px rgb(0, 0, 0, 0.08)',
        'glass': '0 8px 32px 0 rgba(185, 122, 86, 0.08)',
      }
    },
  },
  plugins: [],
}
