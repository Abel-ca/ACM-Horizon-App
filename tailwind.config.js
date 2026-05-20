/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        /* ── Winnerly surface scale ── */
        bg:        '#0d112a',
        bgLowest:  '#080c25',
        surfLow:   '#161a33',
        surf:      '#1a1e37',
        surfHigh:  '#242842',
        surfTop:   '#2f334e',
        /* ── Winnerly semantic ── */
        primary:   '#b8c3ff',   // primary (light) — text / soft accents
        electric:  '#2e5bff',   // primary-container — Electric Blue actions
        teal:      '#00f2d1',   // secondary-container — Neon Teal
        tealDim:   '#00dfc1',   // secondary-fixed-dim — success / approved
        purple:    '#b000ec',   // tertiary-container — Electric Purple
        /* ── On-surface text ── */
        onSurf:    '#dee0ff',
        onVariant: '#c4c5d9',
        outline:   '#8e90a2',
        outlineDim:'#434656',
        /* ── Semantic status ── */
        success:   '#00dfc1',
        danger:    '#ffb4ab',
        amber:     '#f59e0b',   // kept for trophy/achievement only
        /* ── Agent accents (identity — do not change) ── */
        director:  '#6366f1',
        researcher:'#06b6d4',
        copywriter:'#8b5cf6',
        creative:  '#ec4899',
      },
    },
  },
  plugins: [],
}
