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

      <p className="hero-d1 text-[9px] font-black uppercase tracking-[0.4em] mb-5"
         style={{ color: 'rgba(99,102,241,0.6)' }}>
        — Centro de Comando
      </p>

      <h1
        className="hero-d2 font-black leading-[1.06] mb-3 text-gradient-hero"
        style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', letterSpacing: '-0.03em' }}
      >
        ¿Qué producto querés<br />validar hoy?
      </h1>

      <p className="hero-d3 text-sm mb-8" style={{ color: '#4a5270', lineHeight: 1.75, maxWidth: 460 }}>
        El Director de Marketing analiza la viabilidad y coordina a los 3 agentes en secuencia automática.
      </p>

      {/* Input + button */}
      <div
        className="hero-d4 flex gap-2 rounded-2xl p-1.5 transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${focused ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.08), 0 8px 40px rgba(0,0,0,0.5)' : '0 4px 24px rgba(0,0,0,0.4)',
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
          style={{ color: '#f0f4ff', caretColor: '#6366f1' }}
          disabled={disabled}
        />
        <button
          onClick={onStart}
          disabled={!canLaunch}
          className="flex items-center gap-2 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all duration-200 flex-shrink-0"
          style={{
            padding: '12px 26px',
            background: canLaunch ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.06)',
            color: canLaunch ? '#fff' : 'rgba(255,255,255,0.25)',
            boxShadow: canLaunch ? '0 4px 20px rgba(99,102,241,0.35)' : 'none',
            cursor: canLaunch ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (canLaunch) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.45)' } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = canLaunch ? '0 4px 20px rgba(99,102,241,0.35)' : 'none' }}
        >
          <Rocket size={14} strokeWidth={2.5} />
          Lanzar
        </button>
      </div>

      {/* Example chips */}
      {!disabled && (
        <div className="hero-d5 flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[9px] uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Probar con:
          </span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => setProduct(ex)}
              className="text-[11px] px-3 py-1 rounded-full transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.32)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.background = 'rgba(99,102,241,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.32)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
