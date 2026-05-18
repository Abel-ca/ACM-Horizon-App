import { Key, RotateCcw, Zap } from 'lucide-react'

export default function Header({ apiKey, onApiKeyClick, onReset }) {
  return (
    <header className="flex items-center justify-between py-2">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-11 h-11">
          <div
            className="absolute inset-0 rotate-45 border"
            style={{ borderColor: 'rgba(240,180,41,0.5)' }}
          />
          <div
            className="absolute inset-[5px] rotate-45 border"
            style={{ borderColor: 'rgba(240,180,41,0.2)' }}
          />
          <Zap className="relative z-10 w-4 h-4" style={{ color: '#f0b429' }} />
        </div>

        <div>
          <h1
            className="text-xl font-extrabold tracking-[0.22em] uppercase"
            style={{ color: '#f0f2ff' }}
          >
            ACM <span style={{ color: '#f0b429' }}>HORIZON</span>
          </h1>
          <p
            className="text-[9px] tracking-[0.35em] uppercase mt-0.5"
            style={{ color: '#3a3f60', fontFamily: '"IBM Plex Mono", monospace' }}
          >
            Agencia IA · Ecuador
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            style={{
              border: '1px solid #1a1c38',
              color: '#8b90c0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(240,180,41,0.35)'
              e.currentTarget.style.color = '#f0b429'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1a1c38'
              e.currentTarget.style.color = '#8b90c0'
            }}
          >
            <RotateCcw className="w-3 h-3" />
            Nueva campaña
          </button>
        )}

        <button
          onClick={onApiKeyClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
          style={{
            border: `1px solid ${apiKey ? 'rgba(16,185,129,0.3)' : '#1a1c38'}`,
            color: apiKey ? '#10b981' : '#8b90c0',
            background: apiKey ? 'rgba(16,185,129,0.05)' : 'transparent',
          }}
        >
          <Key className="w-3 h-3" />
          {apiKey ? 'API conectada' : 'Conectar API'}
        </button>
      </div>
    </header>
  )
}
