import { useEffect, useRef, useState } from 'react'
import { Key, RotateCcw, Zap } from 'lucide-react'

/* ── Count-up hook ──────────────────────────────────────────── */
function useCountUp(target, { duration = 1000, startDelay = 300 } = {}) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (target === 0) { setValue(0); return }

    const timeout = setTimeout(() => {
      const start = performance.now()
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(target * eased)
        if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, startDelay])

  return value
}

/* ── Metric pill ────────────────────────────────────────────── */
function MetricPill({ label, value, prefix = '', suffix = '', decimals = 0, color }) {
  const animated = useCountUp(value)
  const display  = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated)

  return (
    <div
      className="flex flex-col px-4 py-2.5 rounded-xl transition-colors duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid #1e2530',
      }}
    >
      <span className="text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {label}
      </span>
      <span className="text-[15px] font-extrabold leading-none mt-0.5" style={{ color }}>
        {prefix}{display}{suffix}
      </span>
    </div>
  )
}

/* ── Header ─────────────────────────────────────────────────── */
export default function Header({
  apiKey,
  onOpenApiModal,
  onReset,
  totalCampaigns   = 0,
  totalCost        = 0,
  validatedProducts = 0,
}) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6"
      style={{
        height: '64px',
        background: 'rgba(8,10,15,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1e2530',
      }}
    >
      {/* Logo + sistema activo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.28)',
            }}
          >
            <Zap size={15} style={{ color: '#f59e0b' }} />
          </div>

          <div className="leading-none">
            <span className="text-[15px] font-black tracking-tight" style={{ color: '#f0f4ff' }}>
              ACM
            </span>
            <span className="text-[15px] font-black tracking-tight ml-1.5" style={{ color: '#f59e0b' }}>
              Horizon
            </span>
          </div>
        </div>

        {/* Sistema activo badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <span
            className="system-dot w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
            style={{ background: '#10b981' }}
          />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#10b981' }}>
            Sistema activo
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-2">
        <MetricPill
          label="Campañas"
          value={totalCampaigns}
          color="#f59e0b"
        />
        <MetricPill
          label="Costo API"
          value={totalCost}
          prefix="$"
          decimals={2}
          color="#06b6d4"
        />
        <MetricPill
          label="Validados"
          value={validatedProducts}
          color="#a855f7"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenApiModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-semibold transition-all duration-200"
          style={{
            background: apiKey ? 'rgba(16,185,129,0.07)' : 'rgba(244,63,94,0.07)',
            border: `1px solid ${apiKey ? 'rgba(16,185,129,0.22)' : 'rgba(244,63,94,0.22)'}`,
            color: apiKey ? '#10b981' : '#f43f5e',
          }}
        >
          <Key size={12} strokeWidth={2.5} />
          {apiKey ? 'API Conectada' : 'Sin API Key'}
        </button>

        <button
          onClick={onReset}
          title="Reiniciar campaña"
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #1e2530',
            color: 'rgba(255,255,255,0.3)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
            e.currentTarget.style.borderColor = '#2d3a4a'
            e.currentTarget.style.color = '#f0f4ff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.borderColor = '#1e2530'
            e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
          }}
        >
          <RotateCcw size={14} strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}
