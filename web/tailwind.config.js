/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkmoon: {
          bg: '#030304',        // Deepest black/blue
          surface: '#0B0B10',   // Slightly lighter surface
          surface_light: '#15151E', // Highlight surface
          border: '#2A2A35',    // Subtle border
          
          // Brand Colors
          gold: '#D4AF37',      // Classic Metallic Gold
          gold_light: '#F3CF55',
          gold_dim: 'rgba(212, 175, 55, 0.1)',
          gold_glow: 'rgba(212, 175, 55, 0.3)',
          
          moon: '#E2E8F0',      // Moonlight Silver
          moon_dim: '#94A3B8',
          
          // Semantic
          success: '#059669',
          error: '#DC2626',
          warning: '#D97706',
          info: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'darkmoon-gradient': 'linear-gradient(to bottom right, #030304, #0B0B10)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F3CF55 100%)',
        'glass': 'linear-gradient(180deg, rgba(11, 11, 16, 0.7) 0%, rgba(11, 11, 16, 0.4) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 175, 55, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
