import { useCallback, useEffect, useRef, useState } from 'react'
import Header           from './components/Header'
import Sidebar          from './components/Sidebar'
import DotGrid          from './components/DotGrid'
import ApiKeyModal      from './components/ApiKeyModal'
import ProductInput     from './components/ProductInput'
import PipelineProgress from './components/PipelineProgress'
import AgentOutputCard  from './components/AgentOutputCard'
import CampaignComplete from './components/CampaignComplete'
import { useWorkflow }        from './hooks/useWorkflow'
import { useCampaignHistory } from './hooks/useCampaignHistory'
import { AGENTS } from './agents/agentConfig'
import { PALETTE } from './design/agentTheme'

/* ─── Dimensions ─────────────────────────────────────── */
const HEADER_H  = 64
const PIPELINE_H = 104
const SIDEBAR_W  = 220
const TOTAL_TOP  = HEADER_H + PIPELINE_H

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

/* ─── PDF export helper ───────────────────────────────── */
const AGENT_META = {
  director:   { name: 'Director de Marketing',     color: '#6366f1' },
  researcher: { name: 'Investigador de Productos', color: '#06b6d4' },
  copywriter: { name: 'Copywriter de Conversión',  color: '#8b5cf6' },
  creative:   { name: 'Director Creativo Visual',  color: '#ec4899' },
}

