import { Check, RefreshCw, CheckCircle, Loader, AlertTriangle } from 'lucide-react'

function parseInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part) ? (
      <strong key={i} style={{ color: '#f0f2ff', fontWeight: 600 }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  )
}

function FormattedOutput({ content, accentColor }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} style={{ height: '0.6rem' }} />

        // Bold-only lines → section header
        if (/^\*\*[^*]+\*\*:?$/.test(trimmed)) {
          const text = trimmed.replace(/\*\*/g, '').replace(/:$/, '')
          return (
            <p
              key={i}
              className="text-[10px] font-bold uppercase tracking-[0.2em] pt-3 pb-0.5"
              style={{ color: accentColor }}
            >
              {text}
            </p>
          )
        }

        // Markdown headings
        if (trimmed.startsWith('### ')) {
          return (
            <p key={i} className="text-sm font-semibold pt-2 pb-0.5" style={{ color: '#f0f2ff' }}>
              {trimmed.slice(4)}
            </p>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <p
              key={i}
              className="text-xs font-bold uppercase tracking-[0.15em] pt-3 pb-0.5"
              style={{ color: accentColor }}
            >
              {trimmed.slice(3)}
            </p>
          )
        }
        if (trimmed.startsWith('# ')) {
          return (
            <p key={i} className="text-base font-extrabold pt-3 pb-1" style={{ color: '#f0f2ff' }}>
              {trimmed.slice(2)}
            </p>
          )
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-xs mt-[3px] flex-shrink-0" style={{ color: accentColor }}>
                ▸
              </span>
              <span className="text-sm leading-relaxed" style={{ color: '#8b90c0' }}>
                {parseInlineBold(trimmed.slice(2))}
              </span>
            </div>
          )
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s(.+)/)
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span
                className="text-xs mt-[3px] flex-shrink-0 font-bold w-5"
                style={{ color: accentColor }}
              >
                {numMatch[1]}.
              </span>
              <span className="text-sm leading-relaxed" style={{ color: '#8b90c0' }}>
                {parseInlineBold(numMatch[2])}
              </span>
            </div>
          )
        }

        // Horizontal rule
        if (/^[-—]{3,}$/.test(trimmed)) {
          return (
            <div
              key={i}
              className="my-3"
              style={{ height: '1px', background: '#1a1c38' }}
            />
          )
        }

        // Paragraph
        return (
          <p key={i} className="text-sm leading-relaxed" style={{ color: '#8b90c0' }}>
            {parseInlineBold(line)}
          </p>
        )
      })}
    </div>
  )
}

