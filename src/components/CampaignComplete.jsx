import { RotateCcw, Download, Trophy } from 'lucide-react'
import { AGENTS } from '../agents/agentConfig'
import { getTheme } from '../design/agentTheme'

export default function CampaignComplete({ onReset, onExport }) {
  return (
    <div className="panel-enter flex flex-col items-center justify-center h-full text-center px-8 py-12">
      {/* Glass card */}
      <div
        className="w-full max-w-xl rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(22,26,51,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(245,158,11,0.20)',
          boxShadow: '0 0 80px rgba(245,158,11,0.06)',
        }}
      >
        {/* Gold top accent */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }} />

        <div className="px-10 py-10">
          {/* Trophy */}
          <div
            className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{
              background: 'rgba(245,158,11,0.10)',
              border: '1px solid rgba(245,158,11,0.28)',
              boxShadow: '0 0 32px rgba(245,158,11,0.14)',
            }}
          >
            <Trophy size={28} style={{ color: '#f59e0b' }} />
          </div>

          <h2
            className="text-2xl font-display font-bold mb-2 tracking-tight"
            style={{ letterSpacing: '-0.02em', color: '#dee0ff' }}
          >
            ¡Campaña lista para lanzar!
          </h2>
          <p className="text-sm mb-8"
             style={{ color: '#8e90a2', lineHeight: 1.7, maxWidth: 360, margin: '0 auto 32px' }}>
            Los 4 agentes completaron su trabajo. Tu brief integral está listo para Meta Ads y TikTok Ads.
          </p>

          {/* Agent pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {AGENTS.map(agent => {
              const t = getTheme(agent.id)
              return (
                <div
                  key={agent.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}
                >
                  <span>{agent.icon}</span>
                  {agent.name}
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#080c25',
                  boxShadow: '0 4px 20px rgba(245,158,11,0.28)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(245,158,11,0.44)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,158,11,0.28)'
                }}
              >
                <Download size={14} strokeWidth={2.5} /> Descargar campaña completa
              </button>
            )}
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
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
              <RotateCcw size={14} strokeWidth={2} /> Otro producto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
