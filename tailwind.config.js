/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#2B2B2D',
          dark: '#212123',
          light: '#38383B',
        },
        amber: {
          accent: '#E8803A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'hero': '32px',
        'card': '20px',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
}
