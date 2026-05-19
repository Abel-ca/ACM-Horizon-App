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
      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
        <CheckCircle2 size={9} /> OK
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-yellow-400">
      <Loader2 size={9} className="animate-spin" /> Run
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
        background: 'linear-gradient(180deg, #0a0b18 0%, #06070f 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* New campaign button */}
      <div className="p-4">
        <button
          onClick={onNewCampaign}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
          style={{
            background: 'rgba(240,180,41,0.08)',
            border: '1px solid rgba(240,180,41,0.25)',
            color: '#f0b429',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(240,180,41,0.14)'
            e.currentTarget.style.borderColor = 'rgba(240,180,41,0.5)'
            e.currentTarget.style.boxShadow = '0 0 16px rgba(240,180,41,0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(240,180,41,0.08)'
            e.currentTarget.style.borderColor = 'rgba(240,180,41,0.25)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          + Nueva Campaña
        </button>
      </div>

      {/* History header */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-white/25 flex items-center gap-1.5">
          <Clock size={9} />
          {isEmpty ? 'Ejemplos' : 'Historial'}
        </span>
        {!isEmpty && (
          <span className="text-[9px] font-bold text-white/20">{campaigns.length}</span>
        )}
      </div>

      {/* Campaigns list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1" style={{ scrollbarWidth: 'none' }}>
        {displayList.map((c, i) => (
          <div
            key={c.id}
            className="group relative rounded-lg px-3 py-2.5 cursor-default transition-all duration-150"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid transparent',
              opacity: isEmpty ? 0.45 : 1,
              animationDelay: `${i * 60}ms`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            {/* Product name */}
            <p
              className="text-[11px] font-semibold leading-snug mb-1 pr-4"
              style={{ color: '#c8ccf5' }}
            >
              {c.product}
            </p>

            {/* Meta row */}
            <div className="flex items-center justify-between">
              <StatusBadge status={c.status} />
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-white/25">{c.date}</span>
                {c.estimatedCost != null && (
                  <span className="text-[9px] font-mono text-white/20">
                    ${c.estimatedCost.toFixed(3)}
                  </span>
                )}
              </div>
            </div>

            {/* Hover arrow */}
            <ChevronRight
              size={10}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/15 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>

      {/* Bottom label when showing mocks */}
      {isEmpty && (
        <div className="px-4 pb-4">
          <p className="text-[9px] text-center text-white/15 leading-relaxed">
            Tus campañas aparecerán<br />aquí al completarlas
          </p>
        </div>
      )}
    </aside>
  )
}
