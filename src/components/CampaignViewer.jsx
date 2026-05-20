import { ArrowLeft, Download, CheckCircle } from 'lucide-react'
import { AGENTS } from '../agents/agentConfig'
import { getTheme } from '../design/agentTheme'
import { downloadPdf } from '../lib/pdfExport'

/* ── Inline bold renderer ─────────────────────────────── */
function parseInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return text
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p)
      ? <strong key={i} style={{ color: '#dee0ff', fontWeight: 600 }}>{p.slice(2, -2)}</strong>
      : p
  )
}

/* ── Markdown renderer ────────────────────────────────── */
function FormattedOutput({ content, accentColor }) {
  return (
    <div className="space-y-0.5">
      {content.split('\n').map((line, i) => {
        const t = line.trim()
        if (!t) return <div key={i} style={{ height: '0.5rem' }} />
        if (/^\*\*[^*]+\*\*:?$/.test(t))
          return (
            <p key={i}
               className="text-[9px] font-extrabold uppercase tracking-[0.22em] pt-3 pb-0.5"
               style={{ color: accentColor, fontFamily: 'JetBrains Mono, monospace' }}>
              {t.replace(/\*\*/g, '').replace(/:$/, '')}
            </p>
          )
        if (t.startsWith('### '))
          return <p key={i} className="text-sm font-semibold pt-2 pb-0.5"
                    style={{ color: '#dee0ff', fontFamily: 'Sora, sans-serif' }}>{t.slice(4)}</p>
        if (t.startsWith('## '))
          return <p key={i}
                    className="text-xs font-bold uppercase tracking-[0.14em] pt-3 pb-0.5"
                    style={{ color: accentColor, fontFamily: 'JetBrains Mono, monospace' }}>{t.slice(3)}</p>
        if (t.startsWith('# '))
          return <p key={i} className="text-base font-bold pt-3 pb-1"
                    style={{ color: '#dee0ff', fontFamily: 'Sora, sans-serif' }}>{t.slice(2)}</p>
        if (t.startsWith('- ') || t.startsWith('• ') || t.startsWith('* '))
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-xs mt-[3px] flex-shrink-0" style={{ color: accentColor }}>▸</span>
              <span className="text-sm leading-relaxed" style={{ color: '#c4c5d9' }}>
                {parseInlineBold(t.slice(2))}
              </span>
            </div>
          )
        const num = t.match(/^(\d+)\.\s(.+)/)
        if (num)
          return (
            <div key={i} className="flex gap-2 ml-1 py-0.5">
              <span className="text-xs mt-[3px] flex-shrink-0 font-bold w-5"
                    style={{ color: accentColor, fontFamily: 'JetBrains Mono, monospace' }}>
                {num[1]}.
              </span>
              <span className="text-sm leading-relaxed" style={{ color: '#c4c5d9' }}>
                {parseInlineBold(num[2])}
              </span>
            </div>
          )
        if (/^[-—]{3,}$/.test(t))
          return <div key={i} className="my-3"
                      style={{ height: 1, background: 'rgba(184,195,255,0.08)' }} />
        return (
          <p key={i} className="text-sm leading-relaxed" style={{ color: '#c4c5d9' }}>
            {parseInlineBold(line)}
          </p>
        )
      })}
    </div>
  )
}

/* ── Single agent card (read-only) ─────────────────────── */
function AgentCard({ agent, content }) {
  const theme = getTheme(agent.id)
  if (!content) return null
  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: 'rgba(22,26,51,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(184,195,255,0.10)',
        position: 'relative',
      }}
    >
      {/* Left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#00dfc1' }} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-7 py-4"
        style={{
          borderBottom: '1px solid rgba(184,195,255,0.07)',
          background: 'rgba(22,26,51,0.35)',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: theme.bg, border: `1px solid ${theme.border}`,
            color: theme.color, fontSize: 22, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {agent.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-display" style={{ color: '#dee0ff' }}>
                {agent.name}
              </h3>
              <span className="role-badge"
                    style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.color }}>
                {agent.role}
              </span>
            </div>
            <p className="text-[10px] mt-0.5" style={{ color: '#434656' }}>{agent.description}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold"
              style={{ color: '#00dfc1', fontFamily: 'JetBrains Mono, monospace' }}>
          <CheckCircle size={11} /> Aprobado
        </span>
      </div>

      {/* Content */}
      <div className="px-7 py-5">
        <FormattedOutput content={content} accentColor={theme.color} />
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-2 px-7 py-3"
        style={{
          borderTop: '1px solid rgba(0,223,193,0.10)',
          background: 'rgba(0,223,193,0.04)',
        }}
      >
        <CheckCircle size={12} style={{ color: '#00dfc1' }} />
        <span className="text-[10px] font-semibold"
              style={{ color: '#00dfc1', fontFamily: 'JetBrains Mono, monospace' }}>
          Output incluido en el brief final
        </span>
      </div>
    </div>
  )
}

/* ── CampaignViewer ─────────────────────────────────────── */
export default function CampaignViewer({ campaign, onBack }) {
  const handleDownload = () => downloadPdf(campaign.product, campaign.outputs)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Sticky top bar */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-6 py-3"
        style={{
          background: 'rgba(8,12,37,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(184,195,255,0.07)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
            style={{
              background: 'rgba(22,26,51,0.6)',
              border: '1px solid rgba(184,195,255,0.10)',
              color: 'rgba(184,195,255,0.45)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(46,91,255,0.40)'
              e.currentTarget.style.color = '#b8c3ff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(184,195,255,0.10)'
              e.currentTarget.style.color = 'rgba(184,195,255,0.45)'
            }}
          >
            <ArrowLeft size={13} strokeWidth={2} /> Volver
          </button>
          <div>
            <p className="text-xs font-bold font-display" style={{ color: '#dee0ff' }}>
              {campaign.product}
            </p>
            <p className="text-[9px]"
               style={{ color: '#434656', fontFamily: 'JetBrains Mono, monospace' }}>
              {campaign.date} · ${campaign.estimatedCost?.toFixed(3)}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#080c25',
            boxShadow: '0 4px 16px rgba(245,158,11,0.24)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(245,158,11,0.40)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.24)'
          }}
        >
          <Download size={13} strokeWidth={2.5} /> Descargar PDF
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px 32px' }}>
        {AGENTS.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            content={campaign.outputs?.[agent.id]}
          />
        ))}
      </div>
    </div>
  )
}
