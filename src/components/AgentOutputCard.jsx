import { Check, RotateCcw, CheckCircle, Loader, AlertTriangle, Copy } from 'lucide-react'
import { useState } from 'react'

/* ── Inline bold parser ──────────────────────────────────────── */
function parseInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={i} style={{ color: '#e8ecff', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
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
            <p key={i} className="text-[10px] font-extrabold uppercase tracking-[0.22em] pt-3 pb-0.5"
               style={{ color: accentColor }}>
              {t.replace(/\*\*/g, '').replace(/:$/, '')}
            </p>
          )
        }
        if (t.startsWith('### ')) return <p key={i} className="text-sm font-semibold pt-2 pb-0.5" style={{ color: '#f0f2ff' }}>{t.slice(4)}</p>
        if (t.startsWith('## '))  return <p key={i} className="text-xs font-bold uppercase tracking-[0.15em] pt-3 pb-0.5" style={{ color: accentColor }}>{t.slice(3)}</p>
        if (t.startsWith('# '))   return <p key={i} className="text-base font-extrabold pt-3 pb-1" style={{ color: '#f0f2ff' }}>{t.slice(2)}</p>

        if (t.startsWith('- ') || t.startsWith('• ') || t.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-xs mt-[3px] flex-shrink-0" style={{ color: accentColor }}>▸</span>
              <span className="text-sm leading-relaxed" style={{ color: '#8b90c0' }}>{parseInlineBold(t.slice(2))}</span>
            </div>
          )
        }

        const numMatch = t.match(/^(\d+)\.\s(.+)/)
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-xs mt-[3px] flex-shrink-0 font-bold w-5" style={{ color: accentColor }}>{numMatch[1]}.</span>
              <span className="text-sm leading-relaxed" style={{ color: '#8b90c0' }}>{parseInlineBold(numMatch[2])}</span>
            </div>
          )
        }

        if (/^[-—]{3,}$/.test(t)) {
          return <div key={i} className="my-3" style={{ height: '1px', background: '#1e2248' }} />
        }

        return (
          <p key={i} className="text-sm leading-relaxed" style={{ color: '#8b90c0' }}>
            {parseInlineBold(line)}
          </p>
        )
      })}
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
      title="Copiar al portapapeles"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150"
      style={{
        background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
        color: copied ? '#10b981' : 'rgba(255,255,255,0.3)',
      }}
    >
      {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={2} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

/* ── Card ────────────────────────────────────────────────────── */
export default function AgentOutputCard({ agent, state, onApprove, onReject }) {
  const isActive   = state.status === 'active'
  const isStreaming = state.status === 'streaming'
  const isComplete = state.status === 'complete'
  const isApproved = state.status === 'approved'
  const isError    = state.status === 'error'
  const isLive     = isActive || isStreaming

  const accentColor = isApproved ? '#10b981' : agent.color

  return (
    <div
      className="card-enter relative rounded-xl overflow-hidden"
      style={{
        background: '#0d0e1e',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: isLive
          ? `0 0 40px ${agent.colorAlpha}0.12)`
          : isApproved
          ? '0 0 24px rgba(16,185,129,0.07)'
          : 'none',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* LEFT accent border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl transition-all duration-500"
        style={{
          background: isApproved
            ? '#10b981'
            : isLive
            ? `linear-gradient(180deg, ${agent.color}, ${agent.colorAlpha}0.4))`
            : isComplete
            ? agent.color
            : 'rgba(255,255,255,0.07)',
        }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between pl-7 pr-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          {/* Icon badge */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{
              background: `${agent.colorAlpha}0.09)`,
              border: `1px solid ${agent.colorAlpha}0.28)`,
              color: agent.color,
            }}
          >
            {agent.icon}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold" style={{ color: '#f0f2ff' }}>{agent.name}</h3>
              <span
                className="role-badge"
                style={{
                  background: `${agent.colorAlpha}0.08)`,
                  border: `1px solid ${agent.colorAlpha}0.22)`,
                  color: agent.color,
                }}
              >
                {agent.role}
              </span>
            </div>
            <p className="text-[10px] mt-0.5" style={{ color: '#3a3f60' }}>{agent.description}</p>
          </div>
        </div>

        {/* Status chip */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {(isActive || isStreaming) && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: agent.color }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: agent.color }} />
              {isActive ? 'Iniciando…' : 'Generando…'}
            </span>
          )}
          {isComplete && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: agent.color }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: agent.color }} />
              Listo
            </span>
          )}
          {isApproved && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: '#10b981' }}>
              <Check size={11} strokeWidth={2.5} style={{ color: '#10b981' }} />
              Aprobado
            </span>
          )}
          {isError && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: '#f43f5e' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#f43f5e' }} />
              Error
            </span>
          )}
          {/* Copy button when there's content */}
          {state.content && <CopyButton content={state.content} />}
        </div>
      </div>

      {/* Content */}
      <div className="pl-7 pr-5 py-5">
        {isError && (
          <div
            className="flex items-start gap-3 p-4 rounded-lg mb-4"
            style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.18)' }}
          >
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#f43f5e' }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: '#f43f5e' }}>Error al generar</p>
              <p className="text-xs" style={{ color: '#8b90c0' }}>{state.error}</p>
            </div>
          </div>
        )}

        {state.content ? (
          <div
            className={`stream-text max-h-[560px] overflow-y-auto pr-2${isStreaming ? ' cursor-stream' : ''}`}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2248 transparent' }}
          >
            <FormattedOutput content={state.content} accentColor={agent.color} />
          </div>
        ) : !isError ? (
          <div className="flex items-center gap-3 py-12 justify-center">
            <Loader size={18} className="animate-spin" style={{ color: agent.color }} />
            <span className="text-sm" style={{ color: '#3a3f60' }}>Analizando…</span>
          </div>
        ) : null}
      </div>

      {/* Action footer — approval buttons */}
      {isComplete && (
        <div
          className="flex items-center justify-between pl-7 pr-5 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)' }}
        >
          <p className="text-[10px] text-white/25">¿Aprobás este output?</p>
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

      {/* Approved bar */}
      {isApproved && (
        <div
          className="flex items-center gap-2 pl-7 pr-5 py-3"
          style={{ borderTop: '1px solid rgba(16,185,129,0.12)', background: 'rgba(16,185,129,0.04)' }}
        >
          <CheckCircle size={13} style={{ color: '#10b981' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#10b981' }}>
            Output aprobado — incluido en el contexto del siguiente agente
          </span>
        </div>
      )}

      {/* Error retry */}
      {isError && (
        <div
          className="flex items-center justify-end gap-2 pl-7 pr-5 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
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
