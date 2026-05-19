/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        void:    '#080a0f',
        surface: '#0e1117',
        panel:   '#111520',
        border:  '#1e2530',
        /* Agent accents */
        indigo:  '#6366f1',
        cyan:    '#06b6d4',
        violet:  '#8b5cf6',
        pink:    '#ec4899',
        emerald: '#10b981',
        amber:   '#f59e0b',
        /* Text */
        ink: {
          bright: '#f0f4ff',
          mid:    '#7a8299',
          dim:    '#3a4255',
        },
      },
    },
  },
  plugins: [],
}
