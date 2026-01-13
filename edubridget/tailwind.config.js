/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0077cc',
          light: '#0099ff',
          dark: '#005599',
        },
        secondary: {
          DEFAULT: '#03aa56',
          light: '#05d56c',
          dark: '#028543',
        }
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #0077cc, #03aa56)',
      }
    },
  },
  plugins: [],
}
