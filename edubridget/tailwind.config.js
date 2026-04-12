

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
        sm: '1.25rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '4rem',
        '2xl': '5rem',
      },
    },
    extend: {
      screens: {
        xs: '380px',
      },
      // 1. TYPOGRAPHY: Keeping your fonts but tightening letter spacing for headings
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      
      // 2. SOFTNESS: Overriding border-radius for a friendlier, modern feel
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',
        DEFAULT: '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',      // 16px - Use this for standard cards
        '2xl': '1.5rem',    // 24px - Use this for sections/large containers
        '3xl': '2rem',      // 32px - Use this for hero images
        'full': '9999px',
      },

      // 3. COLOR PALETTE: Shifting to a 2026 "High-Trust" Education Palette
      colors: {
        primary: {
          DEFAULT: '#0F4C81', // Deep Midnight Blue (Prestigious)
          light: '#3B82F6',   // Electric Blue
          dark: '#0A3052',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#10B981', // Vibrant Emerald (Growth/Success)
          light: '#34D399',
          dark: '#065F46',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber (Perfect for CTAs/Live Badges)
          light: '#FBBF24',
          foreground: '#1E293B',
        },
        surface: {
          DEFAULT: '#F8FAFC', // Slate 50
          paper: '#ffffff',   // Clean White
          muted: '#F1F5F9',   // Slate 100
          dark: '#1E293B',    // For dark sections
        },
        text: {
          main: '#1E293B',    // Slate 800 (Softer than pure black)
          muted: '#475569',   // Slate 600
          light: '#94A3B8',   // Slate 400
        },
        border: {
          DEFAULT: '#E2E8F0', // Slate 200
          focus: '#3B82F6',
        }
      },

      // 4. DEPTH: Adding custom soft shadows to avoid that "Flat" AI look
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(15, 76, 129, 0.05), 0 10px 10px -5px rgba(15, 76, 129, 0.02)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.2)', // Emerald glow for success states
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.3), 0 0 50px rgba(245, 158, 11, 0.15)', // Amber glow for CTAs
        'lift': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 0 15px -5px rgba(15, 76, 129, 0.08)', // Card hover lift
      },

      // 5. UNIQUE GRADIENTS: Moving away from the simple Green-Blue
      backgroundImage: {
        'hero-mesh': 'radial-gradient(at 0% 0%, rgba(15, 76, 129, 0.1) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0, transparent 50%)',
        'primary-gradient': 'linear-gradient(135deg, #0F4C81 0%, #1E40AF 100%)',
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))',
      },

      // 6. ANIMATION: Essential for "Visibility of System Status"
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-gentle': 'bounce-gentle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },

      // 7. GLASSMORPHISM: Backdrop utilities for modern frosted glass effect
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      }
    },
  },
  plugins: [],
}
