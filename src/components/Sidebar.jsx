import { Clock, CheckCircle2, Loader2, ChevronRight } from 'lucide-react'

const MOCK_CAMPAIGNS = [
  { id: 'm1', product: 'Masajeador cervical eléctrico', date: '14 may', status: 'complete', estimatedCost: 0.041 },
  { id: 'm2', product: 'Fajas reductoras térmicas',    date: '12 may', status: 'complete', estimatedCost: 0.038 },
  { id: 'm3', product: 'Pulsera de amatista premium',  date: '10 may', status: 'complete', estimatedCost: 0.044 },
  { id: 'm4', product: 'Colágeno marino hidrolizado',  date: '8 may',  status: 'complete', estimatedCost: 0.039 },
  { id: 'm5', product: 'Cargador solar portátil 20W',  date: '6 may',  status: 'complete', estimatedCost: 0.036 },
]

function StatusBadge({ status }) {
  if (status === 'complete') {
    return (
      <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest" style={{ color: '#10b981' }}>
        <CheckCircle2 size={8} /> OK
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>
      <Loader2 size={8} className="animate-spin" /> Run
    </span>
  )
}

export default function Sidebar({ campaigns, onNewCampaign }) {
  const isEmpty = campaigns.length === 0
  const displayList = isEmpty ? MOCK_CAMPAIGNS : campaigns

  return (
    <aside
      className="fixed left-0 top-16 bottom-0 z-20 flex flex-col"
      style={{
        width: '220px',
        background: '#0a0d12',
        borderRight: '1px solid #1e2530',
      }}
    >
      {/* New campaign button */}
      <div className="p-4">
        <button
          onClick={onNewCampaign}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200"
          style={{
            background: 'rgba(245,158,11,0.07)',
            border: '1px solid rgba(245,158,11,0.2)',
            color: '#f59e0b',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(245,158,11,0.13)'
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.45)'
            e.currentTarget.style.boxShadow = '0 0 18px rgba(245,158,11,0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(245,158,11,0.07)'
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          + Nueva Campaña
        </button>
      </div>

      {/* Section label */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <span
          className="text-[8px] font-extrabold uppercase tracking-[0.28em] flex items-center gap-1.5"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Clock size={8} />
          {isEmpty ? 'Ejemplos' : 'Historial'}
        </span>
        {!isEmpty && (
          <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.18)' }}>
            {campaigns.length}
          </span>
        )}
      </div>

      {/* Campaign list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1" style={{ scrollbarWidth: 'none' }}>
        {displayList.map((c, i) => (
          <div
            key={c.id}
            className="group relative rounded-xl px-3 py-2.5 cursor-default transition-all duration-150"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid transparent',
              opacity: isEmpty ? 0.4 : 1,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.045)'
              e.currentTarget.style.borderColor = '#1e2530'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <p
              className="text-[11px] font-semibold leading-snug mb-1.5 pr-3"
              style={{ color: '#c0c8e0' }}
            >
              {c.product}
            </p>
            <div className="flex items-center justify-between">
              <StatusBadge status={c.status} />
              <div className="flex items-center gap-2">
                <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{c.date}</span>
                {c.estimatedCost != null && (
                  <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.16)' }}>
                    ${c.estimatedCost.toFixed(3)}
                  </span>
                )}
              </div>
            </div>

            <ChevronRight
              size={10}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'rgba(255,255,255,0.15)' }}
            />
          </div>
        ))}
      </div>

      {isEmpty && (
        <div className="px-4 pb-5">
          <p className="text-[9px] text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.14)' }}>
            Tus campañas aparecerán<br />aquí al completarlas
          </p>
        </div>
      )}
    </aside>
  )
}
