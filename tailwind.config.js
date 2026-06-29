/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green:  '#4A8C2A',
          dark:   '#1E2A1A',
          light:  '#6BAE3E',
          lime:   '#B5C830',
          gold:   '#C9A028',
          cream:  '#F4F6F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
