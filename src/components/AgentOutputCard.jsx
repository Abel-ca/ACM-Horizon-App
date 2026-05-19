import { useState } from 'react'
import { Check, RotateCcw, CheckCircle, AlertTriangle, Copy } from 'lucide-react'
import { getTheme } from '../design/agentTheme'

/* ── Inline bold parser ──────────────────────────────── */
function parseInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={i} style={{ color: '#dde3ff', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
      : part
  )
}

/* ── Formatted markdown ───────────────────────────────── */
function FormattedOutput({ content, accentColor }) {
  return (
    <div className="space-y-0.5">
      {content.split('\n').map((line, i) => {
        const t = line.trim()
        if (!t) return <div key={i} style={{ height: '0.55rem' }} />

        if (/^\*\*[^*]+\*\*:?$/.test(t))
          return <p key={i} className="text-[9px] font-extrabold uppercase tracking-[0.24em] pt-3 pb-0.5"
                    style={{ color: accentColor }}>{t.replace(/\*\*/g, '').replace(/:$/, '')}</p>

        if (t.startsWith('### ')) return <p key={i} className="text-sm font-semibold pt-2 pb-0.5" style={{ color: '#f0f4ff' }}>{t.slice(4)}</p>
        if (t.startsWith('## '))  return <p key={i} className="text-xs font-bold uppercase tracking-[0.15em] pt-3 pb-0.5" style={{ color: accentColor }}>{t.slice(3)}</p>
        if (t.startsWith('# '))   return <p key={i} className="text-base font-extrabold pt-3 pb-1" style={{ color: '#f0f4ff' }}>{t.slice(2)}</p>

        if (t.startsWith('- ') || t.startsWith('• ') || t.startsWith('* '))
          return <div key={i} className="flex gap-2 ml-1 py-0.5">
            <span className="text-xs mt-[3px] flex-shrink-0" style={{ color: accentColor }}>▸</span>
            <span className="text-sm leading-relaxed" style={{ color: '#7a8299' }}>{parseInlineBold(t.slice(2))}</span>
          </div>

        const num = t.match(/^(\d+)\.\s(.+)/)
        if (num) return <div key={i} className="flex gap-2 ml-1 py-0.5">
          <span className="text-xs mt-[3px] flex-shrink-0 font-bold w-5" style={{ color: accentColor }}>{num[1]}.</span>
          <span className="text-sm leading-relaxed" style={{ color: '#7a8299' }}>{parseInlineBold(num[2])}</span>
        </div>

        if (/^[-—]{3,}$/.test(t)) return <div key={i} className="my-3" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

        return <p key={i} className="text-sm leading-relaxed" style={{ color: '#7a8299' }}>{parseInlineBold(line)}</p>
      })}
    </div>
  )
}

/* ── Skeleton loading ─────────────────────────────────── */
function Skeleton() {
  const rows = [88, 100, 72, 94, 56, 83, 97, 48, 75, 63, 90, 70]
  return (
    <div className="space-y-3 py-2">
      {rows.map((w, i) => (
        <div key={i} className="skeleton" style={{ height: 11, width: `${w}%`, animationDelay: `${i * 0.07}s` }} />
      ))}
      <div className="mt-5 space-y-2.5">
        {[100, 96, 88].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: 10, width: `${w}%`, animationDelay: `${(i + 12) * 0.07}s` }} />
        ))}
      </div>
    </div>
  )
}

