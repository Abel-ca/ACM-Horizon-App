import { Clock, CheckCircle2, Eye } from 'lucide-react'
import { useState } from 'react'

const ACCENT = '#6366f1'

/* ── Campaign list item ─────────────────────────────────── */
function SidebarItem({ campaign, onView }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative px-3 py-2.5 rounded-xl transition-all duration-150"
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderLeft: `2px solid ${hovered ? ACCENT : 'transparent'}`,
        paddingLeft: hovered ? 10 : 12,
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="text-[11px] font-semibold leading-snug mb-1.5" style={{ color: '#c0c8e0' }}>
        {campaign.product}
      </p>
      <div className="flex items-center justify-between gap-1">
        <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest flex-shrink-0"
              style={{ color: '#10b981' }}>
          <CheckCircle2 size={8} /> OK
        </span>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[8px] truncate" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {campaign.dateShort ?? campaign.date}
          </span>
          {campaign.estimatedCost != null && (
            <span className="text-[8px] font-mono flex-shrink-0" style={{ color: 'rgba(255,255,255,0.15)' }}>
              ${campaign.estimatedCost.toFixed(3)}
            </span>
          )}
          {/* View button — only shown when campaign has stored outputs */}
          {campaign.outputs && (
            <button
              onClick={() => onView(campaign)}
              title="Ver campaña completa"
              className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] font-semibold transition-all duration-150"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#818cf8',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.18)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'
              }}
            >
              <Eye size={8} /> Ver
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Empty state ────────────────────────────────────────── */
function SidebarEmpty() {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <svg width="56" height="64" viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg"
           style={{ marginBottom: 12, opacity: 0.35 }}>
        <ellipse cx="28" cy="30" rx="12" ry="20" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.2"/>
        <path d="M28 6 C18 16 16 24 16 30 H40 C40 24 38 16 28 6Z" fill="#252d3d" stroke="#2d3a4a" strokeWidth="1.2"/>
        <circle cx="28" cy="27" r="5" fill="#0e1117" stroke="#6366f1" strokeWidth="1"/>
        <circle cx="28" cy="27" r="2.5" fill="rgba(99,102,241,0.15)"/>
        <path d="M16 42 L8 52 L16 50Z" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.2"/>
        <path d="M40 42 L48 52 L40 50Z" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.2"/>
        <rect x="22" y="48" width="12" height="5" rx="1.5" fill="#1e2530" stroke="#2d3a4a" strokeWidth="1.2"/>
        <ellipse cx="28" cy="58" rx="5" ry="5" fill="rgba(99,102,241,0.2)"/>
        <ellipse cx="28" cy="59" rx="3" ry="3" fill="rgba(99,102,241,0.4)"/>
      </svg>
      <p className="text-[10px] font-semibold leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Aquí aparecerán<br />tus campañas
      </p>
      <p className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
        Lanza una para empezar
      </p>
    </div>
  )
}

/* ── Sidebar ────────────────────────────────────────────── */
export default function Sidebar({ campaigns, onNewCampaign, onViewCampaign, isOpen, onClose, isMobile }) {
  const isEmpty = campaigns.length === 0

  const sidebarStyle = isMobile
    ? {
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : -260,
        bottom: 0,
        zIndex: 60,
        width: 260,
        transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
      }
    : {
        position: 'fixed',
        top: 64,
        left: 0,
        bottom: 0,
        zIndex: 40,
        width: 220,
      }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      <aside
        className="flex flex-col"
        style={{
          ...sidebarStyle,
          background: 'rgba(8,10,15,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Mobile close handle */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 pt-4 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Historial</span>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* New campaign button */}
        <div className="p-4">
          <button
            onClick={() => { onNewCampaign(); onClose?.() }}
            className="w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.22)',
              color: '#6366f1',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'
              e.currentTarget.style.boxShadow = '0 0 18px rgba(99,102,241,0.12)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.22)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            + Nueva Campaña
          </button>
        </div>

        {/* Section label */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <span className="text-[8px] font-extrabold uppercase tracking-[0.28em] flex items-center gap-1.5"
                style={{ color: 'rgba(255,255,255,0.2)' }}>
            <Clock size={8} />
            Historial
          </span>
          {!isEmpty && (
            <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {campaigns.length}
            </span>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
          {isEmpty
            ? <SidebarEmpty />
            : campaigns.map(c => (
                <SidebarItem
                  key={c.id}
                  campaign={c}
                  onView={camp => { onViewCampaign(camp); onClose?.() }}
                />
              ))
          }
        </div>
      </aside>
    </>
  )
}
