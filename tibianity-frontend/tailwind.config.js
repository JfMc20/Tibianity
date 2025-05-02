/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
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
    }
  ],
} 