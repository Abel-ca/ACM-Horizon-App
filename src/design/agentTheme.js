/**
 * Visual theme for agents — separate from agentConfig.js (prompts untouched).
 * All color decisions live here.
 */

export const AGENT_THEME = {
  director: {
    color:     '#6366f1',
    glow:      'rgba(99,102,241,',
    gradient:  'linear-gradient(135deg, #6366f1, #4f46e5)',
    bg:        'rgba(99,102,241,0.08)',
    border:    'rgba(99,102,241,0.25)',
  },
  researcher: {
    color:     '#06b6d4',
    glow:      'rgba(6,182,212,',
    gradient:  'linear-gradient(135deg, #06b6d4, #0891b2)',
    bg:        'rgba(6,182,212,0.08)',
    border:    'rgba(6,182,212,0.25)',
  },
  copywriter: {
    color:     '#8b5cf6',
    glow:      'rgba(139,92,246,',
    gradient:  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    bg:        'rgba(139,92,246,0.08)',
    border:    'rgba(139,92,246,0.25)',
  },
  creative: {
    color:     '#ec4899',
    glow:      'rgba(236,72,153,',
    gradient:  'linear-gradient(135deg, #ec4899, #db2777)',
    bg:        'rgba(236,72,153,0.08)',
    border:    'rgba(236,72,153,0.25)',
  },
}

export function getTheme(agentId) {
  return AGENT_THEME[agentId] ?? AGENT_THEME.director
}

// Color list for confetti / decorative use
export const PALETTE = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