/* ── Copy button ─────────────────────────────────────── */
function CopyBtn({ content }) {
  const [done, setDone] = useState(false)
  return (
    <button
      onClick={() => navigator.clipboard.writeText(content).then(() => { setDone(true); setTimeout(() => setDone(false), 1800) })}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150"
      style={{
        background: done ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${done ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
        color: done ? '#10b981' : 'rgba(255,255,255,0.3)',
      }}
    >
      {done ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={1.5} />}
      {done ? 'Copiado' : 'Copiar'}
    </button>
  )
}

/* ── Agent Panel — single full-height view ───────────── */
export default function AgentOutputCard({ agent, state, onApprove, onReject, style = {} }) {
  const theme = getTheme(agent.id)

  const isActive   = state.status === 'active'
  const isStreaming = state.status === 'streaming'
  const isComplete = state.status === 'complete'
  const isApproved = state.status === 'approved'
  const isError    = state.status === 'error'
  const isLive     = isActive || isStreaming
  const showSkeleton = isLive && !state.content

  return (
    <div
      className="panel-enter flex flex-col h-full"
      style={style}
    >
      {/* Glass card — fills height, left accent border via inset shadow + overflow:hidden trick */}
      <div
        className="flex flex-col flex-1 overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
        }}
      >
        {/* Left accent bar 3px */}
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
            background: isApproved
              ? '#10b981'
              : `linear-gradient(180deg, ${theme.color} 0%, ${theme.glow}0.4) 100%)`,
            transition: 'background 0.5s ease',
          }}
        />

        {/* ── Card header ── */}
        <div
          className="flex items-center justify-between px-7 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex items-center gap-3">
            {/* 44px icon */}
            <div
              style={{
                width: 44, height: 44, borderRadius: 14,
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                color: theme.color,
                fontSize: 22, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {agent.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold" style={{ color: '#f0f4ff' }}>{agent.name}</h3>
                <span className="role-badge" style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.color }}>
                  {agent.role}
                </span>
              </div>
              <p className="text-[10px] mt-0.5" style={{ color: '#3a4255' }}>{agent.description}</p>
            </div>
          </div>

          {/* Status + copy */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isLive && (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: theme.color }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: theme.color }} />
                {isActive ? 'Iniciando…' : 'Generando…'}
              </span>
            )}
            {isComplete && (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: theme.color }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: theme.color }} />
                Listo para revisión
              </span>
            )}
            {isApproved && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: '#10b981' }}>
                <CheckCircle size={11} /> Aprobado
              </span>
            )}
            {isError && (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: '#f43f5e' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#f43f5e' }} /> Error
              </span>
            )}
            {state.content && <CopyBtn content={state.content} />}
          </div>
        </div>

        {/* ── Scrollable content area ── */}
        <div
          className="flex-1 overflow-y-auto px-7 py-5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
        >
          {isError && (
            <div className="flex items-start gap-3 p-4 rounded-xl mb-4"
                 style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.16)' }}>
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#f43f5e' }} />
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#f43f5e' }}>Error al generar</p>
                <p className="text-xs" style={{ color: '#7a8299' }}>{state.error}</p>
              </div>
            </div>
          )}

          {showSkeleton ? (
            <Skeleton />
          ) : state.content ? (
            <div className={`stream-text${isStreaming ? ' stream-cursor' : ''}`}>
              <FormattedOutput content={state.content} accentColor={theme.color} />
            </div>
          ) : !isError ? (
            <Skeleton />
          ) : null}
        </div>

        {/* ── Sticky footer — ALWAYS visible, never scrolls away ── */}
        {isComplete && (
          <div
            className="flex-shrink-0 flex items-center justify-between px-7 py-4"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="text-[10px]" style={{ color: '#3a4255' }}>¿Aprobás este output?</p>
            <div className="flex items-center gap-2">
              <button onClick={onReject} className="btn-redir">
                <RotateCcw size={12} strokeWidth={2} /> Redirigir
              </button>
              <button onClick={onApprove} className="btn-approve">
                <Check size={13} strokeWidth={2.5} /> Aprobar
              </button>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="flex-shrink-0 flex items-center gap-2 px-7 py-3"
               style={{ borderTop: '1px solid rgba(16,185,129,0.1)', background: 'rgba(16,185,129,0.04)' }}>
            <CheckCircle size={12} style={{ color: '#10b981' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#10b981' }}>
              Output aprobado — incluido en el contexto del siguiente agente
            </span>
          </div>
        )}

        {isError && (
          <div className="flex-shrink-0 flex justify-end px-7 py-4"
               style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={onReject} className="btn-redir">
              <RotateCcw size={12} strokeWidth={2} /> Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
