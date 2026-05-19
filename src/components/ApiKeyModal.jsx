import { useState } from 'react'
import { X, Key, ShieldCheck, ExternalLink, BarChart2 } from 'lucide-react'

/* ── Labelled input row ──────────────────────────────── */
function TokenInput({ label, sublabel, placeholder, value, onChange, onKeyDown, focused, onFocus, onBlur, autoFocus, accentColor = '#f0b429' }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#8b90c0' }}>
          {label}
        </label>
        {sublabel && (
          <span className="text-[9px]" style={{ color: '#3a3f60' }}>{sublabel}</span>
        )}
      </div>
      <input
        type="password"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          background: '#111328',
          border: `1px solid ${focused ? `${accentColor}80` : '#1a1c38'}`,
          color: '#f0f2ff',
          boxShadow: focused ? `0 0 0 3px ${accentColor}10` : 'none',
        }}
      />
    </div>
  )
}

/* ── Modal ───────────────────────────────────────────── */
export default function ApiKeyModal({ onSave, onClose, hasKey, hasMetaToken }) {
  const [anthropicVal, setAnthropicVal]   = useState('')
  const [metaVal,      setMetaVal]        = useState('')
  const [focusedA,     setFocusedA]       = useState(false)
  const [focusedM,     setFocusedM]       = useState(false)

  const handleSave = () => {
    if (anthropicVal.trim()) onSave(anthropicVal.trim(), metaVal.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(6,7,15,0.85)' }}
        onClick={hasKey ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-xl overflow-hidden"
        style={{
          background: '#0d0e1e',
          border: '1px solid #2d3068',
          boxShadow: '0 0 60px rgba(240,180,41,0.08), 0 24px 48px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Top accent */}
        <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, #f0b429, transparent)' }} />

        <div className="p-8 space-y-6">

          {/* ── Header ── */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.25)' }}
              >
                <Key className="w-5 h-5" style={{ color: '#f0b429' }} />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: '#f0f2ff' }}>Configuración de APIs</h2>
                <p className="text-xs mt-0.5" style={{ color: '#3a3f60' }}>Anthropic · Meta Ads Library</p>
              </div>
            </div>
            {hasKey && (
              <button onClick={onClose} style={{ color: '#3a3f60' }} className="transition-colors hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* ── Anthropic API Key ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Key size={12} style={{ color: '#f0b429' }} />
              <span className="text-xs font-bold" style={{ color: '#f0b429' }}>Anthropic API Key</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}>
                Requerida
              </span>
            </div>

            <TokenInput
              label="Clave API"
              placeholder={hasKey ? '••••••• (clave guardada)' : 'sk-ant-api03-…'}
              value={anthropicVal}
              onChange={e => setAnthropicVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              focused={focusedA}
              onFocus={() => setFocusedA(true)}
              onBlur={() => setFocusedA(false)}
              autoFocus
              accentColor="#f0b429"
            />

            {/* Security note */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-lg"
              style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}
            >
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#8b90c0' }}>
                Guardada solo en este navegador. Las llamadas van directo a Anthropic — ningún servidor externo recibe tu key.
              </p>
            </div>

            <a
              href="https://console.anthropic.com/account/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors duration-200"
              style={{ color: '#3a3f60' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#8b90c0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3a3f60')}
            >
              <ExternalLink className="w-3 h-3" />
              Obtener clave en console.anthropic.com
            </a>
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* ── Meta Ads Token ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 size={12} style={{ color: '#1877f2' }} />
              <span className="text-xs font-bold" style={{ color: '#1877f2' }}>Meta Ads Library Token</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                Opcional
              </span>
              {hasMetaToken && (
                <span className="text-[9px] px-1.5 py-0.5 rounded ml-auto" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                  ✓ Conectado
                </span>
              )}
            </div>

            <TokenInput
              label="Access Token"
              sublabel="Opcional — potencia el Investigador"
              placeholder={hasMetaToken ? '••••••• (token guardado)' : 'EAAxxxxx…'}
              value={metaVal}
              onChange={e => setMetaVal(e.target.value)}
              focused={focusedM}
              onFocus={() => setFocusedM(true)}
              onBlur={() => setFocusedM(false)}
              accentColor="#1877f2"
            />

            {/* Info note */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-lg"
              style={{ background: 'rgba(24,119,242,0.05)', border: '1px solid rgba(24,119,242,0.15)' }}
            >
              <BarChart2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#1877f2' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#8b90c0' }}>
                Con este token, el Investigador consulta la{' '}
                <strong style={{ color: '#f0f2ff' }}>Meta Ads Library</strong>{' '}
                en tiempo real — anuncios activos en Ecuador, Colombia, México y Perú para detectar ángulos y competidores.
              </p>
            </div>

            <a
              href="https://developers.facebook.com/tools/explorer/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors duration-200"
              style={{ color: '#3a3f60' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#8b90c0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3a3f60')}
            >
              <ExternalLink className="w-3 h-3" />
              Obtener token en developers.facebook.com/tools/explorer
            </a>
          </div>

          {/* ── CTA ── */}
          <button
            onClick={handleSave}
            disabled={!anthropicVal.trim()}
            className="btn-primary w-full justify-center"
          >
            Activar agentes
          </button>

        </div>
      </div>
    </div>
  )
}
