const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        neon: {
          magenta: '#e100ff',
          cyan: '#00f7ff',
          dark: '#050014',
          darker: '#080020',
        },
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { 
            filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.25)) drop-shadow(0 0 3px rgba(96, 200, 255, 0.3)) drop-shadow(0 0 5px rgba(189, 79, 255, 0.2))' 
          },
          '50%': { 
            filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 6px rgba(96, 200, 255, 0.5)) drop-shadow(0 0 10px rgba(189, 79, 255, 0.4))' 
          },
        },
        magentaPulse: {
          '0%, 100%': { 
            textShadow: '0 0 5px #e100ff, 0 0 10px #e100ff, 0 0 20px #e100ff' 
          },
          '50%': { 
            textShadow: '0 0 5px #e100ff, 0 0 15px #e100ff, 0 0 25px #e100ff, 0 0 30px #e100ff' 
          },
        },
        neonPulse: {
          '0%, 100%': { 
            textShadow: '0 0 5px #e100ff, 0 0 10px #e100ff, 0 0 20px #e100ff' 
          },
          '50%': { 
            textShadow: '0 0 5px #e100ff, 0 0 15px #e100ff, 0 0 25px #e100ff, 0 0 30px #e100ff' 
          },
        }
      },
      animation: {
        scaleIn: 'scaleIn 0.5s ease-out forwards',
        pulseGlow: 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neon-pulse': 'magentaPulse 1.5s infinite',
        'neonPulse': 'neonPulse 1.5s infinite',
      },
      boxShadow: {
        'neon-magenta': '0 0 5px #e100ff, 0 0 10px #e100ff',
      },
      textShadow: {
        'neon-magenta': '0 0 5px #e100ff, 0 0 10px #e100ff, 0 0 20px #e100ff',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-neon-magenta': {
          textShadow: '0 0 5px #e100ff, 0 0 10px #e100ff, 0 0 20px #e100ff',
        },
      }
      addUtilities(newUtilities)
    },
  ],
} 