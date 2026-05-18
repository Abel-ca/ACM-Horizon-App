import { ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'

const EXAMPLES = [
  'Masajeador de cuello eléctrico',
  'Lámpara LED de ambiente',
  'Mini aspiradora inalámbrica',
  'Cepillo facial sónico',
]

export default function ProductInput({ product, setProduct, onStart, disabled }) {
  const [focused, setFocused] = useState(false)

  const canLaunch = product.trim().length > 0 && !disabled

  return (
    <div
      className="relative rounded-xl overflow-hidden transition-all duration-700"
      style={{ opacity: disabled ? 0.55 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {/* Gradient border glow */}
      <div
        className="absolute -inset-px rounded-xl"
        style={{
          background: focused
            ? 'linear-gradient(135deg, rgba(240,180,41,0.4), rgba(0,212,255,0.2), rgba(240,180,41,0.1))'
            : 'linear-gradient(135deg, rgba(240,180,41,0.15), transparent, rgba(0,212,255,0.08))',
          transition: 'all 0.4s ease',
        }}
      />

      <div
        className="relative p-8 rounded-xl"
        style={{ background: '#0d0e1e' }}
      >
        {/* Label */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#f0b429' }} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: '#f0b429' }}
          >
            Nuevo análisis de campaña
          </span>
        </div>

        <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#f0f2ff' }}>
          ¿Qué producto quieres vender?
        </h2>
        <p className="text-sm mb-6" style={{ color: '#8b90c0' }}>
          El Director validará la oportunidad y coordinará a los 3 agentes en secuencia
        </p>

        {/* Input row */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canLaunch && onStart()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ej: Masajeador de cuello eléctrico"
              className="w-full px-5 py-4 rounded-lg text-base outline-none transition-all duration-200"
              style={{
                fontFamily: 'Syne, sans-serif',
                background: '#111328',
                border: `1px solid ${focused ? 'rgba(240,180,41,0.5)' : '#1a1c38'}`,
                color: '#f0f2ff',
                boxShadow: focused ? '0 0 0 3px rgba(240,180,41,0.06)' : 'none',
              }}
              disabled={disabled}
            />
          </div>
          <button
            onClick={onStart}
            disabled={!canLaunch}
            className="btn-primary whitespace-nowrap"
          >
            Lanzar <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Example chips */}
        {!disabled && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: '#3a3f60' }}
            >
              Ejemplos:
            </span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setProduct(ex)}
                className="text-xs px-3 py-1 rounded-full transition-all duration-200"
                style={{
                  background: 'rgba(240,180,41,0.04)',
                  border: '1px solid #1a1c38',
                  color: '#8b90c0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(240,180,41,0.3)'
                  e.currentTarget.style.color = '#f0b429'
                  e.currentTarget.style.background = 'rgba(240,180,41,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1a1c38'
                  e.currentTarget.style.color = '#8b90c0'
                  e.currentTarget.style.background = 'rgba(240,180,41,0.04)'
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
