import { useState } from 'react'
import { Check, RotateCcw, CheckCircle, AlertTriangle, Copy } from 'lucide-react'

/* ── Inline bold parser ──────────────────────────────────────── */
function parseInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={i} style={{ color: '#dde3ff', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
      : part
  )
}

/* ── Formatted markdown output ───────────────────────────────── */
function FormattedOutput({ content, accentColor }) {
  return (
    <div className="space-y-0.5">
      {content.split('\n').map((line, i) => {
        const t = line.trim()
        if (!t) return <div key={i} style={{ height: '0.55rem' }} />

        if (/^\*\*[^*]+\*\*:?$/.test(t)) {
          return (
            <p key={i}
               className="text-[9px] font-extrabold uppercase tracking-[0.24em] pt-3 pb-0.5"
               style={{ color: accentColor }}>
              {t.replace(/\*\*/g, '').replace(/:$/, '')}
            </p>
          )
        }
        if (t.startsWith('### ')) return (
          <p key={i} className="text-sm font-semibold pt-2 pb-0.5" style={{ color: '#f0f4ff' }}>
            {t.slice(4)}
          </p>
        )
        if (t.startsWith('## ')) return (
          <p key={i} className="text-xs font-bold uppercase tracking-[0.15em] pt-3 pb-0.5" style={{ color: accentColor }}>
            {t.slice(3)}
          </p>
        )
        if (t.startsWith('# ')) return (
          <p key={i} className="text-base font-extrabold pt-3 pb-1" style={{ color: '#f0f4ff' }}>
            {t.slice(2)}
          </p>
        )

        if (t.startsWith('- ') || t.startsWith('• ') || t.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-xs mt-[3px] flex-shrink-0" style={{ color: accentColor }}>▸</span>
              <span className="text-sm leading-relaxed" style={{ color: '#7a8299' }}>{parseInlineBold(t.slice(2))}</span>
            </div>
          )
        }

        const numMatch = t.match(/^(\d+)\.\s(.+)/)
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-xs mt-[3px] flex-shrink-0 font-bold w-5" style={{ color: accentColor }}>{numMatch[1]}.</span>
              <span className="text-sm leading-relaxed" style={{ color: '#7a8299' }}>{parseInlineBold(numMatch[2])}</span>
            </div>
          )
        }

        if (/^[-—]{3,}$/.test(t)) {
          return <div key={i} className="my-3" style={{ height: '1px', background: '#1e2530' }} />
        }

        return (
          <p key={i} className="text-sm leading-relaxed" style={{ color: '#7a8299' }}>
            {parseInlineBold(line)}
          </p>
        )
      })}
    </div>
  )
}

