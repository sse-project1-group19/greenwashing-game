/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark corporate theme
        slate: {
          950: '#0a0e27',
          900: '#0f1419',
          800: '#1a1f3a',
        },
        // Accent colors for warnings/profits
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        rose: {
          400: '#f87171',
          500: '#ef4444',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        'pulse-money': 'pulseScale 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pulseScale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
