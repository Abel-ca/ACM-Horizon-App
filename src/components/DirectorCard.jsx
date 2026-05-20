import { useEffect, useRef, useState } from 'react'
import { Send, Download, RotateCcw } from 'lucide-react'
import { getTheme } from '../design/agentTheme'
import { AGENTS } from '../agents/agentConfig'

const directorAgent = AGENTS[0]

/* ── Typing dots ───────────────────────────────────────── */
function TypingDots({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '3px 0', color }}>
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  )
}

/* ── CEO bubble (right-aligned, Electric Blue) ─────────── */
function CeoBubble({ content }) {
  return (
    <div className="chat-bubble" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
      <div style={{
        maxWidth: '78%',
        background: 'rgba(46,91,255,0.17)',
        border: '1px solid rgba(46,91,255,0.30)',
        borderRadius: '18px 18px 4px 18px',
        padding: '10px 14px',
      }}>
        <p style={{ color: '#dee0ff', fontSize: 13.5, lineHeight: 1.58 }}>{content}</p>
      </div>
    </div>
  )
}

/* ── Director bubble (left-aligned, glass dark) ─────────── */
function DirectorBubble({ content, isLive, theme }) {
  return (
    <div
      className="chat-bubble"
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}
    >
      {/* Avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: theme.bg, border: `1px solid ${theme.border}`,
        color: theme.color, fontSize: 14, lineHeight: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 2,
        boxShadow: `0 0 12px ${theme.glow}0.15)`,
      }}>
        {directorAgent.icon}
      </div>
      <div style={{ maxWidth: '82%' }}>
        <p style={{
          fontSize: 9, color: theme.color,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: 4,
        }}>
          El Director
        </p>
        <div style={{
          background: 'rgba(8,12,37,0.72)',
          border: '1px solid rgba(184,195,255,0.10)',
          borderRadius: '4px 18px 18px 18px',
          padding: '10px 14px',
          backdropFilter: 'blur(8px)',
        }}>
          {!content ? (
            <TypingDots color={theme.color} />
          ) : (
            <p
              className={isLive ? 'stream-cursor' : ''}
              style={{
                color: '#c4c5d9', fontSize: 13.5, lineHeight: 1.65,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}
            >
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── System pill (centered) ─────────────────────────────── */
function SystemPill({ content }) {
  return (
    <div
      className="chat-bubble"
      style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}
    >
      <div style={{
        background: 'rgba(0,223,193,0.07)',
        border: '1px solid rgba(0,223,193,0.18)',
        borderRadius: 999,
        padding: '4px 14px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00dfc1' }} />
        <span style={{
          color: '#00dfc1', fontSize: 10.5,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 500,
        }}>
          {content}
        </span>
      </div>
    </div>
  )
}

/* ── CTA bubble (campaign complete) ─────────────────────── */
function CtaBubble({ onExport, onReset }) {
  return (
    <div
      className="chat-bubble"
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}
    >
      {/* Gold star avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: 'rgba(245,158,11,0.12)',
        border: '1px solid rgba(245,158,11,0.30)',
        color: '#f59e0b', fontSize: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 2, boxShadow: '0 0 12px rgba(245,158,11,0.18)',
      }}>
        ★
      </div>
      <div style={{ maxWidth: '82%' }}>
        <p style={{
          fontSize: 9, color: '#f59e0b',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: 4,
        }}>
          El Director
        </p>
        <div style={{
          background: 'rgba(8,12,37,0.72)',
          border: '1px solid rgba(245,158,11,0.18)',
          borderRadius: '4px 18px 18px 18px',
          padding: '12px 14px',
          backdropFilter: 'blur(8px)',
        }}>
          <p style={{ color: '#dee0ff', fontSize: 13.5, lineHeight: 1.65, marginBottom: 12 }}>
            ✅ El equipo completó su trabajo. Tu brief integral está listo — investigación, copy y dirección visual para Meta Ads y TikTok Ads.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {onExport && (
              <button
                onClick={onExport}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#080c25', border: 'none',
                  borderRadius: 10, padding: '7px 14px',
                  fontSize: 11, fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: '0 4px 14px rgba(245,158,11,0.28)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.44)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(245,158,11,0.28)'
                }}
              >
                <Download size={11} strokeWidth={2.5} /> Descargar PDF
              </button>
            )}
            <button
              onClick={onReset}
              style={{
                background: 'rgba(22,26,51,0.6)',
                border: '1px solid rgba(184,195,255,0.14)',
                color: '#b8c3ff', borderRadius: 10, padding: '7px 14px',
                fontSize: 11, fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(46,91,255,0.40)'
                e.currentTarget.style.color = '#dee0ff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(184,195,255,0.14)'
                e.currentTarget.style.color = '#b8c3ff'
              }}
            >
              <RotateCcw size={11} strokeWidth={2} /> Nueva campaña
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── DirectorCard ───────────────────────────────────────── */
export default function DirectorCard({
  chatMessages,
  showLiveBubble,
  liveContent,
  directorStatus,   // 'pending'|'active'|'streaming'|'complete'|'approved'
  workflowStarted,
  campaignComplete,
  onSend,
  onExport,
  onReset,
  isMobile,
}) {
  const theme = getTheme('director')
  const [input, setInput] = useState('')
  const chatEndRef = useRef(null)
  const inputRef   = useRef(null)

  /* Auto-scroll chat to bottom */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, showLiveBubble, liveContent])

  const isDisabled = workflowStarted && !campaignComplete
  const isProcessing = directorStatus === 'active' || directorStatus === 'streaming'

  const placeholder = isDisabled
    ? 'El Director está trabajando...'
    : '¿Qué producto quieres analizar? Cuéntale al Director...'

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isDisabled) return
    onSend(trimmed)
    setInput('')
  }

  /* Status badge label + color */
  const badgeColor  = isProcessing ? theme.color : campaignComplete ? '#00dfc1' : workflowStarted ? '#f59e0b' : '#8e90a2'
  const badgeLabel  = isProcessing ? 'Procesando' : campaignComplete ? 'Completo' : workflowStarted ? 'Coordinando' : 'Listo'
  const dotGlow     = isProcessing ? theme.color : campaignComplete ? '#00dfc1' : null

  const cardH = isMobile ? 'min(440px, 52vh)' : 'clamp(460px, 54vh, 640px)'

  return (
    <div
      className="glass-card rounded-2xl stagger-1"
      style={{ height: cardH, display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Top gradient accent ── */}
      <div style={{
        height: 3, flexShrink: 0,
        background: `linear-gradient(90deg, transparent, ${theme.color}, rgba(0,242,209,0.55), transparent)`,
      }} />

      {/* ── Card header ── */}
      <div style={{
        padding: isMobile ? '12px 16px' : '14px 22px',
        borderBottom: '1px solid rgba(184,195,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        background: 'rgba(22,26,51,0.30)',
      }}>
        {/* Left: icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: isMobile ? 38 : 44, height: isMobile ? 38 : 44,
            borderRadius: 14,
            background: theme.bg, border: `1px solid ${theme.border}`,
            color: theme.color, fontSize: isMobile ? 18 : 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 18px ${theme.glow}0.18)`,
            flexShrink: 0,
          }}>
            {directorAgent.icon}
          </div>
          <div>
            <h2 style={{
              color: '#dee0ff', fontFamily: 'Sora, sans-serif',
              fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.2,
            }}>
              {directorAgent.name}
            </h2>
            <p style={{
              color: '#434656', fontSize: 9.5,
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 500, letterSpacing: '0.12em',
              textTransform: 'uppercase', marginTop: 2,
            }}>
              {directorAgent.role} · Eje central
            </p>
          </div>
        </div>

        {/* Right: status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${dotGlow ? `${dotGlow}44` : 'rgba(184,195,255,0.10)'}`,
          borderRadius: 999, padding: '5px 11px',
          flexShrink: 0,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: badgeColor,
            ...(dotGlow && { boxShadow: `0 0 8px ${dotGlow}`, animation: 'systemPulse 2s ease-in-out infinite' }),
          }} />
          <span style={{
            color: badgeColor, fontSize: 10,
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
          }}>
            {badgeLabel}
          </span>
        </div>
      </div>

      {/* ── Chat area ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: isMobile ? '12px 14px 4px' : '16px 22px 4px',
        display: 'flex', flexDirection: 'column',
      }}>
        {chatMessages.map(msg => {
          if (msg.role === 'ceo')    return <CeoBubble    key={msg.id} content={msg.content} />
          if (msg.role === 'system') return <SystemPill   key={msg.id} content={msg.content} />
          if (msg.type  === 'cta')   return <CtaBubble    key={msg.id} onExport={onExport} onReset={onReset} />
          return <DirectorBubble key={msg.id} content={msg.content} theme={theme} />
        })}

        {/* Live streaming bubble (ephemeral while director writes) */}
        {showLiveBubble && (
          <DirectorBubble content={liveContent} isLive theme={theme} />
        )}

        <div ref={chatEndRef} style={{ height: 8 }} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding: isMobile ? '10px 12px' : '12px 16px',
        borderTop: '1px solid rgba(184,195,255,0.07)',
        flexShrink: 0,
      }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isDisabled}
            placeholder={placeholder}
            style={{
              flex: 1, padding: '10px 14px',
              background: 'rgba(8,12,37,0.68)',
              border: `1px solid ${input && !isDisabled ? 'rgba(46,91,255,0.45)' : 'rgba(184,195,255,0.10)'}`,
              borderRadius: 12, color: '#dee0ff',
              fontSize: 13.5, fontFamily: 'Hanken Grotesk, sans-serif',
              outline: 'none', transition: 'border-color 0.2s',
              opacity: isDisabled ? 0.48 : 1,
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isDisabled}
            style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: (input.trim() && !isDisabled) ? 'var(--c-electric)' : 'rgba(22,26,51,0.6)',
              border: `1px solid ${(input.trim() && !isDisabled) ? 'rgba(46,91,255,0.5)' : 'rgba(184,195,255,0.10)'}`,
              color: (input.trim() && !isDisabled) ? '#efefff' : '#434656',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: (input.trim() && !isDisabled) ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: (input.trim() && !isDisabled) ? '0 4px 14px rgba(46,91,255,0.32)' : 'none',
            }}
          >
            <Send size={15} strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  )
}
