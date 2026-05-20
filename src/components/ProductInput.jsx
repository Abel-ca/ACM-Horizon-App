import { useEffect, useRef, useState } from 'react'
import { Rocket } from 'lucide-react'

const PLACEHOLDERS = [
  'Masajeador cervical eléctrico',
  'Fajas reductoras térmicas',
  'Lámpara LED de ambiente',
  'Cepillo facial sónico',
  'Pulsera de amatista premium',
  'Colágeno marino hidrolizado',
  'Cargador solar portátil 20W',
  'Mini aspiradora inalámbrica',
]

const EXAMPLES = ['Masajeador cervical', 'Fajas reductoras', 'Cepillo sónico', 'Lámpara LED']

/* ── Typing placeholder ──────────────────────────────── */
function useTypingPlaceholder(phrases) {
  const [text, setText] = useState('')
  const idx = useRef(0); const ci = useRef(0); const del = useRef(false); const t = useRef(null)
  useEffect(() => {
    const tick = () => {
      const p = phrases[idx.current]
      if (!del.current) {
        ci.current += 1; setText(p.slice(0, ci.current))
        if (ci.current === p.length) { del.current = true; t.current = setTimeout(tick, 1800); return }
        t.current = setTimeout(tick, 60)
      } else {
        ci.current -= 1; setText(p.slice(0, ci.current))
        if (ci.current === 0) {
          del.current = false; idx.current = (idx.current + 1) % phrases.length
          t.current = setTimeout(tick, 280); return
        }
        t.current = setTimeout(tick, 35)
      }
    }
    t.current = setTimeout(tick, 900)
    return () => clearTimeout(t.current)
  }, []) // eslint-disable-line
  return text
}

/* ── Component ───────────────────────────────────────── */
export default function ProductInput({ product, setProduct, onStart, disabled }) {
  const [focused, setFocused] = useState(false)
  const ph = useTypingPlaceholder(PLACEHOLDERS)
  const canLaunch = product.trim().length > 0 && !disabled

  return (
    <div style={{ opacity: disabled ? 0.35 : 1, pointerEvents: disabled ? 'none' : 'auto', transition: 'opacity 0.4s' }}>

      <p className="hero-d1 text-[9px] font-bold uppercase tracking-[0.4em] mb-5"
         style={{ color: 'rgba(184,195,255,0.55)', fontFamily: 'JetBrains Mono, monospace' }}>
        — Centro de Comando
      </p>

      <h1
        className="hero-d2 font-display font-bold leading-[1.06] mb-3 text-gradient-hero"
        style={{ fontSize: 'clamp(34px, 5.5vw, 54px)', letterSpacing: '-0.02em' }}
      >
        ¿Qué producto querés<br />validar hoy?
      </h1>

      <p className="hero-d3 text-sm mb-8" style={{ color: '#8e90a2', lineHeight: 1.75, maxWidth: 460 }}>
        El Director de Marketing analiza la viabilidad y coordina a los 3 agentes en secuencia automática.
      </p>

      {/* Input + button */}
      <div
        className="hero-d4 flex gap-2 rounded-2xl p-1.5 transition-all duration-300"
        style={{
          background: 'rgba(22,26,51,0.65)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${focused ? 'rgba(46,91,255,0.50)' : 'rgba(184,195,255,0.10)'}`,
          boxShadow: focused
            ? '0 0 0 3px rgba(46,91,255,0.10), 0 8px 40px rgba(8,12,37,0.6)'
            : '0 4px 24px rgba(8,12,37,0.5)',
        }}
      >
        <input
          type="text"
          value={product}
          onChange={e => setProduct(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && canLaunch && onStart()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={ph || 'Escribe un producto…'}
          className={`flex-1 bg-transparent px-4 py-3.5 text-[15px] font-medium outline-none${!product ? ' typing-cursor' : ''}`}
          style={{ color: '#dee0ff', caretColor: '#2e5bff' }}
          disabled={disabled}
        />
        <button
          onClick={onStart}
          disabled={!canLaunch}
          className="flex items-center gap-2 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all duration-200 flex-shrink-0"
          style={{
            padding: '12px 26px',
            fontFamily: 'JetBrains Mono, monospace',
            background: canLaunch ? 'linear-gradient(135deg, #2e5bff, #1a44e8)' : 'rgba(184,195,255,0.06)',
            color: canLaunch ? '#efefff' : 'rgba(184,195,255,0.25)',
            boxShadow: canLaunch ? '0 4px 20px rgba(46,91,255,0.40)' : 'none',
            cursor: canLaunch ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => {
            if (canLaunch) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,242,209,0.20), 0 8px 28px rgba(46,91,255,0.55)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = canLaunch ? '0 4px 20px rgba(46,91,255,0.40)' : 'none'
          }}
        >
          <Rocket size={14} strokeWidth={2.5} />
          Lanzar
        </button>
      </div>

      {/* Example chips */}
      {!disabled && (
        <div className="hero-d5 flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[9px] uppercase tracking-[0.22em]"
                style={{ color: 'rgba(184,195,255,0.22)', fontFamily: 'JetBrains Mono, monospace' }}>
            Probar con:
          </span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => setProduct(ex)}
              className="text-[11px] px-3 py-1 rounded-full transition-all duration-150"
              style={{
                background: 'rgba(22,26,51,0.6)',
                border: '1px solid rgba(184,195,255,0.10)',
                color: 'rgba(184,195,255,0.35)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(46,91,255,0.45)'
                e.currentTarget.style.color = '#b8c3ff'
                e.currentTarget.style.background = 'rgba(46,91,255,0.10)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(184,195,255,0.10)'
                e.currentTarget.style.color = 'rgba(184,195,255,0.35)'
                e.currentTarget.style.background = 'rgba(22,26,51,0.6)'
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
