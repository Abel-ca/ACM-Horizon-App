import { Clock, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const MOCK = [
  { id: 'm1', product: 'Masajeador cervical eléctrico', date: '14 may', estimatedCost: 0.041 },
  { id: 'm2', product: 'Fajas reductoras térmicas',    date: '12 may', estimatedCost: 0.038 },
  { id: 'm3', product: 'Pulsera de amatista premium',  date: '10 may', estimatedCost: 0.044 },
  { id: 'm4', product: 'Colágeno marino hidrolizado',  date: '8 may',  estimatedCost: 0.039 },
  { id: 'm5', product: 'Cargador solar portátil 20W',  date: '6 may',  estimatedCost: 0.036 },
]

const ACCENT = '#6366f1' // Primary indigo accent for sidebar hover

function SidebarItem({ campaign, isEmpty }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="relative px-3 py-2.5 rounded-xl cursor-default transition-all duration-150"
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderLeft: `2px solid ${hovered ? ACCENT : 'transparent'}`,
        opacity: isEmpty ? 0.45 : 1,
        paddingLeft: hovered ? 10 : 12,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="text-[11px] font-semibold leading-snug mb-1" style={{ color: '#c0c8e0' }}>
        {campaign.product}
      </p>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest" style={{ color: '#10b981' }}>
          <CheckCircle2 size={8} /> OK
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{campaign.date}</span>
          {campaign.estimatedCost != null && (
            <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.15)' }}>
              ${campaign.estimatedCost.toFixed(3)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Empty state illustration ── */
function SidebarEmpty() {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <svg width="56" height="64" viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg"
           style={{ marginBottom: 12, opacity: 0.35 }}>
        <ellipse cx="28" cy="30" rx="12" ry="20" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.2"/>
        <path d="M28 6 C18 16 16 24 16 30 H40 C40 24 38 16 28 6Z" fill="#252d3d" stroke="#2d3a4a" strokeWidth="1.2"/>
        <circle cx="28" cy="27" r="5" fill="#0e1117" stroke="#6366f1" strokeWidth="1"/>
        <circle cx="28" cy="27" r="2.5" fill="rgba(99,102,241,0.15)"/>
        <path d="M16 42 L8 52 L16 50Z" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.2"/>
        <path d="M40 42 L48 52 L40 50Z" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.2"/>
        <rect x="22" y="48" width="12" height="5" rx="1.5" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.2"/>
        <ellipse cx="28" cy="58" rx="5" ry="5" fill="rgba(99,102,241,0.2)"/>
        <ellipse cx="28" cy="59" rx="3" ry="3" fill="rgba(99,102,241,0.4)"/>
      </svg>
      <p className="text-[10px] font-semibold leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Aquí aparecerán<br />tus campañas
      </p>
      <p className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
        Lanza una para empezar
      </p>
    </div>
  )
}

export default function Sidebar({ campaigns, onNewCampaign }) {
  const isEmpty = campaigns.length === 0
  const list    = isEmpty ? MOCK : campaigns

  return (
    <aside
      className="fixed top-16 left-0 bottom-0 z-40 flex flex-col"
      style={{
        width: 220,
        background: 'rgba(8,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* New campaign button */}
      <div className="p-4">
        <button
          onClick={onNewCampaign}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200"
          style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.22)',
            color: '#6366f1',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'
            e.currentTarget.style.boxShadow = '0 0 18px rgba(99,102,241,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.22)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          + Nueva Campaña
        </button>
      </div>

      {/* Section label */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <span className="text-[8px] font-extrabold uppercase tracking-[0.28em] flex items-center gap-1.5"
              style={{ color: 'rgba(255,255,255,0.2)' }}>
          <Clock size={8} />
          {isEmpty ? 'Ejemplo' : 'Historial'}
        </span>
        {!isEmpty && (
          <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.18)' }}>
            {campaigns.length}
          </span>
        )}
      </div>

      {/* Campaign list or empty */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
        {isEmpty ? (
          <SidebarEmpty />
        ) : (
          list.map(c => <SidebarItem key={c.id} campaign={c} isEmpty={false} />)
        )}
      </div>
    </aside>
  )
}
