/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette sampled from public/logo.jpg: deep navy and turquoise teal.
        blue: {
          50: '#f1f4fb',
          100: '#e1e7f5',
          200: '#c4cee8',
          300: '#9aaad2',
          400: '#6f83ba',
          500: '#3d568f',
          600: '#172754',
          700: '#121f45',
          800: '#0d1736',
          900: '#080f25',
        },
        indigo: {
          50: '#effcfb',
          100: '#d8f6f4',
          200: '#b1ebe8',
          300: '#7bd9d5',
          400: '#42c5bf',
          500: '#16b3ad',
          600: '#08a39e',
          700: '#078580',
          800: '#086b68',
          900: '#075653',
        },
        primary: {
          50: '#f1f4fb',
          100: '#e1e7f5',
          200: '#c4cee8',
          300: '#9aaad2',
          400: '#6f83ba',
          500: '#3d568f',
          600: '#172754',
          700: '#121f45',
          800: '#0d1736',
          900: '#080f25',
        },
        accent: {
          gold: '#f59e0b',
          emerald: '#08a39e',
          crimson: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
