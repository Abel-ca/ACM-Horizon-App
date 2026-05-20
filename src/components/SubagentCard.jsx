import { getTheme } from '../design/agentTheme'

/* ── Status badge ───────────────────────────────────────── */
function StatusBadge({ status, theme }) {
  const isRunning  = status === 'active' || status === 'streaming'
  const isDone     = status === 'complete' || status === 'approved'
  const isError    = status === 'error'

  if (isDone) return (
    <div style={{
      background: 'rgba(0,223,193,0.08)',
      border: '1px solid rgba(0,223,193,0.24)',
      borderRadius: 999, padding: '3px 9px',
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#00dfc1" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, fontWeight: 600, color: '#00dfc1',
      }}>
        Completo
      </span>
    </div>
  )

  if (isRunning) return (
    <div style={{
      background: `${theme.bg}`,
      border: `1px solid ${theme.border}`,
      borderRadius: 999, padding: '3px 9px',
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      <div style={{
        width: 5, height: 5, borderRadius: '50%',
        background: theme.color,
        boxShadow: `0 0 6px ${theme.color}`,
        animation: 'systemPulse 1.8s ease-in-out infinite',
      }} />
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, fontWeight: 600, color: theme.color,
      }}>
        Analizando
      </span>
    </div>
  )

  if (isError) return (
    <div style={{
      background: 'rgba(255,180,171,0.08)',
      border: '1px solid rgba(255,180,171,0.24)',
      borderRadius: 999, padding: '3px 9px',
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, fontWeight: 600, color: '#ffb4ab',
      }}>
        Error
      </span>
    </div>
  )

  return (
    <div style={{
      background: 'rgba(184,195,255,0.04)',
      border: '1px solid rgba(184,195,255,0.08)',
      borderRadius: 999, padding: '3px 9px',
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, color: '#434656',
      }}>
        En espera
      </span>
    </div>
  )
}

/* ── SubagentCard ───────────────────────────────────────── */
export default function SubagentCard({ agent, state, index, isMobile }) {
  const theme    = getTheme(agent.id)
  const isIdle   = state.status === 'pending'
  const isRunning = state.status === 'active' || state.status === 'streaming'
  const isDone    = state.status === 'complete' || state.status === 'approved'
  const isError   = state.status === 'error'

  const accentColor = isDone ? '#00dfc1' : isRunning ? theme.color : '#242842'

  /* stagger delay tied to index (2nd, 3rd, 4th item) */
  const staggerClass = `stagger-${Math.min(index + 2, 5)}`

  const showContent = (isRunning || isDone) && state.content
  const showTyping  = isRunning && !state.content
  const cardH       = isMobile ? 220 : 240

  return (
    <div
      className={`glass-card ${staggerClass}`}
      style={{
        borderRadius: 16,
        height: cardH,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        /* Disable the card hover lift — these are observation cards */
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        opacity: isIdle ? 0.55 : 1,
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: accentColor,
        transition: 'background 0.4s ease',
        borderRadius: '3px 0 0 3px',
      }} />

      {/* ── Header ── */}
      <div style={{
        padding: '11px 14px 10px 18px',
        borderBottom: '1px solid rgba(184,195,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        background: 'rgba(22,26,51,0.28)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Icon */}
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: isDone ? 'rgba(0,223,193,0.07)' : isRunning ? theme.bg : 'rgba(184,195,255,0.03)',
            border: `1px solid ${isDone ? 'rgba(0,223,193,0.20)' : isRunning ? theme.border : '#242842'}`,
            color: isDone ? '#00dfc1' : isRunning ? theme.color : '#434656',
            fontSize: 14, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.4s ease',
          }}>
            {agent.icon}
          </div>
          <div>
            <p style={{
              color: isIdle ? '#8e90a2' : '#dee0ff',
              fontFamily: 'Sora, sans-serif',
              fontSize: 12, fontWeight: 700, lineHeight: 1.2,
              transition: 'color 0.4s ease',
            }}>
              {agent.name}
            </p>
            <p style={{
              color: '#434656', fontSize: 8.5,
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 500, letterSpacing: '0.12em',
              textTransform: 'uppercase', marginTop: 2,
            }}>
              {agent.role}
            </p>
          </div>
        </div>

        <StatusBadge status={state.status} theme={theme} />
      </div>

      {/* ── Content area ── */}
      <div style={{
        flex: 1, overflow: 'hidden',
        padding: '10px 14px 10px 18px',
        position: 'relative',
      }}>
        {isIdle && (
          <p style={{
            color: '#434656', fontSize: 11,
            fontFamily: 'JetBrains Mono, monospace',
            fontStyle: 'italic', lineHeight: 1.5,
          }}>
            En espera del Director...
          </p>
        )}

        {showTyping && (
          <div style={{
            display: 'flex', gap: 4, alignItems: 'center',
            color: theme.color, paddingTop: 2,
          }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}

        {showContent && (
          <p style={{
            fontSize: 10.5, lineHeight: 1.8, color: '#c4c5d9',
            fontFamily: 'JetBrains Mono, monospace',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {state.content}
          </p>
        )}

        {isError && (
          <p style={{
            color: '#ffb4ab', fontSize: 11,
            fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.5,
          }}>
            ⚠ {state.error}
          </p>
        )}

        {/* Fade gradient — indicates scrollable content */}
        {showContent && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 44,
            background: 'linear-gradient(transparent, rgba(13,17,42,0.88))',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </div>
  )
}
