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
        style={{ background: 'rgba(8,12,37,0.88)' }}
        onClick={hasKey ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-xl overflow-hidden"
        style={{
          background: '#161a33',
          border: '1px solid rgba(184,195,255,0.12)',
          boxShadow: '0 0 0 1px rgba(46,91,255,0.10), 0 32px 64px rgba(8,12,37,0.8)',
          animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Top accent — Electric Blue */}
        <div
          style={{
            height: 2,
            background: 'linear-gradient(to right, transparent, #2e5bff 40%, #00f2d1 70%, transparent)',
          }}
        />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-7">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(46,91,255,0.10)',
                  border: '1px solid rgba(46,91,255,0.28)',
                }}
              >
                <Key className="w-5 h-5" style={{ color: '#b8c3ff' }} />
              </div>
              <div>
                <h2 className="font-display font-bold text-base" style={{ color: '#dee0ff' }}>
                  API de Anthropic
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#434656' }}>
                  Requerida para activar los agentes
                </p>
              </div>
            </div>
            {hasKey && (
              <button
                onClick={onClose}
                style={{ color: '#434656' }}
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
                style={{ color: '#8e90a2', fontFamily: 'JetBrains Mono, monospace' }}
              >
                Clave API
              </label>
              <input
                type="password"
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={hasKey ? '••••••• (clave guardada)' : 'sk-ant-api03-…'}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  background: '#0d112a',
                  border: `1px solid ${focused ? 'rgba(46,91,255,0.55)' : 'rgba(184,195,255,0.10)'}`,
                  color: '#dee0ff',
                  boxShadow: focused ? '0 0 0 3px rgba(46,91,255,0.08)' : 'none',
                }}
                autoFocus
              />
            </div>

            {/* Security note */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-lg"
              style={{
                background: 'rgba(0,223,193,0.05)',
                border: '1px solid rgba(0,223,193,0.14)',
              }}
            >
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#00dfc1' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#8e90a2' }}>
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
              style={{ color: '#434656', fontFamily: 'JetBrains Mono, monospace' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#8e90a2')}
              onMouseLeave={e => (e.currentTarget.style.color = '#434656')}
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
