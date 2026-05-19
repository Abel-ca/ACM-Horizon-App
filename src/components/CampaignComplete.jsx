import { Trophy, RotateCcw, CheckCircle } from 'lucide-react'
import { AGENTS } from '../agents/agentConfig'

export default function CampaignComplete({ onReset }) {
  return (
    <div
      className="card-enter relative rounded-2xl overflow-hidden text-center"
      style={{
        background: 'linear-gradient(180deg, #0d0e1e 0%, #06070f 100%)',
        border: '1px solid rgba(240,180,41,0.2)',
        boxShadow: '0 0 80px rgba(240,180,41,0.07)',
      }}
    >
      {/* Gold top bar */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f0b429, transparent)' }} />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(240,180,41,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative px-10 py-12">
        {/* Trophy icon */}
        <div
          className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{
            background: 'rgba(240,180,41,0.08)',
            border: '1px solid rgba(240,180,41,0.28)',
            boxShadow: '0 0 32px rgba(240,180,41,0.14)',
          }}
        >
          <Trophy size={28} style={{ color: '#f0b429' }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold mb-2 tracking-tight" style={{ color: '#f0f2ff' }}>
          ¡Campaña Completa!
        </h2>
        <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: '#5a5f80', lineHeight: 1.7 }}>
          Los 4 agentes terminaron. Tu brief integral está listo para
          lanzar en Meta Ads y TikTok Ads.
        </p>

        {/* Agent pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {AGENTS.map(agent => (
            <div
              key={agent.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: `${agent.colorAlpha}0.08)`,
                border: `1px solid ${agent.colorAlpha}0.22)`,
                color: agent.color,
              }}
            >
              <CheckCircle size={11} />
              {agent.name}
            </div>
          ))}
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.45)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(240,180,41,0.35)'
            e.currentTarget.style.color = '#f0b429'
            e.currentTarget.style.background = 'rgba(240,180,41,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
        >
          <RotateCcw size={14} strokeWidth={2} />
          Analizar otro producto
        </button>
      </div>
    </div>
  )
}
