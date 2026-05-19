import { useEffect, useRef, useState } from 'react'
import { Key, RotateCcw, Zap } from 'lucide-react'

/* ── Count-up ─────────────────────────────────────────── */
function useCountUp(target, duration = 900, startDelay = 400) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    cancelAnimationFrame(raf.current)
    if (target === 0) { setVal(0); return }
    const t = setTimeout(() => {
      const start = performance.now()
      const tick = now => {
        const p = Math.min((now - start) / duration, 1)
        setVal(target * (1 - Math.pow(1 - p, 3)))
        if (p < 1) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    }, startDelay)
    return () => { clearTimeout(t); cancelAnimationFrame(raf.current) }
  }, [target, duration, startDelay])
  return val
}

/* ── Metric ───────────────────────────────────────────── */
function Metric({ label, value, prefix = '', decimals = 0, color }) {
  const anim    = useCountUp(value)
  const display = decimals > 0 ? anim.toFixed(decimals) : Math.round(anim)
  return (
    <div className="flex flex-col px-4 py-2 rounded-xl glass" style={{ minWidth: 90 }}>
      <span className="text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
        {label}
      </span>
      <span className="text-[15px] font-extrabold leading-none mt-0.5" style={{ color }}>
        {prefix}{display}
      </span>
    </div>
  )
}

/* ── Header ───────────────────────────────────────────── */
export default function Header({ apiKey, onOpenApiModal, onReset, totalCampaigns = 0, totalCost = 0, validatedProducts = 0 }) {
  return (
    <header
      className="glass-dark fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{ height: 64 }}
    >
      {/* Logo + status */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          <Zap size={15} style={{ color: '#6366f1' }} />
        </div>
        <div className="leading-none">
          <span className="text-[15px] font-black tracking-tight" style={{ color: '#f0f4ff' }}>ACM</span>
          <span className="text-[15px] font-black tracking-tight ml-1.5" style={{ color: '#6366f1' }}>Horizon</span>
        </div>

        {/* Sistema activo */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full ml-2"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <span className="system-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#10b981' }} />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#10b981' }}>
            Sistema activo
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-2">
        <Metric label="Campañas"  value={totalCampaigns}    color="#6366f1" />
        <Metric label="Costo API" value={totalCost} prefix="$" decimals={2} color="#06b6d4" />
        <Metric label="Validados" value={validatedProducts}  color="#8b5cf6" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenApiModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200"
          style={{
            background: apiKey ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
            border: `1px solid ${apiKey ? 'rgba(16,185,129,0.22)' : 'rgba(244,63,94,0.22)'}`,
            color: apiKey ? '#10b981' : '#f43f5e',
          }}
        >
          <Key size={12} strokeWidth={2.5} />
          {apiKey ? 'API Conectada' : 'Sin API Key'}
        </button>
        <button
          onClick={onReset}
          title="Reiniciar"
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 glass"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f0f4ff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = '' }}
        >
          <RotateCcw size={14} strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}
