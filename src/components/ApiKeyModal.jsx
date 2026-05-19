import { useState } from 'react'
import { X, Key, ShieldCheck, ExternalLink } from 'lucide-react'

export default function ApiKeyModal({ onSave, onClose, hasKey }) {
  const [value,   setValue]   = useState('')
  const [focused, setFocused] = useState(false)

  const handleSave = () => {
    if (value.trim()) onSave(value.trim())
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
        <div
          style={{
            height: '2px',
            background: 'linear-gradient(to right, transparent, #f0b429, transparent)',
          }}
        />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-7">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(240,180,41,0.08)',
                  border: '1px solid rgba(240,180,41,0.25)',
                }}
              >
                <Key className="w-5 h-5" style={{ color: '#f0b429' }} />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: '#f0f2ff' }}>
                  API de Anthropic
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#3a3f60' }}>
                  Requerida para activar los agentes
                </p>
              </div>
            </div>
            {hasKey && (
              <button
                onClick={onClose}
                style={{ color: '#3a3f60' }}
                className="transition-colors hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Input */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: '#8b90c0' }}
              >
                Clave API
              </label>
              <input
                type="password"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={hasKey ? '••••••• (clave guardada)' : 'sk-ant-api03-…'}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  background: '#111328',
                  border: `1px solid ${focused ? 'rgba(240,180,41,0.5)' : '#1a1c38'}`,
                  color: '#f0f2ff',
                  boxShadow: focused ? '0 0 0 3px rgba(240,180,41,0.06)' : 'none',
                }}
                autoFocus
              />
            </div>

            {/* Security note */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-lg"
              style={{
                background: 'rgba(16,185,129,0.05)',
                border: '1px solid rgba(16,185,129,0.15)',
              }}
            >
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#8b90c0' }}>
                Tu clave se guarda únicamente en este navegador. Las llamadas van directo a
                Anthropic a través del proxy local de Vite — ningún servidor externo recibe tu key.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleSave}
              disabled={!value.trim()}
              className="btn-primary w-full justify-center"
            >
              Activar agentes
            </button>

            <a
              href="https://console.anthropic.com/account/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs transition-colors duration-200"
              style={{ color: '#3a3f60' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#8b90c0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3f60')}
            >
              <ExternalLink className="w-3 h-3" />
              Obtener clave en console.anthropic.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
