import { useEffect, useRef, useState } from 'react'
import { Key, RotateCcw, Zap } from 'lucide-react'

/* ── Count-up hook ──────────────────────────────────────────── */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (target === 0) { setValue(0); return }

    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

/* ── Metric pill ────────────────────────────────────────────── */
function MetricPill({ label, value, prefix = '', suffix = '', decimals = 0, color = '#f0b429' }) {
  const animated = useCountUp(value)
  const display = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated)

  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div>
        <p className="text-[8px] font-extrabold uppercase tracking-[0.22em] text-white/30 leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm font-extrabold leading-none" style={{ color }}>
          {prefix}{display}{suffix}
        </p>
      </div>
    </div>
  )
}

/* ── Header ─────────────────────────────────────────────────── */
export default function Header({
  apiKey,
  onOpenApiModal,
  onReset,
  totalCampaigns = 0,
  totalCost = 0,
  validatedProducts = 0,
}) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6"
      style={{
        height: '64px',
        background: 'rgba(6,7,15,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(240,180,41,0.15)', border: '1px solid rgba(240,180,41,0.3)' }}
        >
          <Zap size={14} style={{ color: '#f0b429' }} />
        </div>
        <div className="leading-none">
          <span className="text-sm font-extrabold tracking-tight text-white">ACM</span>
          <span className="text-sm font-extrabold tracking-tight ml-1.5" style={{ color: '#f0b429' }}>
            Horizon
          </span>
        </div>
        <div
          className="ml-1 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest"
          style={{ background: 'rgba(240,180,41,0.1)', color: '#f0b429', border: '1px solid rgba(240,180,41,0.2)' }}
        >
          v1.0
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-2">
        <MetricPill label="Campañas"  value={totalCampaigns}    color="#f0b429" />
        <MetricPill label="Costo API" value={totalCost} prefix="$" decimals={2} color="#00d4ff" />
        <MetricPill label="Validados" value={validatedProducts}  color="#a855f7" />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenApiModal}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
          style={{
            background: apiKey ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
            border: `1px solid ${apiKey ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
            color: apiKey ? '#10b981' : '#f43f5e',
          }}
        >
          <Key size={12} strokeWidth={2.5} />
          <span>{apiKey ? 'API Conectada' : 'Sin API Key'}</span>
        </button>

        <button
          onClick={onReset}
          title="Reiniciar campaña"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.4)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
          }}
        >
          <RotateCcw size={14} strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}
