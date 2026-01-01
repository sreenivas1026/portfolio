/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#005BFF',
        'accent-red': '#FF4D4D',
        'dark-bg': '#0D1117',
        'card-bg': '#161B22',
        'text-light': '#E6E6E6',
        'text-muted': '#A9A9A9',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        blob: 'blob 7s infinite',
        gradient: 'gradient 3s ease infinite',
        float: 'float 3s ease-in-out infinite',
        'float-delay-1': 'float 3s ease-in-out 0.5s infinite',
        'float-delay-2': 'float 3s ease-in-out 1s infinite',
        'float-delay-3': 'float 3s ease-in-out 1.5s infinite',
        'spin-slow': 'spin 8s linear infinite',
        dash: 'dash 1.5s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        dash: {
          to: { 'stroke-dashoffset': '-10' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
