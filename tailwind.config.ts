/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0e14',
        secondary: '#111923',
        tertiary: '#1a2332',
        panel: '#0d1117',
        'border-dark': '#1e3a4a',
        accent: {
          green: '#00e5a0',
          teal: '#00bcd4',
          amber: '#f0b429',
          red: '#ff4757',
          cyan: '#4dd0e1',
        },
      },
      fontFamily: {
        mono: ['Share Tech Mono', 'Courier New', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'click-pulse': 'clickPulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 160, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 229, 160, 0.35)' },
        },
        clickPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
