import { useEffect, useRef, useState } from 'react'
import Header           from './components/Header'
import Sidebar          from './components/Sidebar'
import DotGrid          from './components/DotGrid'
import ApiKeyModal      from './components/ApiKeyModal'
import ProductInput     from './components/ProductInput'
import PipelineProgress from './components/PipelineProgress'
import AgentOutputCard  from './components/AgentOutputCard'
import CampaignComplete from './components/CampaignComplete'
import CampaignViewer   from './components/CampaignViewer'
import { useWorkflow }        from './hooks/useWorkflow'
import { useCampaignHistory } from './hooks/useCampaignHistory'
import { useIsMobile }        from './hooks/useIsMobile'
import { downloadPdf }        from './lib/pdfExport'
import { AGENTS } from './agents/agentConfig'
import { PALETTE } from './design/agentTheme'

/* ─── Dimensions ─────────────────────────────────────── */
const HEADER_H       = 64
const PIPELINE_H     = 104   // desktop
const PIPELINE_H_MOB = 220   // mobile 2×2 grid
const SIDEBAR_W      = 220

/* ─── Confetti ───────────────────────────────────────── */
const FALL_VARIANTS = ['confettiFallA', 'confettiFallB', 'confettiFallC']
const CONFETTI = Array.from({ length: 65 }, (_, i) => ({
  id:       i,
  left:     `${(i * 1.56) % 100}%`,
  color:    PALETTE[i % PALETTE.length],
  delay:    `${(i * 0.031) % 1.8}s`,
  duration: `${1.4 + (i % 6) * 0.12}s`,
  w:        `${5 + (i % 5)}px`,
  h:        i % 3 === 2 ? `${14 + (i % 4)}px` : `${5 + (i % 5)}px`,
  radius:   i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '1px',
  anim:     FALL_VARIANTS[i % 3],
}))

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 100 }}>
      {CONFETTI.map(c => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            top: -20,
            left: c.left,
            width: c.w,
            height: c.h,
            background: c.color,
            borderRadius: c.radius,
            opacity: 0.85,
            animation: `${c.anim} ${c.duration} ${c.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Empty state ─────────────────────────────────────── */
function EmptyHero() {
  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-8 text-center">
      {/* Rocket SVG — Winnerly palette */}
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"
           style={{ marginBottom: 28, opacity: 0.5 }}>
        <ellipse cx="50" cy="52" rx="18" ry="32" fill="#1a1e37" stroke="#242842" strokeWidth="1.5"/>
        <path d="M50 8C36 22 32 38 32 52H68C68 38 64 22 50 8Z" fill="#242842" stroke="#2f334e" strokeWidth="1.5"/>
        <circle cx="50" cy="48" r="9" fill="#080c25" stroke="#2e5bff" strokeWidth="1.5"/>
        <circle cx="50" cy="48" r="5" fill="rgba(46,91,255,0.15)"/>
        <path d="M32 68L16 86L32 80Z" fill="#1a1e37" stroke="#242842" strokeWidth="1.5"/>
        <path d="M68 68L84 86L68 80Z" fill="#1a1e37" stroke="#242842" strokeWidth="1.5"/>
        <rect x="42" y="82" width="16" height="7" rx="2" fill="#1a1e37" stroke="#242842" strokeWidth="1.5"/>
        <ellipse cx="50" cy="100" rx="8" ry="11" fill="rgba(46,91,255,0.22)"/>
        <ellipse cx="50" cy="103" rx="5" ry="7"  fill="rgba(0,242,209,0.35)"/>
        <ellipse cx="50" cy="106" rx="2.5" ry="4" fill="rgba(184,195,255,0.55)"/>
        <circle cx="12" cy="24" r="1.2" fill="#242842"/>
        <circle cx="22" cy="8"  r="0.9" fill="#242842"/>
        <circle cx="82" cy="16" r="1.2" fill="#242842"/>
        <circle cx="92" cy="36" r="0.9" fill="#242842"/>
        <circle cx="6"  cy="50" r="0.9" fill="#242842"/>
        <circle cx="96" cy="58" r="1.2" fill="#242842"/>
      </svg>

      <h3
        className="font-display font-bold mb-2 tracking-tight"
        style={{ fontSize: 22, color: '#dee0ff', letterSpacing: '-0.02em' }}
      >
        Tu primera campaña está a un
        <br />
        <span className="text-gradient-hero">producto de distancia</span>
      </h3>
      <p className="text-sm max-w-xs" style={{ color: '#8e90a2', lineHeight: 1.8 }}>
        Escribe un producto arriba y los 4 agentes de IA construirán tu brief completo.
      </p>

      {/* Idle agent icons */}
      <div className="flex items-center gap-5 mt-10">
        {AGENTS.map((a, i) => {
          const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899']
          return (
            <div key={a.id} className="flex flex-col items-center gap-2" style={{ opacity: 0.35 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${colors[i]}12`,
                border: `1px solid ${colors[i]}22`,
                color: colors[i], fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{a.icon}</div>
              <span
                className="text-[7px] uppercase tracking-[0.2em] font-bold"
                style={{ color: colors[i], fontFamily: 'JetBrains Mono, monospace' }}
              >
                {a.role}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── App ─────────────────────────────────────────────── */
export default function App() {
  const isMobile = useIsMobile()

  const [apiKey,    setApiKey]    = useState(() => localStorage.getItem('acm_api_key') || '')
  const [showModal, setShowModal] = useState(() => !localStorage.getItem('acm_api_key'))
  const [sidebarOpen,      setSidebarOpen]      = useState(false)
  const [viewingCampaign,  setViewingCampaign]  = useState(null)

  const {
    product, setProduct,
    workflowStarted, agentStates, campaignComplete,
    startWorkflow, approveAgent, rejectAgent, reset,
  } = useWorkflow()

  const { campaigns, saveCampaign, totalCampaigns, totalCost, validatedProducts } = useCampaignHistory()

  /* Panel fade state */
  const [panelOpacity, setPanelOpacity] = useState(1)
  const approveRef = useRef(false)

  /* Confetti on complete */
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiShown = useRef(false)

  useEffect(() => {
    if (campaignComplete && !confettiShown.current) {
      confettiShown.current = true
      saveCampaign(product, agentStates)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3500)
    }
  }, [campaignComplete]) // eslint-disable-line

  /* Reset confetti flag on new workflow */
  useEffect(() => {
    if (!workflowStarted) confettiShown.current = false
  }, [workflowStarted])

  /* Derived layout values */
  const effectiveSidebarW = isMobile ? 0 : SIDEBAR_W
  const pipelineH         = isMobile ? PIPELINE_H_MOB : PIPELINE_H
  const totalTop          = HEADER_H + pipelineH
  const showPipeline      = workflowStarted && !viewingCampaign

  /* ── Handlers ──────────────────────────────────────── */
  const handleSave = key => {
    setApiKey(key)
    localStorage.setItem('acm_api_key', key)
    setShowModal(false)
  }
  const handleStart = () => {
    if (!apiKey) { setShowModal(true); return }
    startWorkflow(product, apiKey)
  }
  const handleApprove = index => {
    if (approveRef.current) return
    approveRef.current = true
    setPanelOpacity(0)
    setTimeout(() => { approveAgent(index, apiKey) }, 320)
    setTimeout(() => { setPanelOpacity(1); approveRef.current = false }, 800)
  }
  const handleReject = index => {
    setPanelOpacity(0)
    setTimeout(() => { rejectAgent(index, apiKey); setTimeout(() => setPanelOpacity(1), 150) }, 220)
  }
  const handleReset = () => {
    confettiShown.current = false
    setViewingCampaign(null)
    reset()
  }

  /* ── Displayed agent — first active/streaming/complete/error ── */
  const displayed = (() => {
    if (!workflowStarted) return null
    for (let i = 0; i < AGENTS.length; i++) {
      const s = agentStates[AGENTS[i].id]
      if (['active', 'streaming', 'complete', 'error'].includes(s.status))
        return { agent: AGENTS[i], state: s, index: i }
    }
    return null
  })()

  /* ── Render ────────────────────────────────────────── */
  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#0d112a' }}>

      {/* Ambient blobs */}
      <DotGrid />

      {/* ── Fixed Header ── */}
      <Header
        apiKey={apiKey}
        onOpenApiModal={() => setShowModal(true)}
        onReset={handleReset}
        onOpenSidebar={() => setSidebarOpen(true)}
        totalCampaigns={totalCampaigns}
        totalCost={totalCost}
        validatedProducts={validatedProducts}
        isMobile={isMobile}
      />

      {/* ── Fixed Sidebar ── */}
      <Sidebar
        campaigns={campaigns}
        onNewCampaign={handleReset}
        onViewCampaign={c => { setViewingCampaign(c); setSidebarOpen(false) }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* ── Fixed Pipeline Bar — hidden when viewing a campaign ── */}
      {showPipeline && (
        <div
          style={{
            position: 'fixed',
            top: HEADER_H,
            left: effectiveSidebarW,
            right: 0,
            height: pipelineH,
            zIndex: 35,
            background: 'rgba(8,10,15,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            padding: isMobile ? '0 12px' : '0 40px',
          }}
        >
          <PipelineProgress
            agentStates={agentStates}
            campaignComplete={campaignComplete}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* ── Main content area ── */}
      <div
        style={{
          position: 'fixed',
          top: showPipeline ? totalTop : HEADER_H,
          left: effectiveSidebarW,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 10,
          transition: 'top 0.3s ease, left 0.3s ease',
        }}
      >

        {/* Campaign history viewer */}
        {viewingCampaign && (
          <CampaignViewer
            campaign={viewingCampaign}
            onBack={() => setViewingCampaign(null)}
          />
        )}

        {/* Hero / empty state */}
        {!viewingCampaign && !workflowStarted && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '32px 20px 80px' : '52px 40px 80px' }}>
              <ProductInput
                product={product}
                setProduct={setProduct}
                onStart={handleStart}
                disabled={false}
              />
              <EmptyHero />
            </div>
          </div>
        )}

        {/* Campaign complete screen */}
        {!viewingCampaign && workflowStarted && campaignComplete && (
          <div style={{ height: '100%', overflowY: 'auto', padding: isMobile ? '16px' : '24px 32px' }}>
            <CampaignComplete
              onReset={handleReset}
              onExport={() => downloadPdf(product, agentStates)}
            />
          </div>
        )}

        {/* Single agent panel */}
        {!viewingCampaign && workflowStarted && !campaignComplete && displayed && (
          <div
            key={displayed.agent.id}
            style={{
              height: '100%',
              padding: isMobile ? '10px 10px' : '20px 32px 20px',
              opacity: panelOpacity,
              transition: 'opacity 0.28s ease',
            }}
          >
            <AgentOutputCard
              agent={displayed.agent}
              state={displayed.state}
              onApprove={() => handleApprove(displayed.index)}
              onReject={() => handleReject(displayed.index)}
              style={{ height: '100%' }}
            />
          </div>
        )}
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* API key modal */}
      {showModal && (
        <ApiKeyModal
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          hasKey={!!apiKey}
        />
      )}
    </div>
  )
}
