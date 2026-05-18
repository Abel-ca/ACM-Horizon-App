import { Trophy, RotateCcw, CheckCircle } from 'lucide-react'
import { AGENTS } from '../agents/agentConfig'

export default function CampaignComplete({ onReset }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden text-center"
      style={{
        background: '#0d0e1e',
        border: '1px solid rgba(240,180,41,0.25)',
        boxShadow: '0 0 60px rgba(240,180,41,0.06)',
        animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(to right, transparent, #f0b429, transparent)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.05) 0%, transparent 65%)',
        }}
      />

      <div className="relative p-10">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{
            background: 'rgba(240,180,41,0.08)',
            border: '1px solid rgba(240,180,41,0.3)',
            boxShadow: '0 0 30px rgba(240,180,41,0.15)',
          }}
        >
          <Trophy className="w-8 h-8" style={{ color: '#f0b429' }} />
        </div>

        <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#f0f2ff' }}>
          ¡Campaña Completa!
        </h2>
        <p className="text-sm max-w-md mx-auto mb-8" style={{ color: '#8b90c0' }}>
          Los 4 agentes completaron su trabajo. Tu brief de campaña integral está listo para
          ejecutarse en Meta Ads y TikTok Ads.
        </p>

        {/* Agent summary pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: `${agent.colorAlpha}0.08)`,
                border: `1px solid ${agent.colorAlpha}0.25)`,
                color: agent.color,
              }}
            >
              <CheckCircle className="w-3 h-3" />
              {agent.name}
            </div>
          ))}
        </div>

        {/* Action */}
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-200"
          style={{
            background: '#111328',
            border: '1px solid #1a1c38',
            color: '#8b90c0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(240,180,41,0.35)'
            e.currentTarget.style.color = '#f0b429'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1a1c38'
            e.currentTarget.style.color = '#8b90c0'
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Analizar otro producto
        </button>
      </div>
    </div>
  )
}
