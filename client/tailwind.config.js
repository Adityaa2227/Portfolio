/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-light': '#1a1a1a',
        primary: '#ff6a00',
        'primary-light': '#ff8533',
        secondary: '#e05500',
        accent: '#ff6a00',
        'glass-border': 'rgba(255, 255, 255, 0.06)',
        'glass-bg': 'rgba(255, 255, 255, 0.02)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, rgba(255,106,0,0.15) 0deg, rgba(255,133,51,0.1) 55deg, transparent 120deg)',
        'orange-gradient': 'linear-gradient(135deg, #ff6a00, #ff8533)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(255, 106, 0, 0.15)',
        'glow-md': '0 0 30px rgba(255, 106, 0, 0.2)',
        'glow-lg': '0 0 60px rgba(255, 106, 0, 0.25)',
        'glow-xl': '0 0 80px rgba(255, 106, 0, 0.3)',
      },
      animation: {
        'slow-spin': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 106, 0, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 106, 0, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
