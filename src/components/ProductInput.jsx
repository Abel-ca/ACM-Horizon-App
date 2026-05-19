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
  'Masajeador cervical eléctrico',
  'Fajas reductoras',
  'Cepillo facial sónico',
  'Lámpara LED',
]

/* ── Typing placeholder hook ───────────────────────────────── */
function useTypingPlaceholder(phrases, { typeSpeed = 60, deleteSpeed = 35, pauseMs = 1800 } = {}) {
  const [display, setDisplay] = useState('')
  const phraseIdx = useRef(0)
  const charIdx    = useRef(0)
  const deleting   = useRef(false)
  const timerRef   = useRef(null)

  useEffect(() => {
    function tick() {
      const phrase = phrases[phraseIdx.current]

      if (!deleting.current) {
        // typing
        charIdx.current += 1
        setDisplay(phrase.slice(0, charIdx.current))
        if (charIdx.current === phrase.length) {
          deleting.current = true
          timerRef.current = setTimeout(tick, pauseMs)
          return
        }
        timerRef.current = setTimeout(tick, typeSpeed)
      } else {
        // deleting
        charIdx.current -= 1
        setDisplay(phrase.slice(0, charIdx.current))
        if (charIdx.current === 0) {
          deleting.current = false
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length
          timerRef.current = setTimeout(tick, 300)
          return
        }
        timerRef.current = setTimeout(tick, deleteSpeed)
      }
    }

    timerRef.current = setTimeout(tick, 800)
    return () => clearTimeout(timerRef.current)
  }, []) // eslint-disable-line

  return display
}

/* ── Component ─────────────────────────────────────────────── */
export default function ProductInput({ product, setProduct, onStart, disabled }) {
  const [focused, setFocused] = useState(false)
  const placeholder = useTypingPlaceholder(PLACEHOLDERS)
  const canLaunch = product.trim().length > 0 && !disabled

  return (
    <div
      className="hero-d3"
      style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? 'none' : 'auto', transition: 'opacity 0.4s ease' }}
    >
      {/* Eyebrow */}
      <p className="text-[10px] font-extrabold uppercase tracking-[0.35em] mb-4" style={{ color: 'rgba(240,180,41,0.6)' }}>
        — Nueva campaña
      </p>

      {/* Hero headline */}
      <h1
        className="font-extrabold leading-[1.1] mb-2"
        style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#f0f2ff', letterSpacing: '-0.02em' }}
      >
        ¿Qué producto querés
        <br />
        <span className="text-gradient-gold">validar hoy?</span>
      </h1>
      <p className="text-sm mb-8 max-w-lg" style={{ color: '#5a5f80' }}>
        El Director analiza la viabilidad y coordina a los 3 agentes restantes en secuencia.
      </p>

      {/* Input + button */}
      <div
        className="flex gap-3 rounded-2xl p-1.5 transition-all duration-300"
        style={{
          background: '#0d0e1e',
          border: `1px solid ${focused ? 'rgba(240,180,41,0.45)' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: focused ? '0 0 0 4px rgba(240,180,41,0.06), 0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.3)',
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
          className={`flex-1 bg-transparent px-4 py-3.5 text-base outline-none${!product ? ' typing-cursor' : ''}`}
          style={{ color: '#f0f2ff', fontFamily: 'Syne, sans-serif', caretColor: '#f0b429' }}
          disabled={disabled}
        />
        <button
          onClick={onStart}
          disabled={!canLaunch}
          className="btn-launch"
          style={{ padding: '12px 28px', borderRadius: '14px' }}
        >
          <Rocket size={15} strokeWidth={2.5} />
          Lanzar
        </button>
      </div>

      {/* Example chips */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/20">
            Probar con:
          </span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => setProduct(ex)}
              className="text-[11px] px-3 py-1 rounded-full transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.35)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(240,180,41,0.35)'
                e.currentTarget.style.color = '#f0b429'
                e.currentTarget.style.background = 'rgba(240,180,41,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
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
