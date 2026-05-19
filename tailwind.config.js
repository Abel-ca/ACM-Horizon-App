/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        /* Backgrounds */
        void:     '#080a0f',
        sidebar:  '#0a0d12',
        deep:     '#0e1117',
        surface:  '#13171f',
        elevated: '#1a2030',

        /* Borders */
        'border-dim':    '#1e2530',
        'border-bright': '#2d3a4a',

        /* Agent accent colors */
        amber:   '#f59e0b',
        cyan:    '#06b6d4',
        violet:  '#a855f7',
        rose:    '#f43f5e',
        emerald: '#10b981',
        gold:    '#f0b429',

        /* Text */
        ink: {
          bright: '#f0f4ff',
          mid:    '#7a8299',
          dim:    '#3a4255',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow':  'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
