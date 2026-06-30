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
        background: {
          dark: '#0B1020',
          light: '#F8FAFC'
        },
        primary: {
          violet: '#8B5CF6',
          violetHover: '#7C3AED'
        },
        secondary: {
          teal: '#14B8A6',
          tealHover: '#0F766E'
        },
        highlight: {
          orange: '#F97316'
        },
        success: '#22C55E',
        card: {
          dark: 'rgba(15, 23, 42, 0.55)',
          light: 'rgba(255, 255, 255, 0.75)'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'neon-violet': '0 0 15px rgba(139, 92, 246, 0.4)',
        'neon-teal': '0 0 15px rgba(20, 184, 166, 0.4)'
      }
    },
  },
  plugins: [],
}