/* ── Skeleton loading ────────────────────────────────────────── */
function SkeletonContent() {
  const lines = [88, 100, 72, 94, 55, 82, 97, 48, 76, 62]
  return (
    <div className="space-y-3 py-2">
      {lines.map((w, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            height: 11,
            width: `${w}%`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
      {/* Wider skeleton block for a "paragraph" feel */}
      <div className="mt-4 space-y-2">
        {[100, 95, 88].map((w, i) => (
          <div
            key={`p${i}`}
            className="skeleton-line"
            style={{ height: 10, width: `${w}%`, animationDelay: `${(i + lines.length) * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Copy button ─────────────────────────────────────────────── */
function CopyButton({ content }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150"
      style={{
        background: copied ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${copied ? 'rgba(16,185,129,0.25)' : '#1e2530'}`,
        color: copied ? '#10b981' : 'rgba(255,255,255,0.25)',
      }}
    >
      {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={1.5} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

/* ── Card ────────────────────────────────────────────────────── */
export default function AgentOutputCard({ agent, state, onApprove, onReject }) {
  const [hovered, setHovered] = useState(false)

  const isActive   = state.status === 'active'
  const isStreaming = state.status === 'streaming'
  const isComplete = state.status === 'complete'
  const isApproved = state.status === 'approved'
  const isError    = state.status === 'error'
  const isLive     = isActive || isStreaming

  // Show skeleton while agent is active but hasn't emitted content yet
  const showSkeleton = isLive && !state.content

  const accentColor = isApproved ? '#10b981' : agent.color

  // Border color: dim default → glows on hover or when live/complete
  const borderColor = hovered
    ? `${agent.color}50`
    : isApproved
    ? 'rgba(16,185,129,0.25)'
    : isLive || isComplete
    ? `${agent.colorAlpha}0.22)`
    : '#1e2530'

  const boxShadow = hovered
    ? `0 0 28px ${agent.color}14, 0 4px 24px rgba(0,0,0,0.3)`
    : isApproved
    ? '0 0 20px rgba(16,185,129,0.06)'
    : isLive
    ? `0 0 32px ${agent.colorAlpha}0.1)`
    : '0 2px 16px rgba(0,0,0,0.25)'

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#0e1117',
        border: `1px solid ${borderColor}`,
        boxShadow,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── LEFT accent border 3px ── */}
      <div
        className="absolute left-0 top-0 bottom-0 rounded-l-2xl"
        style={{
          width: 3,
          background: isApproved
            ? '#10b981'
            : isLive
            ? `linear-gradient(180deg, ${agent.color} 0%, ${agent.colorAlpha}0.35) 100%)`
            : isComplete
            ? agent.color
            : '#1e2530',
          transition: 'background 0.4s ease',
        }}
      />

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between pl-7 pr-5 py-4"
        style={{
          borderBottom: '1px solid #1e2530',
          background: '#111520', // slightly lighter than card body
        }}
      >
        <div className="flex items-center gap-3">
          {/* 32px icon */}
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 44,
              height: 44,
              background: `${agent.colorAlpha}0.1)`,
              border: `1px solid ${agent.colorAlpha}0.28)`,
              color: agent.color,
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            {agent.icon}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold" style={{ color: '#f0f4ff' }}>{agent.name}</h3>
              <span
                className="role-badge"
                style={{
                  background: `${agent.colorAlpha}0.08)`,
                  border: `1px solid ${agent.colorAlpha}0.2)`,
                  color: agent.color,
                }}
              >
                {agent.role}
              </span>
            </div>
            <p className="text-[10px] mt-0.5" style={{ color: '#3a4255' }}>{agent.description}</p>
          </div>
        </div>

        {/* Status + copy */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isLive && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: agent.color }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: agent.color }} />
              {isActive ? 'Iniciando…' : 'Generando…'}
            </span>
          )}
          {isComplete && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: agent.color }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: agent.color }} />
              Listo para revisión
            </span>
          )}
          {isApproved && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: '#10b981' }}>
              <Check size={11} strokeWidth={2.5} />
              Aprobado
            </span>
          )}
          {isError && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: '#f43f5e' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#f43f5e' }} />
              Error
            </span>
          )}
          {state.content && <CopyButton content={state.content} />}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="pl-7 pr-5 py-5">
        {isError && (
          <div
            className="flex items-start gap-3 p-4 rounded-xl mb-4"
            style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.16)' }}
          >
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#f43f5e' }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: '#f43f5e' }}>Error al generar</p>
              <p className="text-xs" style={{ color: '#7a8299' }}>{state.error}</p>
            </div>
          </div>
        )}

        {showSkeleton ? (
          <SkeletonContent />
        ) : state.content ? (
          <div
            className={`stream-text max-h-[560px] overflow-y-auto pr-2${isStreaming ? ' cursor-stream' : ''}`}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2530 transparent' }}
          >
            <FormattedOutput content={state.content} accentColor={agent.color} />
          </div>
        ) : !isError ? (
          <SkeletonContent />
        ) : null}
      </div>

      {/* ── Approve/Redirigir footer ── */}
      {isComplete && (
        <div
          className="flex items-center justify-between pl-7 pr-5 py-4"
          style={{ borderTop: '1px solid #1e2530', background: 'rgba(0,0,0,0.2)' }}
        >
          <p className="text-[10px]" style={{ color: '#3a4255' }}>¿Aprobás este output?</p>
          <div className="flex items-center gap-2">
            <button onClick={onReject} className="btn-redir">
              <RotateCcw size={12} strokeWidth={2} />
              Redirigir
            </button>
            <button onClick={onApprove} className="btn-approve">
              <Check size={13} strokeWidth={2.5} />
              Aprobar
            </button>
          </div>
        </div>
      )}

      {/* ── Approved bar ── */}
      {isApproved && (
        <div
          className="flex items-center gap-2 pl-7 pr-5 py-3"
          style={{ borderTop: '1px solid rgba(16,185,129,0.1)', background: 'rgba(16,185,129,0.04)' }}
        >
          <CheckCircle size={12} style={{ color: '#10b981' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#10b981' }}>
            Output aprobado — incluido en el contexto del siguiente agente
          </span>
        </div>
      )}

      {/* ── Error retry ── */}
      {isError && (
        <div
          className="flex justify-end pl-7 pr-5 py-4"
          style={{ borderTop: '1px solid #1e2530' }}
        >
          <button onClick={onReject} className="btn-redir">
            <RotateCcw size={12} strokeWidth={2} />
            Reintentar
          </button>
        </div>
      )}
    </div>
  )
}