export default function AgentOutputCard({ agent, state, isCurrentAgent, onApprove, onReject }) {
  const isStreaming = state.status === 'streaming' || state.status === 'active'
  const isComplete = state.status === 'complete'
  const isApproved = state.status === 'approved'
  const isError = state.status === 'error'

  const borderColor = isApproved
    ? 'rgba(16,185,129,0.3)'
    : isStreaming || isComplete
    ? `${agent.colorAlpha}0.35)`
    : '#1a1c38'

  const shadowColor = isApproved
    ? 'rgba(16,185,129,0.07)'
    : isStreaming
    ? `${agent.colorAlpha}0.09)`
    : 'transparent'

  const topBarGradient = isApproved
    ? 'linear-gradient(to right, transparent, rgba(16,185,129,0.6), transparent)'
    : `linear-gradient(to right, transparent, ${agent.color}80, transparent)`

  return (
    <div
      className="agent-card"
      style={{
        borderColor,
        boxShadow: `0 0 40px ${shadowColor}`,
      }}
    >
      {/* Top color bar */}
      <div style={{ height: '2px', background: topBarGradient }} />

      {/* Card header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid #1a1c38' }}
      >
        <div className="flex items-center gap-3">
          {/* Agent icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
            style={{
              background: `${agent.colorAlpha}0.08)`,
              border: `1px solid ${agent.colorAlpha}0.3)`,
              color: agent.color,
            }}
          >
            {agent.icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm" style={{ color: '#f0f2ff' }}>
                {agent.name}
              </h3>
              <span
                className="role-badge"
                style={{
                  background: `${agent.colorAlpha}0.08)`,
                  border: `1px solid ${agent.colorAlpha}0.25)`,
                  color: agent.color,
                }}
              >
                {agent.role}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#3a3f60' }}>
              {agent.description}
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isStreaming && (
            <>
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: agent.color }}
              />
              <span className="text-xs" style={{ color: '#8b90c0' }}>
                Generando...
              </span>
            </>
          )}
          {isComplete && (
            <>
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: agent.color }}
              />
              <span className="text-xs" style={{ color: '#8b90c0' }}>
                Listo para revisión
              </span>
            </>
          )}
          {isApproved && (
            <>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
              <span className="text-xs" style={{ color: '#10b981' }}>
                Aprobado
              </span>
            </>
          )}
          {isError && (
            <>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f43f5e' }} />
              <span className="text-xs" style={{ color: '#f43f5e' }}>
                Error
              </span>
            </>
          )}
          {state.status === 'active' && (
            <>
              <Loader
                className="w-3.5 h-3.5 animate-spin"
                style={{ color: agent.color }}
              />
              <span className="text-xs" style={{ color: '#8b90c0' }}>
                Iniciando...
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="px-6 py-5">
        {isError && (
          <div
            className="flex items-start gap-3 p-4 rounded-lg mb-4"
            style={{
              background: 'rgba(244,63,94,0.06)',
              border: '1px solid rgba(244,63,94,0.2)',
            }}
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#f43f5e' }} />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: '#f43f5e' }}>
                Error al generar
              </p>
              <p className="text-xs" style={{ color: '#8b90c0' }}>
                {state.error}
              </p>
            </div>
          </div>
        )}

        {state.content ? (
          <div
            className={`stream-text max-h-[560px] overflow-y-auto pr-1 ${
              isStreaming ? 'cursor-stream' : ''
            }`}
          >
            <FormattedOutput content={state.content} accentColor={agent.color} />
          </div>
        ) : !isError ? (
          <div className="flex items-center gap-3 py-10 justify-center">
            <Loader
              className="w-5 h-5 animate-spin"
              style={{ color: agent.color }}
            />
            <span className="text-sm" style={{ color: '#3a3f60' }}>
              Analizando...
            </span>
          </div>
        ) : null}
      </div>

      {/* Action footer — only when complete and awaiting approval */}
      {isComplete && (
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: '1px solid #1a1c38', background: 'rgba(17,19,40,0.5)' }}
        >
          <p className="text-xs" style={{ color: '#3a3f60' }}>
            ¿Aprobás este output y continuás al siguiente agente?
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onReject} className="btn-regen">
              <RefreshCw className="w-3 h-3" />
              Regenerar
            </button>
            <button onClick={onApprove} className="btn-approve">
              <Check className="w-3.5 h-3.5" />
              Aprobar
            </button>
          </div>
        </div>
      )}

      {/* Approved confirmation bar */}
      {isApproved && (
        <div
          className="flex items-center gap-2 px-6 py-3"
          style={{
            borderTop: '1px solid rgba(16,185,129,0.15)',
            background: 'rgba(16,185,129,0.04)',
          }}
        >
          <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
          <span className="text-xs font-semibold" style={{ color: '#10b981' }}>
            Output aprobado — incluido en el contexto del siguiente agente
          </span>
        </div>
      )}

      {/* Error retry */}
      {isError && (
        <div
          className="flex items-center justify-end gap-2 px-6 py-4"
          style={{ borderTop: '1px solid #1a1c38' }}
        >
          <button onClick={onReject} className="btn-regen">
            <RefreshCw className="w-3 h-3" />
            Reintentar
          </button>
        </div>
      )}
    </div>
  )
}
