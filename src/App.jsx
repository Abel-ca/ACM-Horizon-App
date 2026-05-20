import { useEffect, useRef, useState } from 'react'
import Header         from './components/Header'
import Sidebar        from './components/Sidebar'
import DotGrid        from './components/DotGrid'
import ApiKeyModal    from './components/ApiKeyModal'
import DirectorCard   from './components/DirectorCard'
import SubagentCard   from './components/SubagentCard'
import CampaignViewer from './components/CampaignViewer'
import { useWorkflow }        from './hooks/useWorkflow'
import { useCampaignHistory } from './hooks/useCampaignHistory'
import { useIsMobile }        from './hooks/useIsMobile'
import { downloadPdf }        from './lib/pdfExport'
import { AGENTS }    from './agents/agentConfig'
import { PALETTE }   from './design/agentTheme'

/* ─── Dimensions ─────────────────────────────────────── */
const HEADER_H  = 64
const SIDEBAR_W = 220

/* ─── Welcome message ────────────────────────────────── */
const WELCOME_MSG = {
  id:      'welcome',
  role:    'director',
  type:    'intro',
  content: '¡Hola! Soy el Director de Marketing de ACM Horizon. Cuéntame qué producto quieres analizar — yo valido la oportunidad, activo al equipo completo y te traigo el brief listo para lanzar.',
}

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
            position: 'absolute', top: -20, left: c.left,
            width: c.w, height: c.h, background: c.color,
            borderRadius: c.radius, opacity: 0.85,
            animation: `${c.anim} ${c.duration} ${c.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Subagents (everyone except the Director) ───────── */
const SUBAGENTS = AGENTS.slice(1) // researcher, copywriter, creative

/* ─── App ─────────────────────────────────────────────── */
export default function App() {
  const isMobile = useIsMobile()

  /* ── Persisted API key ── */
  const [apiKey,    setApiKey]    = useState(() => localStorage.getItem('acm_api_key') || '')
  const [showModal, setShowModal] = useState(() => !localStorage.getItem('acm_api_key'))

  /* ── UI state ── */
  const [sidebarOpen,     setSidebarOpen]     = useState(false)
  const [viewingCampaign, setViewingCampaign] = useState(null)
  const [showConfetti,    setShowConfetti]    = useState(false)

  /* ── Chat messages (Director chat) ── */
  const [chatMessages, setChatMessages] = useState([WELCOME_MSG])

  /* ── Workflow hook ── */
  const {
    product, setProduct,
    workflowStarted, agentStates, campaignComplete,
    startWorkflow, approveAgent, reset,
  } = useWorkflow()

  /* ── Campaign history ── */
  const { campaigns, saveCampaign, totalCampaigns, totalCost, validatedProducts } =
    useCampaignHistory()

  /* ─── Tracking refs (prevent duplicate effects) ─── */
  const confettiShown     = useRef(false)
  const autoApprovedRef   = useRef({})   // { agentId: true } once auto-approved
  const directorAddedRef  = useRef(false) // director brief added to chat
  const ctaAddedRef       = useRef(false) // campaign CTA added to chat
  const subagentNotifRef  = useRef({})   // { agentId: true } once notified

  /* ─── AUTO-APPROVE all agents when complete ────────── */
  useEffect(() => {
    if (!workflowStarted) return
    AGENTS.forEach((agent, i) => {
      const s = agentStates[agent.id]
      if (s.status === 'complete' && !autoApprovedRef.current[agent.id]) {
        autoApprovedRef.current[agent.id] = true
        // Slightly longer delay for Director so chat bubble renders first
        const delay = i === 0 ? 1400 : 700
        setTimeout(() => approveAgent(i, apiKey), delay)
      }
    })
  }, [agentStates, workflowStarted]) // eslint-disable-line

  /* ─── Director brief → chat message ────────────────── */
  useEffect(() => {
    if (!workflowStarted) return
    const s = agentStates[AGENTS[0].id]
    // Add director brief to chat when he reaches 'complete' (before auto-approve)
    if (s.status === 'complete' && !directorAddedRef.current && s.content) {
      directorAddedRef.current = true
      setChatMessages(prev => [
        ...prev,
        { id: `director-brief-${Date.now()}`, role: 'director', type: 'brief', content: s.content },
      ])
    }
    // System notification when director is approved → subagents starting
    if (s.status === 'approved' && !subagentNotifRef.current['director-approved']) {
      subagentNotifRef.current['director-approved'] = true
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: `sys-subagents-${Date.now()}`,
            role: 'system',
            type: 'system',
            content: 'Activando investigador, copywriter y director creativo...',
          },
        ])
      }, 200)
    }
  }, [agentStates, workflowStarted]) // eslint-disable-line

  /* ─── Campaign complete → confetti + CTA ───────────── */
  useEffect(() => {
    if (campaignComplete && !confettiShown.current) {
      confettiShown.current = true
      saveCampaign(product, agentStates)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3500)
    }
    if (campaignComplete && !ctaAddedRef.current) {
      ctaAddedRef.current = true
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { id: `cta-${Date.now()}`, role: 'director', type: 'cta', content: '' },
        ])
      }, 400)
    }
  }, [campaignComplete]) // eslint-disable-line

  /* ─── Reset confetti flag on new workflow ─────────── */
  useEffect(() => {
    if (!workflowStarted) confettiShown.current = false
  }, [workflowStarted])

  /* ─── Handlers ────────────────────────────────────── */
  const handleSave = key => {
    setApiKey(key)
    localStorage.setItem('acm_api_key', key)
    setShowModal(false)
  }

  const handleDirectorSend = (text) => {
    if (!apiKey) { setShowModal(true); return }

    // Add CEO bubble
    setChatMessages(prev => [
      ...prev,
      { id: `ceo-${Date.now()}`, role: 'ceo', type: 'message', content: text },
    ])

    // Reset tracking refs
    autoApprovedRef.current  = {}
    directorAddedRef.current = false
    ctaAddedRef.current      = false
    subagentNotifRef.current = {}

    // Start workflow
    setProduct(text)
    startWorkflow(text, apiKey)
  }

  const handleReset = () => {
    confettiShown.current    = false
    autoApprovedRef.current  = {}
    directorAddedRef.current = false
    ctaAddedRef.current      = false
    subagentNotifRef.current = {}
    setViewingCampaign(null)
    setSidebarOpen(false)
    setChatMessages([WELCOME_MSG])
    reset()
  }

  /* ─── Derived state for DirectorCard ─────────────── */
  const directorState  = agentStates[AGENTS[0].id]
  const isDirectorLive = directorState.status === 'active' || directorState.status === 'streaming'
  // Show live bubble only while Director is writing AND his brief isn't in chatMessages yet
  const directorBriefInChat = chatMessages.some(m => m.role === 'director' && m.type === 'brief')
  const showLiveBubble = workflowStarted && isDirectorLive && !directorBriefInChat

  /* ─── Layout metrics ─────────────────────────────── */
  const effectiveSidebarW = isMobile ? 0 : SIDEBAR_W

  /* ─── Render ──────────────────────────────────────── */
  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#0d112a' }}>

      {/* Animated background */}
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

      {/* ── Main content area ── */}
      <div
        style={{
          position: 'fixed',
          top: HEADER_H,
          left: effectiveSidebarW,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 10,
          transition: 'left 0.3s ease',
        }}
      >
        {/* ── Campaign history viewer ── */}
        {viewingCampaign && (
          <CampaignViewer
            campaign={viewingCampaign}
            onBack={() => setViewingCampaign(null)}
          />
        )}

        {/* ── Workspace (Director + Subagents) ── */}
        {!viewingCampaign && (
          <div
            style={{
              height: '100%',
              overflowY: 'auto',
              padding: isMobile ? '12px 12px 32px' : '20px 28px 40px',
            }}
          >
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>

              {/* ── Director Card (full width, prominent) ── */}
              <DirectorCard
                chatMessages={chatMessages}
                showLiveBubble={showLiveBubble}
                liveContent={directorState.content}
                directorStatus={directorState.status}
                workflowStarted={workflowStarted}
                campaignComplete={campaignComplete}
                onSend={handleDirectorSend}
                onExport={() => downloadPdf(product, agentStates)}
                onReset={handleReset}
                isMobile={isMobile}
              />

              {/* ── Subagent grid ── */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                  gap: isMobile ? 12 : 16,
                  marginTop: isMobile ? 12 : 16,
                }}
              >
                {SUBAGENTS.map((agent, i) => (
                  <SubagentCard
                    key={agent.id}
                    agent={agent}
                    state={agentStates[agent.id]}
                    index={i}
                    isMobile={isMobile}
                  />
                ))}
              </div>

              {/* ── Status footer (desktop, only during workflow) ── */}
              {!isMobile && workflowStarted && !campaignComplete && (
                <div
                  className="stagger-5"
                  style={{
                    marginTop: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#00dfc1',
                    animation: 'systemPulse 2s ease-in-out infinite',
                  }} />
                  <p style={{
                    color: '#434656', fontSize: 10.5,
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.06em',
                  }}>
                    Los subagentes trabajan en segundo plano — el Director te informará cuando terminen
                  </p>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* ── Confetti ── */}
      {showConfetti && <Confetti />}

      {/* ── API key modal ── */}
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
