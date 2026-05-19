import { useEffect, useRef, useState } from 'react'
import { Rocket } from 'lucide-react'

const PLACEHOLDERS = [
  'Masajeador cervical eléctrico',
  'Fajas reductoras térmicas',
  'Lámpara LED de ambiente',
  'Cepillo facial sónico',
  'Pulsera de amatista premium',
  'Mini aspiradora inalámbrica',
  'Colágeno marino hidrolizado',
  'Cargador solar portátil 20W',
]

const EXAMPLES = [
  'Masajeador cervical',
  'Fajas reductoras',
  'Cepillo facial sónico',
  'Lámpara LED',
]

/* ── Typing placeholder hook ───────────────────────────────── */
function useTypingPlaceholder(phrases, { typeSpeed = 58, deleteSpeed = 32, pauseMs = 1900 } = {}) {
  const [display, setDisplay] = useState('')
  const phraseIdx = useRef(0)
  const charIdx   = useRef(0)
  const deleting  = useRef(false)
  const timer     = useRef(null)

  useEffect(() => {
    function tick() {
      const phrase = phrases[phraseIdx.current]
      if (!deleting.current) {
        charIdx.current += 1
        setDisplay(phrase.slice(0, charIdx.current))
        if (charIdx.current === phrase.length) {
          deleting.current = true
          timer.current = setTimeout(tick, pauseMs)
          return
        }
        timer.current = setTimeout(tick, typeSpeed)
      } else {
        charIdx.current -= 1
        setDisplay(phrase.slice(0, charIdx.current))
        if (charIdx.current === 0) {
          deleting.current = false
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length
          timer.current = setTimeout(tick, 280)
          return
        }
        timer.current = setTimeout(tick, deleteSpeed)
      }
    }
    timer.current = setTimeout(tick, 900)
    return () => clearTimeout(timer.current)
  }, []) // eslint-disable-line

  return display
}

/* ── Component ─────────────────────────────────────────────── */
export default function ProductInput({ product, setProduct, onStart, disabled }) {
  const [focused, setFocused] = useState(false)
  const placeholder = useTypingPlaceholder(PLACEHOLDERS)
  const canLaunch = product.trim().length > 0 && !disabled

  return (
    <div style={{ opacity: disabled ? 0.35 : 1, pointerEvents: disabled ? 'none' : 'auto', transition: 'opacity 0.4s' }}>

      {/* Eyebrow */}
      <p className="hero-d1 text-[9px] font-black uppercase tracking-[0.38em] mb-5"
         style={{ color: 'rgba(245,158,11,0.55)' }}>
        — Nueva campaña
      </p>

      {/* Hero title with aurora effect */}
      <div className="hero-d2 relative mb-3" style={{ display: 'inline-block' }}>
        {/* Aurora layer — behind the title */}
        <div
          className="aurora-hero absolute inset-0"
          style={{ transform: 'scale(1.6)', zIndex: 0 }}
        />
        <h1
          className="relative"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#f0f4ff',
            zIndex: 1,
          }}
        >
          ¿Qué producto querés
          <br />
          <span className="text-gradient-gold">validar hoy?</span>
        </h1>
      </div>

      <p className="hero-d3 text-sm mb-8" style={{ color: '#4a5270', maxWidth: 480, lineHeight: 1.7 }}>
        El Director de Marketing analiza la viabilidad y coordina a los 3 agentes en secuencia.
      </p>

      {/* Input + button */}
      <div
        className="hero-d3 flex gap-2 rounded-2xl p-1.5 transition-all duration-300"
        style={{
          background: '#0e1117',
          border: `1px solid ${focused ? 'rgba(245,158,11,0.4)' : '#1e2530'}`,
          boxShadow: focused
            ? '0 0 0 3px rgba(245,158,11,0.06), 0 8px 40px rgba(0,0,0,0.5)'
            : '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        <input
          type="text"
          value={product}
          onChange={e => setProduct(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && canLaunch && onStart()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder || 'Escribe un producto…'}
          className={`flex-1 bg-transparent px-4 py-3.5 text-[15px] font-medium outline-none${!product ? ' typing-cursor' : ''}`}
          style={{ color: '#f0f4ff', fontFamily: 'Inter, sans-serif', caretColor: '#f59e0b' }}
          disabled={disabled}
        />
        <button
          onClick={onStart}
          disabled={!canLaunch}
          className="btn-launch"
          style={{ borderRadius: 14, padding: '12px 26px', fontSize: 12 }}
        >
          <Rocket size={14} strokeWidth={2.5} />
          Lanzar
        </button>
      </div>

      {/* Example chips */}
      {!disabled && (
        <div className="hero-d4 flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[9px] uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Probar con:
          </span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => setProduct(ex)}
              className="text-[11px] px-3 py-1 rounded-full transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid #1e2530',
                color: 'rgba(255,255,255,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'
                e.currentTarget.style.color = '#f59e0b'
                e.currentTarget.style.background = 'rgba(245,158,11,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e2530'
                e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