function openPdf(product, agentStates) {
  const sections = Object.entries(agentStates)
    .filter(([, s]) => s.status === 'approved' && s.content)
    .map(([id, s]) => {
      const m = AGENT_META[id] || { name: id, color: '#888' }
      const esc = s.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `<section style="margin-bottom:48px">
        <h2 style="font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${m.color};border-bottom:1px solid ${m.color}33;padding-bottom:8px;margin-bottom:18px">${m.name}</h2>
        <pre style="font-family:monospace;font-size:11px;line-height:1.9;white-space:pre-wrap;word-break:break-word;color:#222">${esc}</pre>
      </section>`
    }).join('')
  const now = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/><title>ACM Horizon — ${product}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;background:#fff;color:#111;padding:48px;max-width:860px;margin:0 auto}
  @media print{body{padding:24px}.no-print{display:none}}.cover{margin-bottom:48px;padding-bottom:28px;border-bottom:3px solid #6366f1}
  .label{font-size:10px;font-weight:800;letter-spacing:.3em;text-transform:uppercase;color:#6366f1;margin-bottom:10px}.title{font-size:28px;font-weight:800;color:#080a0f;margin-bottom:6px}
  .meta{font-size:11px;color:#666}.btn{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:10px 22px;background:#6366f1;color:#fff;font-weight:800;font-size:12px;letter-spacing:.15em;text-transform:uppercase;border:none;border-radius:8px;cursor:pointer}
  </style></head><body>
  <div class="cover"><p class="label">ACM Horizon · Brief de Campaña</p><h1 class="title">${product}</h1><p class="meta">Generado el ${now}</p>
  <button class="btn no-print" onclick="window.print()">⬇ Exportar PDF</button></div>${sections}</body></html>`
  const w = window.open('', '_blank', 'width=920,height=720')
  if (!w) return
  w.document.write(html)
  w.document.close()
  setTimeout(() => w.print(), 800)
}

/* ─── Empty state ─────────────────────────────────────── */
function EmptyHero() {
  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-8 text-center">
      {/* Rocket SVG */}
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"
           style={{ marginBottom: 28, opacity: 0.5 }}>
        <ellipse cx="50" cy="52" rx="18" ry="32" fill="#1a2030" stroke="#232d3f" strokeWidth="1.5"/>
        <path d="M50 8C36 22 32 38 32 52H68C68 38 64 22 50 8Z" fill="#1e2535" stroke="#232d3f" strokeWidth="1.5"/>
        <circle cx="50" cy="48" r="9" fill="#0e1117" stroke="#6366f1" strokeWidth="1.5"/>
        <circle cx="50" cy="48" r="5" fill="rgba(99,102,241,0.15)"/>
        <path d="M32 68L16 86L32 80Z" fill="#1a2030" stroke="#232d3f" strokeWidth="1.5"/>
        <path d="M68 68L84 86L68 80Z" fill="#1a2030" stroke="#232d3f" strokeWidth="1.5"/>
        <rect x="42" y="82" width="16" height="7" rx="2" fill="#1a2030" stroke="#232d3f" strokeWidth="1.5"/>
        <ellipse cx="50" cy="100" rx="8" ry="11" fill="rgba(99,102,241,0.25)"/>
        <ellipse cx="50" cy="103" rx="5" ry="7"  fill="rgba(99,102,241,0.45)"/>
        <ellipse cx="50" cy="106" rx="2.5" ry="4" fill="rgba(165,180,252,0.6)"/>
        <circle cx="12" cy="24" r="1.2" fill="#232d3f"/>
        <circle cx="22" cy="8"  r="0.9" fill="#232d3f"/>
        <circle cx="82" cy="16" r="1.2" fill="#232d3f"/>
        <circle cx="92" cy="36" r="0.9" fill="#232d3f"/>
        <circle cx="6"  cy="50" r="0.9" fill="#232d3f"/>
        <circle cx="96" cy="58" r="1.2" fill="#232d3f"/>
      </svg>

      <h3 className="font-black mb-2 tracking-tight" style={{ fontSize: 22, color: '#f0f4ff', letterSpacing: '-0.02em' }}>
        Tu primera campaña está a un
        <br />
        <span className="text-gradient-hero">producto de distancia</span>
      </h3>
      <p className="text-sm max-w-xs" style={{ color: '#3a4255', lineHeight: 1.8 }}>
        Escribe un producto arriba y los 4 agentes de IA construirán tu brief completo.
      </p>

      {/* Idle agent icons */}
      <div className="flex items-center gap-5 mt-10">
        {AGENTS.map((a, i) => {
          const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899']
          return (
            <div key={a.id} className="flex flex-col items-center gap-2" style={{ opacity: 0.4 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${colors[i]}12`,
                border: `1px solid ${colors[i]}22`,
                color: colors[i], fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{a.icon}</div>
              <span className="text-[7px] uppercase tracking-[0.2em] font-bold" style={{ color: colors[i] }}>
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
  const [apiKey,    setApiKey]    = useState(() => localStorage.getItem('acm_api_key')    || '')
  const [metaToken, setMetaToken] = useState(() => localStorage.getItem('meta_ads_token') || '')
  const [showModal, setShowModal] = useState(() => !localStorage.getItem('acm_api_key'))

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

  /* ── Handlers ──────────────────────────────────────── */
  const handleSave = (key, newMetaToken) => {
    setApiKey(key)
    localStorage.setItem('acm_api_key', key)
    // Only overwrite the meta token if the user typed a new one
    if (newMetaToken) {
      localStorage.setItem('meta_ads_token', newMetaToken)
      setMetaToken(newMetaToken)
    }
    setShowModal(false)
  }
  const handleMetaTokenRefreshed = useCallback((newToken) => {
    setMetaToken(newToken)
    localStorage.setItem('meta_ads_token', newToken)
  }, [])

  const handleStart = () => {
    if (!apiKey) { setShowModal(true); return }
    startWorkflow(product, apiKey, metaToken, handleMetaTokenRefreshed)
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
    reset()
  }

  /* ── Displayed agent — the first non-pending, non-approved one ── */
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
    <div style={{ height: '100vh', overflow: 'hidden', background: '#080a0f' }}>

      {/* Ambient blobs */}
      <DotGrid />

      {/* ── Fixed Header ── */}
      <Header
        apiKey={apiKey}
        metaToken={metaToken}
        onOpenApiModal={() => setShowModal(true)}
        onReset={handleReset}
        totalCampaigns={totalCampaigns}
        totalCost={totalCost}
        validatedProducts={validatedProducts}
      />

      {/* ── Fixed Sidebar ── */}
      <Sidebar campaigns={campaigns} onNewCampaign={handleReset} />

      {/* ── Fixed Pipeline Bar ── */}
      {workflowStarted && (
        <div
          style={{
            position: 'fixed',
            top: HEADER_H,
            left: SIDEBAR_W,
            right: 0,
            height: PIPELINE_H,
            zIndex: 35,
            background: 'rgba(8,10,15,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 40px',
          }}
        >
          <PipelineProgress agentStates={agentStates} campaignComplete={campaignComplete} />
        </div>
      )}

      {/* ── Main content area — fixed, fills remaining space ── */}
      <div
        style={{
          position: 'fixed',
          top: workflowStarted ? TOTAL_TOP : HEADER_H,
          left: SIDEBAR_W,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 10,
          transition: 'top 0.3s ease',
        }}
      >

        {/* NOT started: hero + empty state */}
        {!workflowStarted && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '52px 40px 80px' }}>
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
        {workflowStarted && campaignComplete && (
          <div style={{ height: '100%', overflowY: 'auto', padding: '24px 32px' }}>
            <CampaignComplete
              onReset={handleReset}
              onExport={() => openPdf(product, agentStates)}
            />
          </div>
        )}

        {/* Single agent panel */}
        {workflowStarted && !campaignComplete && displayed && (
          <div
            key={displayed.agent.id}
            style={{
              height: '100%',
              padding: '20px 32px 20px',
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
          hasMetaToken={!!metaToken}
        />
      )}
    </div>
  )
}
