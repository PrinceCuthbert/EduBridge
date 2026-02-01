/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      fontSize: {
        // Semantic Scale (Mobile First)
        'display-1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }], // Mobile H1
        'display-2': ['2.25rem', { lineHeight: '1.3', fontWeight: '700' }], // Mobile H2
        'display-3': ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }], // Mobile H3
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // Large Body
        'body-base': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // Base Body
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      colors: {
        primary: {
          DEFAULT: '#0077cc',
          light: '#0099ff',
          dark: '#005599',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#03aa56',
          light: '#05d56c',
          dark: '#028543',
          foreground: '#ffffff',
        },
        surface: {
          DEFAULT: '#f8fafc', // Slate 50
          paper: '#ffffff',
          muted: '#f1f5f9', // Slate 100
        },
        text: {
          main: '#0f172a', // Slate 900
          muted: '#64748b', // Slate 500
          light: '#94a3b8', // Slate 400
        },
        border: {
          DEFAULT: '#e2e8f0', // Slate 200
        }
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #0077cc, #03aa56)',
      }
    },
  },
  plugins: [],
}
