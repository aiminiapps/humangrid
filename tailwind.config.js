/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand (Neon System Green)
        neon: {
          DEFAULT: '#C6FF1A',
          bright: '#D8FF4D',
          soft: '#A6E80F',
          dark: '#7FB800',
        },
        // Core Industrial Backgrounds
        industrial: {
          black: '#0B0F0C',
          dark: '#111714',
          surface: '#161C19',
          elevated: '#1C2320',
        },
        // Neutral Technical Grays
        gray: {
          primary: '#E6F1EA',
          secondary: '#A8B3AC',
          muted: '#6F7A73',
          border: '#2A332E',
          divider: '#222A26',
        },
        // Functional Colors
        success: '#3DFF7A',
        warning: '#FFE66D',
        error: '#FF5A5A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #C6FF1A 0%, #7FB800 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0B0F0C 0%, #161C19 100%)',
        'gradient-elevated': 'linear-gradient(135deg, #161C19 0%, #1C2320 100%)',
        'glow-neon': 'radial-gradient(circle at center, rgba(198, 255, 26, 0.1) 0%, transparent 70%)',
        'mesh-dark': 'radial-gradient(at 40% 20%, rgba(198, 255, 26, 0.05) 0%, transparent 50%), radial-gradient(at 80% 0%, rgba(198, 255, 26, 0.03) 0%, transparent 50%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(198, 255, 26, 0.3)',
        'neon-lg': '0 0 40px rgba(198, 255, 26, 0.5), 0 0 80px rgba(198, 255, 26, 0.2)',
        'neon-sm': '0 0 10px rgba(198, 255, 26, 0.2)',
        'industrial': '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(198, 255, 26, 0.05)',
        'elevated': '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 1px rgba(198, 255, 26, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(198, 255, 26, 0.3)',
            opacity: '1',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(198, 255, 26, 0.6)',
            opacity: '0.9',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(30px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'slide-down': {
          '0%': {
            transform: 'translateY(-30px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
