import { useEffect, useRef, useState } from 'react'
import { Key, RotateCcw, Zap, Menu } from 'lucide-react'

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

/* ── Metric pill ───────────────────────────────────────── */
function Metric({ label, value, prefix = '', decimals = 0, color }) {
  const anim    = useCountUp(value)
  const display = decimals > 0 ? anim.toFixed(decimals) : Math.round(anim)
  return (
    <div className="flex flex-col px-3 py-1.5 rounded-xl glass" style={{ minWidth: 72 }}>
      <span className="text-[8px] font-bold uppercase tracking-[0.22em]"
            style={{ color: 'rgba(184,195,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
        {label}
      </span>
      <span className="text-[14px] font-extrabold leading-none mt-0.5" style={{ color }}>
        {prefix}{display}
      </span>
    </div>
  )
}

/* ── Header ────────────────────────────────────────────── */
export default function Header({
  apiKey, onOpenApiModal, onReset, onOpenSidebar,
  totalCampaigns = 0, totalCost = 0, validatedProducts = 0,
  isMobile,
}) {
  return (
    <header
      className="glass-dark fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{ height: 64 }}
    >
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-2">
        {isMobile && (
          <button
            onClick={onOpenSidebar}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 glass"
            style={{ color: 'rgba(184,195,255,0.45)' }}
            aria-label="Abrir historial"
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        )}

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(46,91,255,0.15)',
            border: '1px solid rgba(46,91,255,0.30)',
          }}
        >
          <Zap size={15} style={{ color: '#2e5bff' }} />
        </div>

        <div className="leading-none font-display">
          <span className="text-[15px] font-bold tracking-tight" style={{ color: '#dee0ff' }}>Win</span>
          <span className="text-[15px] font-bold tracking-tight" style={{ color: '#b8c3ff' }}>nerly</span>
        </div>

        {/* Sistema activo — hidden on mobile */}
        {!isMobile && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full ml-2"
            style={{
              background: 'rgba(0,223,193,0.08)',
              border: '1px solid rgba(0,223,193,0.20)',
            }}
          >
            <span className="system-dot w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: '#00dfc1' }} />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: '#00dfc1', fontFamily: 'JetBrains Mono, monospace' }}>
              Sistema activo
            </span>
          </div>
        )}
      </div>

      {/* Center: metrics — hidden on mobile */}
      {!isMobile && (
        <div className="flex items-center gap-2">
          <Metric label="Campañas"  value={totalCampaigns}               color="#b8c3ff" />
          <Metric label="Costo API" value={totalCost} prefix="$" decimals={2} color="#00dfc1" />
          <Metric label="Validados" value={validatedProducts}            color="#ecb1ff" />
        </div>
      )}

      {/* Right: API key status + reset */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenApiModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200"
          style={{
            background: apiKey ? 'rgba(0,223,193,0.08)' : 'rgba(255,180,171,0.08)',
            border: `1px solid ${apiKey ? 'rgba(0,223,193,0.22)' : 'rgba(255,180,171,0.22)'}`,
            color: apiKey ? '#00dfc1' : '#ffb4ab',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <Key size={12} strokeWidth={2.5} />
          {isMobile ? (apiKey ? '✓' : '!') : (apiKey ? 'API Conectada' : 'Sin API Key')}
        </button>

        <button
          onClick={onReset}
          title="Reiniciar"
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 glass"
          style={{ color: 'rgba(184,195,255,0.28)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#dee0ff' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(184,195,255,0.28)' }}
        >
          <RotateCcw size={14} strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}
